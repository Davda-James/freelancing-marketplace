import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Loader2, X } from 'lucide-react';
import { ipfsService } from '@/services/IPFSService';

export const IPFSStatusIndicator: React.FC = () => {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [ipfsStatus, setIpfsStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  useEffect(() => {
    const checkServices = async () => {
      try {
        // Check backend service
        const backendAccessible = await ipfsService.isBackendAccessible();
        setBackendStatus(backendAccessible ? 'connected' : 'disconnected');

        // Check IPFS node through backend
        if (backendAccessible) {
          const ipfsHealth = await ipfsService.isNodeAccessible();
          setIpfsStatus(ipfsHealth.connected ? 'connected' : 'disconnected');
        } else {
          setIpfsStatus('disconnected');
        }
      } catch {
        setBackendStatus('disconnected');
        setIpfsStatus('disconnected');
      }
    };

    checkServices();
    // Check every 30 seconds
    const interval = setInterval(checkServices, 30000);
    return () => clearInterval(interval);
  }, []);

  if (backendStatus === 'checking' || ipfsStatus === 'checking') {
    return (
      <div className="flex items-center space-x-2 text-xs text-gray-500">
        <Loader2 className="w-3 h-3 animate-spin" />
        <span>Checking services...</span>
      </div>
    );
  }

  if (backendStatus === 'connected' && ipfsStatus === 'connected') {
    return (
      <div className="space-y-1">
        <div className="flex items-center space-x-2 text-xs text-green-500">
          <CheckCircle className="w-3 h-3" />
          <span>Upload service ready</span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-green-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>IPFS node connected</span>
        </div>
      </div>
    );
  }

  if (backendStatus === 'disconnected') {
    return (
      <div className="space-y-1">
        <div className="flex items-center space-x-2 text-xs text-red-500">
          <X className="w-3 h-3" />
          <span>Upload service unavailable</span>
        </div>
        <div className="text-xs text-gray-500">
          Backend server not running
        </div>
      </div>
    );
  }

  if (ipfsStatus === 'disconnected') {
    return (
      <div className="space-y-1">
        <div className="flex items-center space-x-2 text-xs text-yellow-500">
          <AlertTriangle className="w-3 h-3" />
          <span>IPFS node unavailable</span>
        </div>
        <div className="text-xs text-gray-500">
          File uploads may not work
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2 text-xs text-gray-500">
      <AlertTriangle className="w-3 h-3" />
      <span>Service status unknown</span>
    </div>
  );
};
