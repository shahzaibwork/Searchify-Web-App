//@ts-nocheck
import { useState } from "react"
// import Image from "next/image"
import { motion } from "framer-motion"
import { Cpu, MemoryStickIcon as Memory, Monitor, HardDrive, ShoppingCart, Heart, LucideArrowDownLeftFromSquare, DotIcon, TrashIcon, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { populatePreviousPage } from "@/redux/productSlice"
import { i } from "framer-motion/client"


export default function WishlistItem({ item, onToggleSelect }) {
  
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const [isHovered, setIsHovered] = useState(false)



  const handleRoute = (product) => {
    dispatch(populatePreviousPage(true))
    navigate(`/products/${encodeURIComponent(product.productTitle)}?id=${product.productId}`)
  }

  const handleToggle = (id, title) => {
    onToggleSelect(id, title)
  }


  return (
    <motion.div
      className="group relative"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -5 }}
    >
      {/* Subtle glow effect */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-xl transition-opacity duration-500"
        style={{ opacity: isHovered ? 1 : 0 }}
      />

      <div className="relative bg-gray-900/40 backdrop-blur-xl rounded-xl border border-gray-800/50 overflow-hidden">
        {/* Selection indicator */}
        {/* <div
          className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-opacity duration-300"
          style={ 1 }
        /> */}

        {/* Product Image Section */}
        <div className="relative h-[200px] bg-gradient-to-b from-gray-900/50 to-gray-900/0 align-middle flex flex-col justify-center items-center">
          <img
          src={item?.imageUrl || '' }
            // src={"https://hebbkx1anhila5yf.public.blob.vercel-storage.com/laptop.jpg-adVS2r2OT1YMUv51nrh3QuDOCPIG4E.jpeg"}
            alt={item?.ProductTitle}
            // layout="fill"
            // objectFit="contain"
            className="p-6  transition-transform duration-300 scale-90 group-hover:scale-95 object-contain rounded-md "
          />

          {/* Wishlist Button */}
          
            <button
            onClick={() => handleToggle(item.productId, item.ProductTitle)}
            className="absolute top-4 right-4 p-2 rounded-full bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 transition-colors duration-300 hover:bg-gray-800/50"
          >
            <Trash2
              className="w-4 h-4 transition-colors duration-300"
              // fill={isSelected ? "currentColor" : "none"}
              stroke={"red"}
            />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-6">
          {/* Product Info */}
          <div className="pt-10">
            <h3 className="text-md font-bold text-white mb-2">{item?.ProductTitle?.length > 26 ?  item?.ProductTitle?.slice(0, 26) + '...' : item?.productTitle}</h3>
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              {item?.price?.currentPrice.startsWith("$")? item?.price?.currentPrice : '$'+ item?.price?.currentPrice }
            </div>
          </div>

          {/* Specs Grid */}
          {/* <div className="grid grid-cols-2 gap-4">
            {
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="rounded-full bg-gray-800/50 text-gray-400"> <DotIcon /></div>
                <div>
                  <div className="text-gray-500 text-xs">{item.productFeatures[index]?.feature}</div>
                  {/* <div className="text-gray-300">
                    
                    {item.productFeatures[index]?.details.length > 10 ? 
                    item.productFeatures[index]?.details.slice(0, 10) + '...' 
                    : item.productFeatures[index]?.details.length}

                  </div> */}
                {/* </div>
              </div>
            ))} */}
          {/* </div> */} 

          {/* Action Button */}
          <Button 
          onClick={() => handleRoute(item)}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-300 shadow-lg shadow-blue-500/25">
            <LucideArrowDownLeftFromSquare className="w-4 h-4 mr-2" />
            Learn More
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

