//@ts-nocheck

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Loader from "@/components/loader";
import clsx from "clsx"
import ProductCard from "@/components/global/Product-card"
import { ArrowUpRightFromCircle, ArrowUpRightFromSquare, Backpack, BaggageClaim, CornerRightUp, GitCompareArrows, LogOut, LucideShoppingBag, ShoppingBag, ShoppingBasket, SlidersHorizontal, UserIcon } from "lucide-react";
import {Product} from "../lib/types"
import PaginationControls from "@/components/global/Pagination-controls";
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux";
import { populateProducts, selectedCompareProducts, populateRecentQuery, populatePreviousPage, populateCurrentPage } from "@/redux/productSlice";
import axios from "axios";
import { div } from "framer-motion/client";
import { setUser } from "@/redux/userSlice";
import { setPrefetchCompleted } from "@/redux/prefetchSlice";
import { setPageProducts, setPageStateDefault } from "@/redux/pageSlice";
import { useSocket } from "@/components/socket-provider";



export default function Home() {

  type prompt = {
    prompt: string,
    previousStore ?: 4 
  }

  type selectedProduct = {
    id: string,
    title: string
  }

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [ searchParams, setSearchParams ] = useSearchParams()
  const { socket } = useSocket()

  const page = Number(searchParams.get('page')) || 1

  const { products: persistedProducts, currentPage, recentQuery, previousPage } = useSelector(state => state.product)
  const { user, fullname } = useSelector(state => state.user)
  const { pages } = useSelector(state => state.pages)

  let newProducts = pages[page]?.data
  

  const [products, setProducts] = useState([])
  const [selectedProducts, setSelectedProducts] = useState<selectedProduct[]>([])

  // const [newProducts, setNewProducts] = useState()

  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [isCompareMode, setCompareMode] = useState(false)

  const productsRef = useRef<HTMLDivElement | null>(null)

  const flexOrGrid = clsx({

    'flex justify-center': loading,
    
    'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6': newProducts?.length > 0
    
    })

    const handleInput = (e) => {
      if(page !== 1){
        setSearchParams({ page: 1 })
      }

      setInput(e.target.value)
    }

    const handlePrompt = async (prompt) => {

      if(!prompt || prompt === '') return

      dispatch(setPageStateDefault())

      try{

        setLoading(true)

        const res = await axios.post("http://localhost:3000/api/handle-prompt", {
          prompt
        })

        const data = res.data

        dispatch(setPageProducts(data))
        setLoading(false)

        const nextPage = page + 1
        const query = data.query

        socket.emit("prefetchStart", nextPage, query)

        console.log("The data received: ", data)

      }catch(err){
        setLoading(false)
        console.error("Error in fetching: ", err)
      }

    }


  

    const toggleCompareMode = () => {
      
      if(isCompareMode){
        console.log("Cancel compare")
        setCompareMode((prevValue) => !prevValue)
        setSelectedProducts([])

      }else{
        console.log("Cancel compare")
        setCompareMode((prevValue) => !prevValue)
        
      }

    }


    const handleSelectedProducts = (id: string, title: string) => {
      setSelectedProducts((prevProducts) => {
        // Check if the product is already selected
        const isProductSelected = prevProducts.some(
          (p) => p.id === id && p.title === title
        );
    
        if (isProductSelected) {
          // If the product is already selected, remove it
          return prevProducts.filter((p) => p.id !== id || p.title !== title);
        } else {
          // If the product is not selected and fewer than 2 products are selected, add it
          if (prevProducts.length < 2) {
            return [...prevProducts, { id, title }];
          } else {
            // If 2 products are already selected, do nothing
            return prevProducts;
          }
        }
      });
    };



    const removeSelected = ([]) => {
      
      setSelectedProducts([])
      setCompareMode(false)

    }



    const handleNavigateCompare = () => {

      dispatch(populatePreviousPage(true))
      dispatch(selectedCompareProducts(selectedProducts))

      navigate('/compare')
    }

    const handleNavigateWishlist = () => {
      dispatch(populatePreviousPage(true))
      navigate(`/wishlist`)
    }


    const handleLogout = () => {
      try{
        const res = axios.get("http://localhost:3000/api/logout")

        const data = res.data

        console.log(data)

        dispatch(setUser(null))
        dispatch(populatePreviousPage(false))
        dispatch(setPageStateDefault())

      }catch(err){
        console.log("Error while logging out: ", err)
      }
    }

    useEffect(() => {
          if (productsRef.current) {
            productsRef.current.scrollIntoView({ behavior: "smooth" });
          }
    }, [pages]);


    useEffect(() => {
    
        if(page > 3){
          navigate('/?page=1')
        }
    
      }, [page])

    
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}

    

      <section className="relative px-4 pt-20 pb-32 overflow-hidden">
        
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
        {user ?
        <div className="absolute left-0 top-7 bg-red-300 w-full">

          <div 
          onClick={handleLogout}
          className="bg-slate-700 hover:bg-slate-500 absolute left-4 top-1 p-2 rounded-full cursor-pointer">
            <LogOut className=" text-white"/>
          </div>

          <div className="rounded-md w-fit p-1 absolute right-4">
            <div className="flex flex-col items-center bg-slate-700 rounded-full p-1.5">
              <UserIcon className="text-white  "/>
              {/* <small className="text-white">{ `Logged in as ${fullname}`  }</small> */}
            </div>
          </div>

            <LucideShoppingBag 
            onClick={handleNavigateWishlist}
            className="text-white cursor-pointer absolute top-3 right-[70px] hover:scale-110 transition-all" />
        </div>
        : 
        <Button onClick={() => navigate('/sign-up')}

        variant={"secondary"}
        className="absolute right-5 top-8 bg-slate-700 text-white hover:text-slate-700" >
          Sign up
        </Button>
        }
        <div className="relative container mx-auto max-w-6xl">
          <motion.h1
            className="text-center text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 text-transparent bg-clip-text pb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Transform Your Shopping
            <br />
            Experience with AI
          </motion.h1>
          <motion.p
            className="text-center text-gray-400 mt-6 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            From discovery to purchase, our AI assistant makes shopping faster, smarter, and more enjoyable
          </motion.p>

          {/* Search Bar */}
          <motion.div
            className="mt-12 max-w-xl mx-auto relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-25" />
                <Input
                  type="text"
                  placeholder="What do you want to shop for..."
                  value={input}
                  onChange={(e) => handleInput(e)}
                  className="relative bg-gray-900/50 border-gray-700 text-gray-100 placeholder:text-gray-400 w-full backdrop-blur-sm"
                />
              </div>
              <Button 
              onClick={() => handlePrompt(input)}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
                Search
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-4 pb-20">
        <div className="container mx-auto max-w-6xl flex flex-col justify-center">
          <div className="flex justify-between px-16">
            
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-100">Featured Products</h2>
            
            <div className="flex gap-6">

              <Button
                onClick={toggleCompareMode}
                disabled= { !user || newProducts?.length === 0  }
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
                selectedProducts.length === 2 && (
                  <Button
              onClick={handleNavigateCompare}
              className={` bg-gradient-to-r from-green-500/30 to-blue-500/30 hover:from-green-600/30 hover:to-blue-600/30
              text-white border border-white/30 sticky`}
            >
              Go to Compare <ArrowUpRightFromSquare />
            </Button>
                ) 
              }    

            </div>

            

          </div>

          {loading ?
          <Loader /> :
          <>
            <div className={flexOrGrid} ref={productsRef} >
              {         
                
                (newProducts?.map((product, index) => (
                  <ProductCard key={index} product = {product} index = {index} 
                  isSelected = {selectedProducts?.some(
                    (p) => p.id === product.id && p.title === product.title
                  )}
                  isCompareMode = {isCompareMode}
                  setSelectedProducts = {handleSelectedProducts}
                  />)))

              }
            </div>

              {newProducts?.length > 0 && <div className="flex justify-center mt-10">
                <PaginationControls setSelectedProducts = {removeSelected}/>
              </div>}
          </>}

        </div>
      </section>
    </main>
  )
}

