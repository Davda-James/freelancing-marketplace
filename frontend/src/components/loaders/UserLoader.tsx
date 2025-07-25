import React from 'react';

export const UserLoader: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="flex flex-col items-center space-y-6">
        <svg
          className="animate-spin h-10 w-10 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>

        <div className="w-64 h-6 bg-gray-800 rounded animate-pulse" />
        <div className="w-48 h-6 bg-gray-800 rounded animate-pulse" />
        <div className="w-40 h-6 bg-gray-800 rounded animate-pulse" />
      </div>
    </div>
  );
};
