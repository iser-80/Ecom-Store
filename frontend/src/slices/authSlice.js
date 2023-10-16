import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentiels: (state, action) => {
            state.userInfo = action.payload
            localStorage.setItem('userInfo', JSON.stringify(action.payload))
        }
    }
})

export const {setCredentiels} = authSlice.actions

export default authSlice.reducer