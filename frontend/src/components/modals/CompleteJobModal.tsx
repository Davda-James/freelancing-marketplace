import React, { useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface CompleteJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (completionMessage: string) => Promise<void>;
  jobTitle: string;
  freelancerAddress: string;
  isSubmitting?: boolean;
}

export const CompleteJobModal: React.FC<CompleteJobModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  jobTitle,
  freelancerAddress,
  isSubmitting = false
}) => {
  const [completionMessage, setCompletionMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (completionMessage.trim().length < 10) {
      alert('Please provide completion feedback of at least 10 characters');
      return;
    }

    try {
      await onSubmit(completionMessage.trim());
      onClose();
      // Reset form
      setCompletionMessage('');
    } catch (error) {
      console.error('Job completion failed:', error);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setCompletionMessage('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-xl max-w-lg w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Complete Job Review</h3>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Job Info */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-white mb-2">Job: {jobTitle}</h4>
          <p className="text-sm text-gray-400 mb-2">
            Freelancer: {freelancerAddress.slice(0, 6)}...{freelancerAddress.slice(-4)}
          </p>
          <div className="flex items-center space-x-2 text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">Final review - marking work as completed</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Completion Message */}
          <div className="mb-6">
            <label htmlFor="completionMessage" className="block text-sm font-medium text-gray-300 mb-2">
              Final Review & Completion Message <span className="text-red-400">*</span>
            </label>
            <textarea
              id="completionMessage"
              value={completionMessage}
              onChange={(e) => setCompletionMessage(e.target.value)}
              disabled={isSubmitting}
              placeholder="Review the submitted work and provide your final feedback. This confirms that the work meets your requirements and the job can be marked as completed. Once confirmed, you'll be able to release payment."
              rows={5}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none disabled:opacity-50"
              minLength={10}
              maxLength={500}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Minimum 10 characters</span>
              <span>{completionMessage.length}/500</span>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-900/20 border border-blue-700/30 p-4 rounded-lg mb-6">
            <h4 className="font-medium text-blue-300 mb-2">What happens next?</h4>
            <div className="text-sm text-blue-200 space-y-1">
              <p>• Job status will change to "Completed"</p>
              <p>• You'll be able to release payment to the freelancer</p>
              <p>• This feedback will be stored on the blockchain</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 border border-gray-700 text-gray-300 py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || completionMessage.trim().length < 10}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Completing Job...' : 'Complete Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteJobModal;
