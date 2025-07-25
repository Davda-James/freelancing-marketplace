export const AppSkeleton = () => {
  return (
    <div className="relative bg-gray-950 overflow-hidden min-h-screen">
      {/* Gradient background blobs */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-transparent" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
      </div>

      {/* Hero Skeleton */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-white space-y-10 animate-pulse">
        {/* Title */}
        <div className="h-10 w-3/5 bg-gray-800 rounded-lg shimmer" />
        {/* Subtitle */}
        <div className="h-5 w-2/3 bg-gray-700 rounded shimmer" />
        <div className="h-5 w-1/2 bg-gray-700 rounded shimmer" />

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <div className="h-12 w-48 bg-gray-800 rounded-lg shimmer" />
          <div className="h-12 w-48 bg-gray-800 rounded-lg shimmer" />
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-gray-800/50 space-y-4"
            >
              <div className="w-12 h-12 rounded-lg bg-gray-700 shimmer mx-auto" />
              <div className="h-5 w-1/2 bg-gray-700 rounded shimmer mx-auto" />
              <div className="h-4 w-2/3 bg-gray-800 rounded shimmer mx-auto" />
              <div className="h-4 w-2/5 bg-gray-800 rounded shimmer mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
