//@ts-nocheck
import React from 'react'
import { motion } from "framer-motion"
import { Button } from '../ui/button'
import { Card } from "@/components/ui/card"
import { Checkbox } from '../ui/checkbox'
import { ArrowUpRightFromSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { populatePreviousPage } from '@/redux/productSlice'

const ProductCard = ({ product, index, isCompareMode, isSelected, setSelectedProducts }) => {

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const onSelectForCompare = (id: string, title: string) => {
    setSelectedProducts(id, title)
  }

  const handleRouteToDetails = (productId: string, productTitle: string) => {
    dispatch(populatePreviousPage(true))
    navigate(`/products/${encodeURIComponent(productTitle)}?id=${productId}`)
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <Card className="group relative overflow-hidden bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all duration-300 min-h-[450px] w-[310px]">
          
          {/* Compare Checkbox */}
          {isCompareMode && (
            <div className="absolute top-2 left-2 z-10">
              <div className="relative">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => onSelectForCompare(product.id, product.title)}
                  id={`compare-${product.id}`}
                  className="peer border-2 border-white/30 bg-transparent rounded-md w-6 h-6 transition-all duration-200 data-[state=checked]:bg-transparent data-[state=checked]:border-blue-500/70"
                />
                {isSelected && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-blue-500/70 pointer-events-none"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
                <label htmlFor={`compare-${product.id}`} className="absolute inset-0 cursor-pointer" />
              </div>
              <div className="sr-only">Select for comparison</div>
            </div>
          )}

          {/* Background Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="p-4 flex flex-col h-full">
            
            {/* Image and Source Badge */}
            <div className="aspect-square relative rounded-lg overflow-hidden mb-4 flex justify-center">
              <a href={product.link} target="_blank" rel="noopener noreferrer">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </a>
              {/* Source Badge */}
              {product?.source && (
                <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded shadow-sm z-10">
                  {product.source.toUpperCase()}
                </div>
              )}
            </div>

            {/* Textual Info */}
            <div className="flex flex-col flex-1 min-h-[120px]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-gray-100 font-semibold flex-1 mr-2 line-clamp-2">
                  {product.title}
                </h3>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-gray-400">
                    {typeof product.rating === "string"
                      ? JSON.stringify(product.rating).slice(1, 4)
                      : product.rating}
                  </span>
                </div>
              </div>

              <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10">
                {product.description || "N/A"}
              </p>

              {/* Price and Button */}
              <div className="flex justify-between items-center mt-auto">
                <span className="text-lg font-bold text-green-400">
                  {typeof product.price === 'string' && product?.price.startsWith("$") && product.price !== 'N/A'
                    ? product.price
                    : "$" + product.price}
                </span>

                <Button
                  onClick={() => handleRouteToDetails(product.id, product.title)}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white z-10"
                >
                  <ArrowUpRightFromSquare className="mr-1 h-4 w-4" /> More Details
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default ProductCard
