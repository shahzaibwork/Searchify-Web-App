//@ts-nocheck

import WishlistHeader from "../components/wishlist/wishlist-header"
import WishlistGrid from "../components/wishlist/wishlist-grid"
import { SearchBar } from "../components/wishlist/search-bar"
import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { useSelector } from "react-redux"
import { title } from "process"
import { useNavigate } from "react-router-dom"

export default function WishlistPage() {

  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])

  const timerRef = useRef<ReturnType<typeof setTimeout>>()
  const { user } = useSelector(state => state.user)

  const [products, setProducts] = useState([])

  const navigate = useNavigate()


  const handleSearch = async (searchTerm) => {

    if(timerRef){
      clearTimeout(timerRef.current)
    } 

    timerRef.current = setTimeout(async () => {
      const results = await getSearchResults(searchTerm)

    }, 450)

  }


  const getSearchResults = async (searchTerm) => {

    try{

      const res = await axios.post("http://localhost:3000/api/wishlist/getSearch", {
        userId: user,
        searchTerm
      })

      const data = res.data

      setSearchResults(data.matchedProducts)

      console.log("The search results: ", data)

    }catch(err){
      console.error("Error occured in getting search results: ", err)
    }

  }

  const getWishlistItems = async () => {
  
      const res = await axios.get(`http://localhost:3000/api/wishlist/fetch?userId=${user}`)
  
      console.log("The wishlist data: ", res.data)
  
      const data = res.data
  
      console.log("feature test: ", data.products[0]?.productFeatures[0]?.feature)
  
      setProducts(data.products)
  
    }

    useEffect(() => {

      getWishlistItems()
  
    }, [])

    const handleProducts = (foundProducts) => {
      setProducts(foundProducts)
    }

    useEffect(() => {

      if(!user){
        navigate('/')
      }

    }, [])

  return (
    <div className="min-h-screen  justify-center bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Cyber grid background */}

      {/* <div className="absolute inset-0 bg-grid-cyber opacity-20" /> */}

      {/* Animated gradient orbs */}
      <div className="absolute top-0 -left-40 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
      <div className="absolute top-0 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-40 left-120 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

      <div className="relative">
          
          <div className="relative px-4 pt-20 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />

            <WishlistHeader />
            <SearchBar onSearch = { handleSearch } />
          </div>

        <div className="px-4 container py-4 w-full">
          <WishlistGrid 
          products = { products }
          setProducts = { handleProducts }
          searchResults = { searchResults } />
        </div>
      </div>
    </div>
  )
}

