export function OrderBlockSkeleton() {
  return (
    <>
      {/* Mobile Skeleton */}
      <div className="md:hidden">
        {/* Banner skeleton */}
        <div className="w-full h-[112px] bg-gray-200 animate-pulse" />

        {/* Product info skeleton */}
        <div className="p-4">
          <div className="w-3/4 h-6 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="w-full h-4 bg-gray-200 rounded animate-pulse mb-1" />
          <div className="w-full h-4 bg-gray-200 rounded animate-pulse mb-1" />
          <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Currency selector skeleton */}
        <div className="p-4 border-t border-gray-100">
          <div className="w-1/2 h-5 bg-gray-200 rounded animate-pulse mb-3" />
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-full h-[80px] bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* User ID form skeleton */}
        <div className="p-4 border-t border-gray-100">
          <div className="w-1/3 h-5 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="w-full h-[42px] bg-gray-200 rounded-lg animate-pulse mb-4" />
          <div className="w-1/3 h-5 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="w-full h-[42px] bg-gray-200 rounded-lg animate-pulse mb-4" />
          <div className="w-full h-5 bg-gray-200 rounded animate-pulse mb-2" />
        </div>

        {/* Payment method skeleton */}
        <div className="p-4 border-t border-gray-100">
          <div className="w-1/2 h-5 bg-gray-200 rounded animate-pulse mb-3" />
          <div className="flex gap-3 overflow-x-auto pb-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-[120px] h-[60px] bg-gray-200 rounded-lg animate-pulse flex-shrink-0"
              />
            ))}
          </div>
        </div>

        {/* Buy button skeleton */}
        <div className="fixed bottom-16 right-[16px] px-4 py-2">
          <div className="w-[140px] h-[48px] bg-gray-200 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Desktop Skeleton */}
      <div className="hidden md:block max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column - Main content */}
          <div className="lg:w-2/3">
            {/* Banner skeleton */}
            <div className="w-full h-[250px] bg-gray-200 rounded-lg animate-pulse" />

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 mt-6 overflow-hidden">
              {/* Product info skeleton */}
              <div className="p-6 border-b border-gray-100">
                <div className="w-1/2 h-7 bg-gray-200 rounded animate-pulse mb-3" />
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse mb-2" />
                <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
              </div>

              {/* Currency selector skeleton */}
              <div className="p-6 border-b border-gray-100">
                <div className="w-1/3 h-6 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="grid grid-cols-2 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="w-full h-[90px] bg-gray-200 rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              </div>

              {/* User ID form skeleton */}
              <div className="p-6 border-b border-gray-100">
                <div className="w-1/4 h-6 bg-gray-200 rounded animate-pulse mb-3" />
                <div className="w-full h-[42px] bg-gray-200 rounded-lg animate-pulse mb-4" />
                <div className="w-1/4 h-6 bg-gray-200 rounded animate-pulse mb-3" />
                <div className="w-full h-[42px] bg-gray-200 rounded-lg animate-pulse mb-4" />
                <div className="w-full h-5 bg-gray-200 rounded animate-pulse" />
              </div>

              {/* Payment method skeleton */}
              <div className="p-6">
                <div className="w-1/3 h-6 bg-gray-200 rounded animate-pulse mb-4" />
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-full h-[80px] bg-gray-200 rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Order summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <div className="w-1/2 h-6 bg-gray-200 rounded animate-pulse mb-4" />

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <div className="w-1/3 h-5 bg-gray-200 rounded animate-pulse" />
                  <div className="w-1/4 h-5 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="w-1/3 h-5 bg-gray-200 rounded animate-pulse" />
                  <div className="w-1/4 h-5 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="w-1/3 h-5 bg-gray-200 rounded animate-pulse" />
                  <div className="w-1/4 h-5 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-6">
                  <div className="w-1/3 h-6 bg-gray-200 rounded animate-pulse" />
                  <div className="w-1/4 h-6 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="w-full h-[48px] bg-gray-200 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
