# IPFS Backend Service

This backend service handles secure file uploads to IPFS for the freelance marketplace.

## Prerequisites

1. **Docker IPFS Node**: Make sure you have an IPFS node running in Docker on port 5001
   ```bash
   docker run -d --name ipfs_host -v $HOME/ipfs_staging:/export -v $HOME/ipfs_data:/data/ipfs -p 4001:4001 -p 127.0.0.1:8080:8080 -p 127.0.0.1:5001:5001 ipfs/go-ipfs:latest
   ```

2. **Node.js**: Ensure you have Node.js installed (v16 or higher)

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

## Running the Service

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The service will run on **http://localhost:3001**

## API Endpoints

### Upload File
- **POST** `/api/upload`
- Accepts: multipart/form-data with 'file' field
- Returns: `{success: true, data: {hash, filename, size, mimeType, gatewayUrl}}`

### Health Check
- **GET** `/api/health`
- Returns: `{success: true, connected: boolean, nodeInfo?: any}`

### Basic Health
- **GET** `/health`
- Returns: `{status: 'OK', timestamp: string}`

## Configuration

Environment variables:
- `PORT`: Server port (default: 3001)
- `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:5173)
- `IPFS_API_URL`: IPFS node API URL (default: http://localhost:5001)

## File Restrictions

- **File Types**: PDF only
- **File Size**: Maximum 10MB
- **Security**: Files are validated on both client and server side

## Troubleshooting

1. **"Upload service unavailable"**: Check if backend server is running on port 3001
2. **"IPFS node unavailable"**: Ensure Docker IPFS container is running on port 5001
3. **CORS errors**: Check FRONTEND_URL environment variable matches your frontend URL
