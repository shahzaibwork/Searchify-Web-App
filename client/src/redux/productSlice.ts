//@ts-nocheck

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    loading: false,
    compareProducts: null,
    currentPage: 1,
    previousPage: false
}

const productSlice = createSlice({
    name: 'product',
    initialState,

    reducers: {

        selectedCompareProducts: (state, action) => { //for compare products in compare page
            state.compareProducts = action.payload
        },
        populateCurrentPage: (state, action) => {
            state.currentPage = action.payload
        },
        populatePreviousPage: (state, acion) => {
            state.previousPage = acion.payload
        }
    }
})


export default productSlice.reducer;
export const { selectedCompareProducts, populateCurrentPage, populatePreviousPage} = productSlice.actions