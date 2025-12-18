//@ts-nocheck

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    fullname: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,

    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setFullname: (state, action) => {
            state.fullname = action.payload
        }
    }
})

export default userSlice.reducer;
export const { setUser, setFullname } = userSlice.actions