import React from 'react';
import { useNavigate } from 'react-router-dom';

interface SuccessModalProps {
  title: string;
  jobId?: string | null;
  onClose: () => void;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ title, jobId, onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-gray-900 border border-green-600 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-fade-in">
        <div className="flex justify-center mb-5">
          <div className="bg-green-600 p-3 rounded-full">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        {jobId && (
        <div className="mb-3 bg-gray-800/60 border border-gray-700 rounded-lg px-3 py-2 inline-flex items-center justify-between gap-2 text-sm text-gray-300 font-mono">
          <span className="truncate max-w-[200px]">{jobId}</span>
          <button
            onClick={() => {
              navigator.clipboard.writeText(jobId);
            }}
            className="ml-2 text-blue-400 hover:text-blue-500 transition"
            title="Copy to clipboard"
          >
            Copy
          </button>
        </div>
      )}

        <h2 className="text-2xl font-semibold text-green-400 mb-2">Job Posted Successfully!</h2>
        <p className="text-gray-300 mb-6">
          Your job <strong>{title}</strong> is now live on the marketplace.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Go to Dashboard
          </button>
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
