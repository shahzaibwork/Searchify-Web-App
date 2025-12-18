//@ts-nocheck

import { Button } from "@/components/ui/button"
import { Product } from "@/lib/types"
import { DetailCard } from "../global/Detail-Card"
import { div, use } from "framer-motion/client";
import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProductOverviewSkeleton } from "../ui/product-overview-skeleton";
import { useSelector } from "react-redux";

interface ProductSidebarProps {
  product: Product | null
}

const productData = {
    ProductTitle: "Wireless Noise-Cancelling Headphones",
    price: {
      listPrice: "$299.99",
      currentPrice: "$199.99",
      savings: "$100.00 (33%)",
    },
    sellerInfo: {
      sellerName: "TechGadgets Inc.",
      sellerRating: 4.7,
      numReviews: 1200,
    },
    customerReviews: {
      overallRating: 4.5,
      numReviews: 3500,
    },
    productFeatures: [
      {
        feature: "Noise Cancellation",
        details: "Advanced noise-cancelling technology for immersive sound.",
      },
      {
        feature: "Battery Life",
        details: "Up to 30 hours of playtime on a single charge.",
      },
      {
        feature: "Bluetooth Connectivity",
        details: "Seamless wireless connection with Bluetooth 5.0.",
      },
      {
        feature: "Comfort",
        details: "Soft ear cushions and adjustable headband for all-day comfort.",
      },
    ],
    shipping: "Free shipping on orders over $50",
    imageUrl: "https://m.media-amazon.com/images/I/71N76hGMHVL._AC_UL320_.jpg",
  };


  
  export default function ProductSidebar() {
    
    const [product, setProduct] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)

    const { currentPage, recentQuery, previousPage } = useSelector(state => state.product)

    const { productTitle } = useParams()
    const [searchParams] = useSearchParams()

    const fetchProductDetails = async () => {
  
      const id = searchParams.get("id") 

      setIsLoading(true)

      try{
        const res = await fetch(`http://localhost:3000/api/products/${encodeURIComponent(productTitle)}?id=${id}`)
  
        const data = await res.json();
  
        console.log("The res received: ", data)

        setProduct(data.product)
        setIsLoading(false)


        
      }catch(err){
        setIsLoading(false)
        console.log('Erros occured while fetching product Details: ', err)
      }
  
    }

    useEffect(() => {

      console.log("--FetchDeTIALCARD---")


      console.log("the recentQuery: ", recentQuery)
      console.log("The prev page bool: ", previousPage)
      console.log("The cuurentPage: ", currentPage)


      console.log("--FetchDeTIALCARD ENDD---")

     fetchProductDetails()

    }, [productTitle])


  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-900 to-gray-900"> 
        {isLoading ? 

         <ProductOverviewSkeleton />
          :
          <div>
            <DetailCard product={product}/>
          </div> 

      }
    </div>
  )
  }
