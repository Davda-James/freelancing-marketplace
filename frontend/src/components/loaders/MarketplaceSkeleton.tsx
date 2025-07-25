import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';

export const MarketplaceSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800/50 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <Search className="w-5 h-5" />
              </div>
              <Skeleton className="w-full h-12 pl-10 rounded-lg bg-gray-800" />
            </div>
            <Skeleton className="w-40 h-12 rounded-lg" />
          </div>

          <div className="mt-6 pt-6 border-t border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-900/50 border border-gray-800/50 p-6 rounded-xl space-y-4"
            >
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex justify-between pt-2">
                <Skeleton className="h-8 w-24 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
