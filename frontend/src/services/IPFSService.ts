// IPFS service for handling file uploads via backend API
export class IPFSService {
  private backendUrl: string;

  constructor(backendUrl: string = 'http://localhost:3001') {
    this.backendUrl = backendUrl;
  }

  /**
   * Upload a file to IPFS via backend
   * @param file - The file to upload
   * @returns Promise<{hash: string, filename: string, size: number, mimeType: string, gatewayUrl: string}> - The upload result
   */
  async uploadFile(file: File): Promise<{
    hash: string;
    filename: string;
    size: number;
    mimeType: string;
    gatewayUrl: string;
  }> {
    if (!file) {
      throw new Error('No file provided');
    }

    // Client-side validation for better UX
    if (file.type !== 'application/pdf') {
      throw new Error('Only PDF files are allowed');
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new Error('File size must be less than 10MB');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${this.backendUrl}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || `Upload failed: ${response.statusText}`);
      }

      return result.data;
    } catch (error) {
      console.error('Backend upload error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to upload file to IPFS');
    }
  }

  /**
   * Get the gateway URL for an IPFS hash
   * @param hash - The IPFS hash
   * @returns string - The gateway URL
   */
  getGatewayUrl(hash: string): string {
    console.log('🌐 Getting gateway URL for hash:', hash);
    
    // Try local IPFS gateway first (port 8080), fallback to public gateway
    const localGateway = `${import.meta.env.VITE_LOCAL_IPFS_GATEWAY}/${hash}`;
    const publicGateway = `${import.meta.env.VITE_PUBLIC_IPFS_GATEWAY}/${hash}`;

    return localGateway || publicGateway;
  }

  /**
   * Check if IPFS backend is accessible
   * @returns Promise<{connected: boolean, nodeInfo?: any}>
   */
  async isNodeAccessible(): Promise<{ connected: boolean; nodeInfo?: any }> {
    try {
      const response = await fetch(`${this.backendUrl}/api/health`);
      const result = await response.json();
      
      if (response.ok && result.success) {
        return {
          connected: result.connected,
          nodeInfo: result.nodeInfo
        };
      }
      
      return { connected: false };
    } catch (error) {
      console.error('Health check failed:', error);
      return { connected: false };
    }
  }

  /**
   * Check if backend service is running
   * @returns Promise<boolean>
   */
  async isBackendAccessible(): Promise<boolean> {
    try {
      const response = await fetch(`${this.backendUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const ipfsService = new IPFSService();
