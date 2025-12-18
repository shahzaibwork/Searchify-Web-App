//@ts-nocheck

import { createSlice } from "@reduxjs/toolkit";
import { setPrefetchCompleted } from "./prefetchSlice";

const initialState = {
    pages: {
        1: { data: [], isLoading: false, isPrefetched: false, error: null },
        2: { data: [], isLoading: false, isPrefetched: false, error: null },
        3: { data: [], isLoading: false, isPrefetched: false, error: null },
    },

}

const pageSlice = createSlice({
    name: 'pages',
    initialState,
    reducers: {
        setPageProducts: (state, action) => {   
            const { data: products, page } = action.payload
            state.pages[page].data = products
            state.pages[page].isPrefetched = true
        },
        setPageStateDefault: (state, action) => {
            return initialState
        }
    }   

})

export const { setPageProducts, setPageStateDefault } = pageSlice.actions    
export default pageSlice.reducer