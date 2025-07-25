import React, { useState } from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

interface CancelJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  jobTitle: string;
  clientAddress: string;
  isCancelling: boolean;
}

const CancelJobModal: React.FC<CancelJobModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  jobTitle,
  clientAddress,
  isCancelling
}) => {
  const [confirmationText, setConfirmationText] = useState('');
  const expectedText = clientAddress.toLowerCase();
  const isConfirmationValid = confirmationText === expectedText;

  const handleConfirm = () => {
    if (isConfirmationValid && !isCancelling) {
      onConfirm();
    }
  };

  const handleClose = () => {
    setConfirmationText('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative bg-gray-900 border border-red-500/50 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header with red accent */}
        <div className="bg-red-900/20 border-b border-red-700/50 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                Cancel Job Posting
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Warning message */}
          <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-red-300 font-semibold mb-2">
                  This action cannot be undone.
                </h4>
                <p className="text-red-200 text-sm">
                  You are about to permanently cancel this job posting. All applications will be lost, 
                  and your client stake will be returned to your wallet.
                </p>
              </div>
            </div>
          </div>

          {/* Job details */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 mb-6">
            <h4 className="text-gray-300 font-semibold mb-3 text-sm">Job Details</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-400">Job Title:</span>
                <span className="text-white ml-2 font-medium">"{jobTitle}"</span>
              </div>
              <div>
                <span className="text-gray-400">Posted by:</span>
                <span className="text-white ml-2 font-mono">
                  {clientAddress.slice(0, 6)}...{clientAddress.slice(-4)}
                </span>
              </div>
            </div>
          </div>

          {/* Confirmation input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Type your client address to confirm cancellation:
            </label>
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-3 mb-2">
              <code className="text-gray-400 text-sm font-mono">
                {expectedText}
              </code>
            </div>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="Enter your client address..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 font-mono text-sm"
              disabled={isCancelling}
            />
            {confirmationText && !isConfirmationValid && (
              <p className="text-red-400 text-xs mt-1">
                Address doesn't match. Please type your client address exactly.
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleClose}
              disabled={isCancelling}
              className="flex-1 border border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700 py-2 px-4 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!isConfirmationValid || isCancelling}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all duration-300 ${
                isConfirmationValid && !isCancelling
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-red-500/25'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isCancelling ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Cancelling...</span>
                </div>
              ) : (
                'Cancel Job'
              )}
            </button>
          </div>

          {/* Additional info */}
          <div className="mt-4 p-3 bg-gray-800/30 border border-gray-700/50 rounded-lg">
            <div className="flex items-center space-x-2 text-gray-400 text-xs">
              <Trash2 className="w-3 h-3" />
              <span>Your client stake will be automatically returned upon job cancellation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelJobModal;
