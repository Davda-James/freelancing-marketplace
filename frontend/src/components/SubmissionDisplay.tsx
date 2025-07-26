import React, { useState } from 'react';
import { FileText, Download, Eye, Edit3, Calendar, User, ExternalLink } from 'lucide-react';
import { ipfsService } from '@/services/IPFSService';

interface SubmissionDisplayProps {
  jobId: number;
  submissionHash: string;
  fileName?: string;
  submissionDate?: number;
  freelancerAddress?: string;
  isOwner?: boolean;
  onEdit?: () => void;
  className?: string;
}

export const SubmissionDisplay: React.FC<SubmissionDisplayProps> = ({
  jobId,
  submissionHash,
  fileName = 'proof-of-work.pdf',
  submissionDate,
  freelancerAddress,
  isOwner = false,
  onEdit,
  className = ''
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleView = () => {
    const url = ipfsService.getGatewayUrl(submissionHash);
    window.open(url, '_blank');
  };

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const url = ipfsService.getGatewayUrl(submissionHash);
      const response = await fetch(url);
      const blob = await response.blob();
      
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-3 rounded-lg">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Proof of Work Submitted</h3>
            <p className="text-sm text-gray-400">Job #{jobId}</p>
          </div>
        </div>
        
        {isOwner && onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg transition-all duration-200 border border-gray-600 hover:border-gray-500"
          >
            <Edit3 className="w-4 h-4" />
            <span className="text-sm">Edit</span>
          </button>
        )}
      </div>

      {/* File Info */}
      <div className="bg-gray-800/40 border border-gray-700/50 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-white font-medium">{fileName}</p>
              <p className="text-xs text-gray-500">
                IPFS: {submissionHash.slice(0, 20)}...{submissionHash.slice(-8)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={handleView}
              className="flex items-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
            >
              <Eye className="w-4 h-4" />
              <span>View</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            
            <button
              onClick={handleDownload}
              disabled={isLoading}
              className="flex items-center space-x-1 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-sm disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{isLoading ? 'Downloading...' : 'Download'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {submissionDate && (
          <div className="flex items-center space-x-3 text-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-gray-400">Submitted</p>
              <p className="text-gray-300">{formatDate(submissionDate)}</p>
            </div>
          </div>
        )}
        
        {freelancerAddress && (
          <div className="flex items-center space-x-3 text-sm">
            <User className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-gray-400">Freelancer</p>
              <p className="text-gray-300 font-mono">
                {freelancerAddress.slice(0, 6)}...{freelancerAddress.slice(-4)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* IPFS Status Indicator */}
      <div className="mt-4 pt-4 border-t border-gray-700/50">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Stored on IPFS - Decentralized & Permanent</span>
        </div>
      </div>
    </div>
  );
};

export default SubmissionDisplay;
