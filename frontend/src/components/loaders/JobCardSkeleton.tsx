import React from 'react';
import '@/styles/shimmer.css';

export const JobCardSkeleton: React.FC = () => {
  return (
     <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800/50 hover:border-blue-500/50 transition-all duration-300">
      {/* Title + Status Badge */}
      <div className="flex justify-between items-start mb-4">
        <div className="skeleton h-6 w-2/3" />
        <div className="skeleton h-5 w-16 rounded-full" />
      </div>

      {/* Description lines */}
      <div className="space-y-2 mb-4">
        <div className="skeleton h-4 w-full" />
        <div className="skeleton h-4 w-5/6" />
        <div className="skeleton h-4 w-2/3" />
      </div>

      {/* Metadata: ETH, Days, Client */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="skeleton h-4 w-24" />
        <div className="skeleton h-4 w-20" />
        <div className="skeleton h-4 w-28" />
      </div>

      {/* Optional Rating */}
      <div className="skeleton h-4 w-16 mb-4" />

      {/* Bottom: posted + button */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-800">
        <div className="skeleton h-4 w-24" />
        <div className="skeleton h-8 w-28 rounded-lg" />
      </div>
    </div>
  );
};
