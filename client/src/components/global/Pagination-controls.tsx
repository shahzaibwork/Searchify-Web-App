//@ts-nocheck
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '../ui/button'
import { ArrowLeft } from 'lucide-react'
import { useSocket } from '../socket-provider'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useDispatch, useSelector } from 'react-redux'
import { setPrefetchCompleted } from '@/redux/prefetchSlice'

type PaginationControlsProps = {
  setSelectedProducts: ([]: []) => void
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ setSelectedProducts }) => {

  const location = useLocation() //for when coming back from 
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // const { socket, isConnected } = useSocket()


  const [searchParams, setSearchParams] = useSearchParams() 
  const page = Number(searchParams.get('page')) || 1

  const { pages } = useSelector(state => state.pages)

  const prefetchCompleted = pages[page].isPrefetched  

  const handleNext = () => {
    
    page > 0 && setSearchParams({ page: `${Number(page) + 1}` })
    setSelectedProducts([])
  }

  const handlePrevious = () => {
    page > 0 && setSearchParams({ page: `${Number(page) - 1}` })
    setSelectedProducts([])

  }

  // useEffect(() => {

  //   socket.on('check', (data) => {
  //     console.log("the check socket: ", data)
  //   })

  //   socket.on('prefetchingCompleted', data => {

  //     // setPrefetchCompleted(true)
  //     console.log("The socket data received: ", data)
  //   })

  // }, [socket])

  useEffect(() => {

  }, [location])

  useEffect(() => {

    if(page > 3){
      navigate('/?page=1')
    }

  }, [page])

  return (
    <div className='flex gap-5 '>

      <Button
      disabled = {page === 1}
      onClick={handlePrevious}
      className={`
      "bg-gradient-to-r from-green-500/30 to-blue-500/30 hover:from-green-600/30 hover:to-blue-600/30"
      text-white border border-white/30 w-[100px]`}
    >
        Previous
    </Button>

     {/* <div className='rounded-md relative'> */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                  {/* <div className='absolute w-full h-full cursor-pointer'></div> */}
                  <div>
                  <Button
                  disabled = {page === 3 || prefetchCompleted === false ? true : false }
                  onClick={handleNext}
                  className={`
                    "bg-gradient-to-r from-green-500/30 to-blue-500/30 hover:from-green-600/30 hover:to-blue-600/30"
                    text-white border border-white/30 w-[100px]`}
                  >
                      Next
                  </Button>
                  </div>
              </TooltipTrigger>
              <TooltipContent>
                {page === 3 ? "" : <p>{prefetchCompleted ? 'Go next' : 'Please wait...'}</p>}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          
      {/* </div>    */}
    </div>
  )
}

export default PaginationControls
