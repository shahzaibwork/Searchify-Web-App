//@ts-nocheck

import { useSelector } from "react-redux";
import { Button } from "../ui/button";
import { LucideArrowLeft } from "lucide-react";




export default function WishlistHeader() {

  const { currentPage } = useSelector(state => state.product)

  

    return (
      <div className="text-center mb-12">
        
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-purple-600 text-transparent bg-clip-text">
          Your Wishlist Collection
        </h1>
        <p className="mt-4 text-gray-400 text-lg">Discover and organize your favorite items in one place</p>
      </div>
    )
  }
  
  