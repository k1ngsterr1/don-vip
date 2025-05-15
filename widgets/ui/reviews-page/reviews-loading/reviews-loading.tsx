"use client";

export function ReviewsSkeleton() {
  // Create an array of 5 items to represent loading reviews
  const skeletonItems = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className="w-full space-y-4">
      {skeletonItems.map((item) => (
        <div key={item} className="w-full bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-start gap-3">
            {/* Avatar skeleton */}
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />

            <div className="flex-1">
              {/* Author name skeleton */}
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />

              {/* Date skeleton */}
              <div className="h-3 w-20 bg-gray-100 rounded animate-pulse mb-3" />

              {/* Review text skeleton - multiple lines */}
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded animate-pulse w-full" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-full" />
                <div className="h-3 bg-gray-100 rounded animate-pulse w-3/4" />
              </div>

              {/* Game name skeleton (optional) */}
              <div className="h-3 w-32 bg-gray-100 rounded animate-pulse mt-3" />
            </div>

            {/* Like/dislike indicator skeleton */}
            <div className="w-6 h-6 rounded-full bg-gray-200 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
