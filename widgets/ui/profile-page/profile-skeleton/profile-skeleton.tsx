import { Skeleton } from "@/shared/ui/skeleton/skeleton";

export function ProfileLoading() {
  return (
    <div className="md:max-w-6xl md:mx-auto md:px-8 md:py-8 lg:py-12">
      <div className="md:flex md:gap-8 lg:gap-12">
        {/* Left column for desktop - profile header skeleton */}
        <div className="md:w-1/3 lg:w-1/4">
          <div className="md:bg-white md:rounded-xl md:shadow-sm md:border md:border-gray-100 md:p-6">
            <div className="flex flex-col items-center">
              {/* Avatar skeleton */}
              <div className="relative mb-4">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="absolute bottom-0 right-0">
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>

              {/* Name skeleton */}
              <Skeleton className="h-7 w-40 mb-2" />

              {/* ID skeleton */}
              <Skeleton className="h-5 w-24 mb-6" />

              {/* Contact info skeletons */}
              <div className="w-full space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Right column for desktop - menu skeleton */}
        <div className="md:w-2/3 lg:w-3/4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Menu tabs skeleton */}
            <div className="flex border-b border-gray-100">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="px-4 py-3 flex-1">
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </div>

            {/* Content skeleton */}
            <div className="p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-md" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
