
import { useState, useEffect } from "react"
import { ProductOverviewSkeleton } from "./product-overview-skeleton"
import { ArrowLeft, ExternalLink } from "lucide-react"

interface ProductFeature {
  label: string
  value: string
}

export function ProductOverview() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <ProductOverviewSkeleton />
  }

  return (
    <div className="w-full p-6 space-y-6 text-white">
      {/* Header */}
      <div className="flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        <h1 className="text-xl font-semibold">Product Overview</h1>
      </div>

      {/* Product Image */}
      <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-zm0MWgtDdx1QuOGd1YvmAwXSNVPcbL.png"
          alt="SGIN Laptop"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Title */}
      <div>
        <h2 className="text-xl font-semibold flex items-center gap-2">
          SGIN Laptop 14/15.6/17.3 inch Computer 2.9GHz 24GB RAM 256GB 512GB 1TB SSD HDMI
          <ExternalLink className="w-5 h-5" />
        </h2>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-3">
        <div className="flex items-center">
          <span className="text-yellow-400 text-xl font-bold">4.9</span>
        </div>
        <span className="text-gray-400">(126 reviews)</span>
      </div>

      {/* Price Section */}
      <div className="flex items-center gap-4">
        <span className="text-3xl font-bold">$$159.00</span>
        <span className="text-gray-400 line-through">$$636.00</span>
        <span className="text-red-500 bg-red-500/20 px-2 py-1 rounded">Save $75% off</span>
      </div>

      {/* Features */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Product Features:</h3>
        <ul className="space-y-3">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-gray-400 rounded-full" />
            <span>Processor: Intel Celeron N</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-gray-400 rounded-full" />
            <span>Screen Size: 17.3 in</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-gray-400 rounded-full" />
            <span>RAM Size: 24 GB</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-gray-400 rounded-full" />
            <span>SSD Capacity: 1TB</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-gray-400 rounded-full" />
            <span>Graphics Processing Type: Integrated/On-Board Graphics</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-gray-400 rounded-full" />
            <span>Operating System: Windows 11 Home</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-gray-400 rounded-full" />
            <span>Storage Type: SSD (Solid State Drive)</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

