import express from 'express';
import cors from 'cors';
import { uploadToIPFS, checkIPFSConnection } from './uploadToIPFS';

const PORT = process.env.PORT || 3001; // Changed to 3001 to avoid conflicts

const app = express();

// Enable CORS for frontend communication
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Vite default port
  credentials: true,
}));

// Routes
app.post('/api/upload', uploadToIPFS);
app.get('/api/health', checkIPFSConnection);

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 IPFS Backend Server is running on port ${PORT}`);
  console.log(`📁 Upload endpoint: http://localhost:${PORT}/api/upload`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});