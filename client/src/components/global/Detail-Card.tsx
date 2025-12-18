//@ts-nocheck
import { ArrowBigLeftDash, ArrowBigLeftIcon, ArrowLeft, ArrowLeftIcon, ArrowLeftToLine, ArrowUpRightFromSquareIcon, Bookmark, BookmarkCheck, BookMarked, BookmarkIcon, Link, Loader, LoaderCircleIcon, LucideArrowBigLeft, LucideArrowLeft, LucideBookmark, LucideBookMarked, SparkleIcon, Sparkles, Star, Truck } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { tr } from "framer-motion/client"



export function DetailCard({ product }) {

  const navigate = useNavigate()
  const queryParams = new URLSearchParams(location.search)
  const pid = queryParams.get('id') 

  const { currentPage } = useSelector(state => state.product)
  const { user } = useSelector(state => state.user)

  const [aiRating, setAiRating] = useState(null)

  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)


  const handleWishlist = async (product) => {

    setIsLoading(true)    
    // isWishlisted ? await addWishlist(product) : await removeWishlist(product)
    if(isWishlisted){
      await removeWishlist(product)
    }
    else{
      await addWishlist(product)
    }
    
  }

  const addWishlist = async (product) => {
   
    console.log("STARTING THE ADDing")

    try{
      const res = await fetch(`http://localhost:3000/api/wishlist`, {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({
          userId: user,
          productId: product.productId,
          title: product.ProductTitle
        })
      })
      console.log("added to wishlist")
        setIsWishlisted(true)
        setIsLoading(false)
        
      

    }catch(err){
      setIsLoading(false)
      console.error("Error while adding to wishilst: ", err)
    }
  }

  const removeWishlist = async (product) => {

    console.log("STARTING THE REMOVIN")
    try{
      const res = await fetch("http://localhost:3000/api/wishlist/remove", {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify({
          userId: user,
          productId: product.productId
        })
      })
      console.log("REMOVEDDD")
      setIsWishlisted(false)
      setIsLoading(false)
    }catch(err){
      setIsLoading(false)
      console.lof("Erro in removing wishlist: ", err)
    }
  }

  const handleBack = () => {
    navigate(`/?page=${currentPage}`)
  }

  const safeParseFloat = (value) => {
    if (typeof value === "string") {
        value = value.trim(); // Remove spaces
        if (value.startsWith("$")) {
            value = value.slice(1); // Remove "$"
        }
    }
    
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num; // Default to 0 if NaN
};

  const getRatings = async (productDetails) => {

    const { customerReviews, sellerInfo, price } = productDetails

    const { numReviews: numCustomerReviews, overallRating: customerRating } = customerReviews

    const { numReviews: numSellerReviews, sellerRating } = sellerInfo

    const { listPrice: listedPrice, currentPrice, savings } = price


    const predictInfo = {
      customerRating: safeParseFloat(customerRating), 
      numCustomerReviews: safeParseFloat(numCustomerReviews), 
      sellerRating: safeParseFloat(sellerRating), 
      numSellerReviews: safeParseFloat(numSellerReviews), 
      savings: safeParseFloat(savings), 
      listedPrice: safeParseFloat(listedPrice), 
      currentPrice: safeParseFloat(currentPrice)
    }

    try{
      const res = await fetch("http://localhost:5001/predict", {
        method: 'POST',
        headers: { 'Content-Type' : 'application/json' },
        body: JSON.stringify(predictInfo)
      })


      const data = await res.json()

      setAiRating(data.predictedRating)

      console.log("The AI Ratings received: ", data)

    }catch(err){
      console.log('Error occured : ', err)
    }

  }

  useEffect(() => {

    const checkIfWishlisted = async () => {
      try{
        const res = await fetch("http://localhost:3000/api/wishlist/check", {
          method: 'POST',
          headers: {'Content-Type' : 'application/json'},
          body: JSON.stringify({
            userId: user,
            productId: pid
          })
        })

        const data = await res.json()

        setIsWishlisted(data.isWishlisted)

        console.log("The wishlist received: ", data)
      }catch(err){
        console.log("Error while checking if wishlisted ot not: ", err)
      }
    }

     checkIfWishlisted()

  }, [product])

  return (
    <div className="flex flex-col w-full overflow-hidden transition-all duration-300">

      <div className="px-6 pt-6">
        <Button variant="ghost" className="mb-4 text-white font-bold text-lg hover:bg-gray-800/80" onClick={handleBack}>
            <LucideArrowLeft className="mr-2 h-4 w-4 text-white text-lg font-bold" size={20} />
            Product Overview
        </Button>
      </div>

      <div className="flex justify-between items-center rounded-md p-6 ">
        
        <div className="max-w-[600px] rounded-md">
          <img src={product?.imageUrl || "/placeholder.svg"} alt={product?.ProductTitle} 
          className="object-cover rounded-md w-fit" />
        </div>

        <Button
              onClick={() => getRatings(product)}
              className={`bg-gradient-to-r from-green-500/30 to-blue-500/30 hover:from-green-600/30 hover:to-blue-600/30"
              text-white border border-white/30 line-clamp-2 flex h-12`}
            >
              {
                aiRating 
                ? <span className="flex items-center"> <Star className="w-4 h-4 text-yellow-400 mr-1" /> {aiRating} </span>
                : <span className="flex gap-2 items-center"> <Sparkles /> Get AI Personalized Ratings </span>
              }
            </Button>

      </div>
      <div className="p-6">
        <h2
        onClick={() => window.open( product?.link, '_blank')}
        className="text-2xl font-bold mb-2 text-gray-100 flex  gap-2 line-clamp-3 cursor-pointer">
          
          <ArrowUpRightFromSquareIcon size={'50'}/>
        
          <span>{product?.ProductTitle}</span>
         
        </h2>
        <div className="flex items-center mb-4">
          <div className="flex items-center mr-4">
            <Star className="w-5 h-5 text-yellow-400 mr-1" />
            <span className="font-semibold text-gray-200">{product?.customerReviews?.overallRating?.toFixed(1)}</span>
          </div>
          <span className="text-gray-400">({product?.customerReviews?.numReviews} reviews)</span>
        </div>
        <div className="mb-4">
          <span className="text-3xl font-bold text-gray-100">${product?.price?.currentPrice}</span>
          <span className="ml-2 text-lg text-gray-500 line-through">${product?.price?.listPrice}</span>
          <Badge variant="destructive" className="ml-2 bg-red-500/20 text-red-300">
            Save ${product?.price?.savings}
          </Badge>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-2 text-gray-200">Product Features:</h3>
          <ul className="list-disc pl-5 space-y-1">
            {product?.productFeatures.map((feature, index) => (
              <li key={index} className="text-sm text-gray-300">
                <span className="font-medium">{feature?.feature}:</span> {feature?.details}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center mb-4">
          <Truck className="w-5 h-5 mr-2 text-green-400" />
          <span className="text-sm text-gray-300">{product?.shipping}</span>
        </div>
        <div className="text-sm text-gray-400">
          <span className="font-semibold">Sold by:</span> {product?.sellerInfo?.sellerName}
          <div className="flex items-center mt-1">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span>{product?.sellerInfo?.sellerRating?.toFixed(1)}</span>
            <span className="ml-1">({product?.sellerInfo?.numReviews} reviews)</span>
          </div>
        </div>
      </div>
      <div className="p-6">
        {
          user ?
          <Button 
          onClick={() => handleWishlist(product)}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 
          text-white ">
            {isLoading ?
            <LoaderCircleIcon /> 
            :
            <>
            <BookmarkIcon fill={`${isWishlisted ? 'white' : 'transparent'}`} /> {isWishlisted ? 'Remove from wishlist': `Wishlist`}
            </>
            }
          </Button> :

            // <Link to={'/sign-up'}>            
          <Button 
          onClick={() => navigate('/sign-up')}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 
          text-white ">
            Sign up to add to wishlist
          </Button>
            // </Link>


        }
      </div>
    </div>
  )
}
