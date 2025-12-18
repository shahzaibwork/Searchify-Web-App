//@ts-nocheck
import { useSocket } from "@/components/socket-provider"
import { useState } from "react"
import { setPrefetchCompleted } from "../prefetchSlice"
import io from "socket.io-client"
import { socket } from "@/components/socket-provider"
import { data } from "react-router-dom"
import { setPageProducts } from "../pageSlice"

// Create the socket instance
// const socket = io("http://localhost:3000");

const socketMiddleware = (store) => {


    socket.on('PrefetchFinished', (nextPageData, page, query) => {

        console.log("The socket prefetch data received: ", page)
        console.log("The nextpage data: ", nextPageData)
        console.log("The query: ", query)
        console.log("dispatching..")
        store.dispatch(setPageProducts({ data: nextPageData, page }))

        const nextPage = page + 1

        if(nextPage <= 3){
            console.log("Emitting prefetchStart for page:", nextPage);
            console.log("the query: ", query)
            socket.emit("prefetchStart", nextPage, query)
        }


    })  



    return (next) => (action) => {
        return next(action)
    }
}

export default socketMiddleware
