import type React from "react"

interface SkeletonProps {
  className?: string
  children: React.ReactNode
}

export function SkeletonLoader({ className = "", children }: SkeletonProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/70 before:to-transparent">
        {children}
      </div>
    </div>
  )
}

export function SkeletonLine({ className = "", ...props }: React.ComponentProps<"div">) {
  return <div className={`h-4 bg-gray-200 rounded ${className}`} {...props} />
}

export function SkeletonCircle({ className = "", ...props }: React.ComponentProps<"div">) {
  return <div className={`rounded-full bg-gray-200 ${className}`} {...props} />
}

export function SkeletonRect({ className = "", ...props }: React.ComponentProps<"div">) {
  return <div className={`bg-gray-200 ${className}`} {...props} />
}

