import React from 'react';

interface ErrorModalProps {
  message: string;
  onClose: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-gray-900 border border-red-600 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-fade-in">
        <div className="flex justify-center mb-5">
          <div className="bg-red-600 p-3 rounded-full">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 5a7 7 0 11-7 7 7 7 0 017-7z" />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-red-400 mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-300 mb-6">{message}</p>

        <div className="flex justify-center">
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
