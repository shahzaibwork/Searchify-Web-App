//@ts-nocheck

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import WishlistItem from "./wishlist-item"
import { Button } from "@/components/ui/button"
import { ArrowUpRightFromSquare, ChevronLeft, ChevronRight, LucideArrowLeft, SlidersHorizontal } from "lucide-react"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import Loader from "../loader"
import { useNavigate } from "react-router-dom"
import { populatePreviousPage, selectedCompareProducts } from "@/redux/productSlice"



export default function WishlistGrid({ searchResults, products, setProducts }) {
  
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { user } = useSelector(state => state.user)
  const { currentPage } = useSelector(state => state.product)

  const [isLoading, setIsLoading] = useState(false)

  // const [selectedItems, setSelectedItems] = useState([])

  // const [isCompareMode, setCompareMode] = useState(false)


  const toggleItemSelection = async (id: string, title: string) => {
    try {
      // Step 1: Remove the item from the local state
      const updatedProducts = products.filter(product => product.productId !== id);
      setProducts(updatedProducts);

      // Step 2: Send a POST request to delete the item from the wishlist
      const response = await axios.post('http://localhost:3000/api/wishlist/delete', {
        title,
        id,
        userId: user
      });

      // Log the response for debugging
      console.log('Delete response:', response.data);

    } catch (error) {
      console.error('Error deleting item from wishlist:', error);

      // If the request fails, revert the local state to its previous value
      setProducts(products);
    }
  };

  // useEffect(() => {

  //   console.log("selectedItems: ", selectedItems)
  // }, [selectedItems])

  const handleBack = () => {
    navigate(`/?page=${currentPage}`)
  }

  // const toggleCompareMode = () => {
      
  //   if(isCompareMode){
  //     console.log("Cancel compare")
  //     setCompareMode((prevValue) => !prevValue)
  //     setSelectedItems([])

  //   }else{
  //     console.log("Cancel compare")
  //     setCompareMode((prevValue) => !prevValue)
      
  //   }

  // }

  // const handleNavigateCompare = () => {
  
  //       dispatch(populatePreviousPage(true))
  //       dispatch(selectedCompareProducts(selectedItems))
  
  //       navigate('/compare')
  //     }
  
  //     const handleNavigateWishlist = () => {
  //       dispatch(populatePreviousPage(true))
  //       navigate(`/wishlist`)
  //     }

  useEffect(() => {


    if(searchResults){
      setProducts(searchResults)
    }
        
  }, [searchResults])

  return (
    <div>
      <div className="flex justify-between items-center mb-8 w-full">
      
      <div className="">
          <Button variant="ghost" className="flex justify-center text-white font-bold text-lg hover:bg-gray-800/80" 
          onClick={handleBack}>
              <LucideArrowLeft className="mr-2 h-4 w-4 text-white text-lg font-bold" size={20} />
              Product Overview
          </Button>
      </div>

      {/* <h2 className="text-2xl font-semibold text-white">Featured Items</h2> */}

      {/* <div className="flex gap-2">
        
        <Button
          // onClick={toggleCompareMode}
          disabled= { !user || products.length === 0  }
          className={`${
            isCompareMode
              ? "bg-red-500/30 hover:bg-red-600/30"
              : `bg-gradient-to-r from-green-600/30 to-blue-600/30
                text-white border border-white/30 hover:from-green-600/30 hover:to-blue-600/30`
          } h-9`}
        >
          {isCompareMode ? "Cancel Compare" : `Compare`} <SlidersHorizontal className="h-4 w-4 mr-2" />
        </Button>

        {
          selectedItems.length === 2 && (
          <Button
          onClick={handleNavigateCompare}
          className={` bg-gradient-to-r from-green-500/30 to-blue-500/30 hover:from-green-600/30 hover:to-blue-600/30
          text-white border border-white/30 sticky`}
        >
          Go to Compare <ArrowUpRightFromSquare />
        </Button>
            )}  

      </div> */}
      </div>

     {isLoading ?

      <Loader />
      :
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products?.map((product, index) => (
          
            <WishlistItem
              key={product.productId}
              item={product}
              // isSelected={selectedItems?.some(
              //   (p) => p.id === product.productId && p.title === product.ProductTitle
              // )}
              onToggleSelect={(id, title) => toggleItemSelection(id, title)}
              // isCompareMode = {isCompareMode}
            />
          ))}
      </div>
    }
    </div>
  )
}

