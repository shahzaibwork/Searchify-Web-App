import { SkeletonLoader, SkeletonLine, SkeletonCircle, SkeletonRect } from "./skeleton-loader"

export function ContentSkeleton() {
  return (
    <SkeletonLoader className="max-w-2xl mx-auto p-4 space-y-4">
      <div className="flex items-center space-x-4">
        <SkeletonCircle className="w-12 h-12" />
        <div className="space-y-2 flex-1">
          <SkeletonLine className="w-1/4" />
          <SkeletonLine className="w-1/3" />
        </div>
      </div>
      <SkeletonRect className="h-40 w-full rounded" />
      <div className="space-y-2">
        <SkeletonLine className="w-full" />
        <SkeletonLine className="w-5/6" />
        <SkeletonLine className="w-4/6" />
      </div>
      <div className="flex justify-between items-center">
        <SkeletonLine className="w-20" />
        <SkeletonCircle className="w-8 h-8" />
      </div>
    </SkeletonLoader>
  )
}

