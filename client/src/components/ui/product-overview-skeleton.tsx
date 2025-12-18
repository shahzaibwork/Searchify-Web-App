import { SkeletonLoader, SkeletonLine, SkeletonRect } from "./skeleton-loader"

export function ProductOverviewSkeleton() {
  return (
    <div className="flex flex-col w-full overflow-hidden transition-all duration-300">
      {/* Header with back button */}
      <SkeletonLoader>
        <div className="px-6 pt-6">
          <SkeletonRect className="h-10 w-44 rounded-md bg-gray-700/60" />
        </div>

        {/* Product Image */}
        <div className="flex justify-left rounded-md p-6">
          <SkeletonRect className="h-[300px] w-[400px] rounded-md bg-gray-800/60" />
        </div>
      </SkeletonLoader>

      {/* Content Section */}
      <SkeletonLoader className="p-6 space-y-6">
        {/* Title with icon */}
        <div className="flex gap-2 items-start">
          {/* <SkeletonRect className="w-10 h-10 shrink-0 bg-gray-800/60" /> */}
          <div className="space-y-2 flex-1">
            <SkeletonLine className="w-full h-7 bg-gray-800/60" />
            <SkeletonLine className="w-4/5 h-7 bg-gray-800/60" />
          </div>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-4">
          {/* <div className="flex items-center gap-2">
            <SkeletonRect className="w-5 h-5 bg-gray-800/60" />
            <SkeletonRect className="w-8 h-6 bg-gray-800/60" />
          </div> */}
          {/* <SkeletonRect className="w-24 h-5 bg-gray-800/60" /> */}
        </div>

        {/* Price Section */}
        {/* <div className="flex items-center gap-4">
          <SkeletonRect className="w-28 h-9 bg-gray-800/60" />
          <SkeletonRect className="w-20 h-7 bg-gray-800/60" />
          <SkeletonRect className="w-32 h-6 rounded-full bg-red-500/20" />
        </div> */}

        {/* Features */}
        <div className="space-y-4 mt-10">
          {/* <SkeletonLine className="w-40 h-6 bg-gray-800/60" /> */}
          <div className="space-y-3 pl-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <SkeletonRect className="w-2 h-2 rounded-full bg-gray-800/60" />
                <SkeletonLine className="w-11/12 h-5 bg-gray-800/60" />
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Info */}
        <div className="flex items-center gap-2 mt-2">
          <SkeletonRect className="w-5 h-5 bg-gray-800/60" />
          <SkeletonLine className="w-48 h-5 bg-gray-800/60" />
        </div>

        {/* Seller Info */}
        {/* <div className="space-y-2">
          <SkeletonLine className="w-40 h-5 bg-gray-800/60" />
          <div className="flex items-center gap-2">
            <SkeletonRect className="w-4 h-4 bg-gray-800/60" />
            <SkeletonLine className="w-32 h-5 bg-gray-800/60" />
          </div>
        </div> */}
      </SkeletonLoader>

      {/* Wishlist Button */}
      {/* <div className="p-6">
        <SkeletonRect className="w-full h-10 rounded-md bg-gradient-to-r from-blue-500/30 to-purple-500/30" />
      </div> */}
    </div>
  )
}

