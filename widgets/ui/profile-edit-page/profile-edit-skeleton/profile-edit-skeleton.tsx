import { Skeleton } from "@/shared/ui/skeleton/skeleton";

export function ProfileEditSkeleton() {
  return (
    <main className="px-4 md:px-8 lg:px-0 md:max-w-4xl md:mx-auto md:py-8">
      {/* Desktop background decorative elements - only visible on desktop */}
      <div className="hidden md:block absolute top-0 right-0 w-1/3 h-64 bg-blue-50 opacity-50 -z-10"></div>
      <div className="hidden md:block absolute top-64 left-0 w-1/4 h-96 bg-blue-50 opacity-50 -z-10"></div>

      {/* Desktop card container - only visible on desktop */}
      <div className="md:bg-white md:shadow-md md:rounded-xl md:p-8 md:border md:border-gray-100">
        <div className="md:flex md:items-start">
          {/* Left column with header on desktop */}
          <div className="md:w-1/3 md:pr-8 md:border-r md:border-gray-100">
            <div className="flex flex-col items-center py-6 md:py-4">
              {/* Avatar skeleton */}
              <div className="relative mb-4">
                <Skeleton className="h-24 w-24 md:h-32 md:w-32 rounded-full" />
                <div className="absolute bottom-0 right-0 hidden md:block">
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>

              {/* User ID skeleton */}
              <Skeleton className="h-5 w-32 mb-2" />

              {/* Name skeleton */}
              <Skeleton className="h-7 w-48 mb-6" />

              {/* Last update info skeleton - desktop only */}
              <div className="hidden md:block w-full mt-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-5 w-1/2 mx-auto" />
                </div>
              </div>

              {/* Edit button skeleton - desktop only */}
              <div className="hidden md:block w-full mt-6">
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            </div>
          </div>

          {/* Right column with form on desktop */}
          <div className="md:w-2/3 md:pl-8">
            {/* Title skeleton - desktop only */}
            <Skeleton className="hidden md:block h-8 w-64 mb-6" />

            {/* Form fields skeleton */}
            <div className="space-y-5 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
              {/* First column */}
              <div className="space-y-5">
                <div>
                  <Skeleton className="h-5 w-24 mb-2" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
                <div>
                  <Skeleton className="h-5 w-24 mb-2" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
                <div>
                  <Skeleton className="h-5 w-24 mb-2" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
              </div>

              {/* Second column */}
              <div className="space-y-5">
                <div>
                  <Skeleton className="h-5 w-24 mb-2" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
                <div>
                  <Skeleton className="h-5 w-24 mb-2" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
                <div>
                  <Skeleton className="h-5 w-24 mb-2" />
                  <Skeleton className="h-12 w-full rounded-lg" />
                </div>
              </div>
            </div>

            {/* Form buttons skeleton - desktop only */}
            <div className="hidden md:flex md:justify-between md:mt-8 md:pt-6 md:border-t md:border-gray-100">
              <Skeleton className="h-10 w-24 rounded-lg" />
              <Skeleton className="h-10 w-32 rounded-lg" />
            </div>

            {/* Mobile submit button skeleton */}
            <div className="mt-6 md:hidden">
              <Skeleton className="h-12 w-full rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
