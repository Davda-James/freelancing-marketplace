import React, { useState, useRef } from 'react';
import { Upload, FileText, X, Loader2, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { ipfsService } from '@/services/IPFSService';

interface SubmitProofOfWorkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (ipfsHash: string, fileName: string) => Promise<void>;
  jobTitle: string;
  isEditing?: boolean;
  existingHash?: string;
  existingFileName?: string;
}

export const SubmitProofOfWorkModal: React.FC<SubmitProofOfWorkModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  jobTitle,
  isEditing = false,
  existingHash,
  existingFileName
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [ipfsHash, setIpfsHash] = useState<string>(existingHash || '');
  const [uploadResult, setUploadResult] = useState<{
    hash: string;
    filename: string;
    size: number;
    mimeType: string;
    gatewayUrl: string;
  } | null>(null);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setError('');
      setUploadStatus('idle');
      setIpfsHash('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadStatus('uploading');
    setError('');

    try {
      const result = await ipfsService.uploadFile(selectedFile);
      setUploadResult(result);
      setIpfsHash(result.hash);
      setUploadStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploadStatus('error');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!ipfsHash || (!selectedFile && !isEditing)) return;

    setSubmitting(true);
    setError('');

    try {
      const fileName = uploadResult?.filename || selectedFile?.name || existingFileName || 'proof-of-work.pdf';
      await onSubmit(ipfsHash, fileName);
      onClose();
      // Reset state
      setSelectedFile(null);
      setIpfsHash('');
      setUploadResult(null);
      setUploadStatus('idle');
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (uploading || submitting) return;
    onClose();
    // Reset state
    setSelectedFile(null);
    setIpfsHash('');
    setUploadResult(null);
    setUploadStatus('idle');
    setError('');
  };

  const canSubmit = ipfsHash && (selectedFile || isEditing);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div>
            <h3 className="text-xl font-semibold text-white">
              {isEditing ? 'Edit Proof of Work' : 'Submit Proof of Work'}
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              {jobTitle}
            </p>
          </div>
          <button
            onClick={handleClose}
            disabled={uploading || submitting}
            className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* File Upload Section */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-300">
              Upload PDF Document
            </label>
            
            {/* File Input */}
            <div className="relative">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading || submitting}
              />
              
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                  selectedFile
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
                } ${(uploading || submitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex flex-col items-center space-y-3">
                  {selectedFile ? (
                    <>
                      <FileText className="w-12 h-12 text-blue-500" />
                      <div>
                        <p className="text-white font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-gray-400">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400" />
                      <div>
                        <p className="text-white font-medium">Choose PDF file</p>
                        <p className="text-sm text-gray-400">
                          Click to browse or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Maximum file size: 10MB
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Upload Button */}
            {selectedFile && uploadStatus !== 'success' && (
              <button
                onClick={handleUpload}
                disabled={uploading || submitting}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Uploading to IPFS...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload to IPFS</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Upload Status */}
          {uploadStatus === 'success' && uploadResult && (
            <div className="bg-green-900/20 border border-green-700/50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-green-300 font-medium">File uploaded successfully!</p>
                  <div className="mt-2 space-y-1">
                    <p className="text-sm text-green-400">
                      <strong>File:</strong> {uploadResult.filename}
                    </p>
                    <p className="text-sm text-green-400">
                      <strong>Size:</strong> {(uploadResult.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <p className="text-sm text-green-400">
                      <strong>IPFS Hash:</strong> <code className="bg-green-900/30 px-2 py-1 rounded text-xs break-all">{uploadResult.hash}</code>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-900/20 border border-red-700/50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <div>
                  <p className="text-red-300 font-medium">Error</p>
                  <p className="text-sm text-red-400 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Existing File Info (for editing) */}
          {isEditing && !selectedFile && (
            <div className="bg-gray-800/50 border border-gray-700 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-gray-300 font-medium">Current Submission</p>
                  <p className="text-sm text-gray-400">{existingFileName}</p>
                  {existingHash && (
                    <p className="text-xs text-gray-500 mt-1">
                      IPFS Hash: {existingHash.slice(0, 20)}...
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-900/20 border border-blue-700/50 p-4 rounded-lg">
            <h4 className="text-blue-300 font-medium mb-2">📋 Submission Guidelines</h4>
            <ul className="text-sm text-blue-200 space-y-1">
              <li>• Upload your completed work as a PDF document</li>
              <li>• Files are processed through our secure backend service</li>
              <li>• Stored on IPFS for decentralized access</li>
              <li>• Maximum file size: 10MB</li>
              <li>• Only PDF files are accepted</li>
              <li>• Make sure your work is complete before submitting</li>
            </ul>
          </div>

          {/* Backend Status Warning */}
          {error && error.includes('fetch') && (
            <div className="bg-red-900/20 border border-red-700/50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <div>
                  <p className="text-red-300 font-medium">Backend Service Unavailable</p>
                  <p className="text-sm text-red-400 mt-1">
                    Please ensure the IPFS backend service is running on port 3001.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-800">
          <button
            onClick={handleClose}
            disabled={uploading || submitting}
            className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || uploading || submitting}
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{isEditing ? 'Updating...' : 'Submitting...'}</span>
              </>
            ) : (
              <span>{isEditing ? 'Update Submission' : 'Submit Proof of Work'}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
