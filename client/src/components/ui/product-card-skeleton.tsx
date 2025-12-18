import { SkeletonLoader, SkeletonLine, SkeletonRect } from "./skeleton-loader"

export function ProductCardSkeleton() {
  return (
    <div className="bg-gray-800/40 rounded-lg overflow-hidden shadow-sm w-[500px]">
      <SkeletonLoader className="space-y-2">
        {/* Image placeholder */}
        <SkeletonRect className="w-full aspect-square bg-gray-700/60" />

        <div className="p-3 space-y-2">
          {/* Title */}
          <SkeletonLine className="w-5/6 h-4 bg-gray-700/60" />

          {/* Price */}
          <SkeletonRect className="w-16 h-5 bg-gray-700/60" />

          {/* Rating */}
          <div className="flex items-center space-x-1">
            <SkeletonRect className="w-4 h-4 bg-gray-700/60" />
            <SkeletonLine className="w-8 h-3 bg-gray-700/60" />
          </div>
        </div>
      </SkeletonLoader>
    </div>
  )
}

