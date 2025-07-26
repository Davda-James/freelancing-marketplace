import { Request, Response } from 'express';
import multer from 'multer';
import fetch from 'node-fetch';
import FormData from 'form-data';

// Configure multer for file upload handling
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Only allow PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

// IPFS node configuration
const IPFS_API_URL = process.env.IPFS_API_URL || 'http://localhost:5001';

export async function uploadToIPFS(req: Request, res: Response): Promise<void> {
  // Use multer middleware
  upload.single('file')(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          res.status(400).json({ 
            success: false, 
            error: 'File size too large. Maximum allowed size is 10MB.' 
          });
          return;
        }
      }
      res.status(400).json({ 
        success: false, 
        error: err.message || 'File upload failed' 
      });
      return;
    }

    if (!req.file) {
      res.status(400).json({ 
        success: false, 
        error: 'No file provided' 
      });
      return;
    }

    try {
      // Upload to IPFS
      const ipfsHash = await uploadFileToIPFS(req.file.buffer, req.file.originalname);
      
      res.json({
        success: true,
        data: {
          hash: ipfsHash,
          filename: req.file.originalname,
          size: req.file.size,
          mimeType: req.file.mimetype,
          gatewayUrl: `${IPFS_API_URL}/ipfs/${ipfsHash}`
        }
      });
    } catch (error) {
      console.error('IPFS upload error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to upload file to IPFS'
      });
    }
  });
}

async function uploadFileToIPFS(fileBuffer: Buffer, filename: string): Promise<string> {
  const formData = new FormData();
  formData.append('file', fileBuffer, {
    filename: filename,
    contentType: 'application/pdf',
  });

  const response = await fetch(`${IPFS_API_URL}/api/v0/add`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`IPFS upload failed: ${response.statusText}`);
  }

  const result = await response.json() as { Hash: string };
  return result.Hash;
}

// Health check function to verify IPFS connection
export async function checkIPFSConnection(req: Request, res: Response): Promise<void> {
  try {
    const response = await fetch(`${IPFS_API_URL}/api/v0/id`, {
      method: 'POST',
    });

    if (response.ok) {
      const result = await response.json();
      res.json({
        success: true,
        connected: true,
        nodeInfo: result
      });
    } else {
      res.json({
        success: true,
        connected: false,
        error: 'IPFS node not responding'
      });
    }
  } catch (error) {
    res.json({
      success: true,
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}