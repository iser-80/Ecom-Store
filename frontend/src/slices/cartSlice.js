import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : {cartItems: []}

const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2)
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload

            const existItem = state.cartItems.find((x) => x._id === item._id)

            if(existItem){
                state.cartItems = state.cartItems.map((x) => x._id === existItem._id ? item : x)
            }else {
                state.cartItems = [...state.cartItems, item]
            }

            // Calculate items prices
            state.itemsPrice = addDecimals(state.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0))
        
            // Calculate Shipping price order > 100$ => free , else 10$
            state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10)

            // Calculate Tax Price (15%)
            state.taxPrice = addDecimals(Number(0.15 * state.itemsPrice).toFixed(2))

            // Calculate total price
            state.totalPrice = (
                Number(state.itemsPrice) +
                Number(state.shippingPrice) +
                Number(state.taxPrice) 
            ).toFixed(2);

            localStorage.setItem('cart', JSON.stringify(state))
        },
        removeFromCart: (state, action) => {
            const itemId = action.payload
            state.cartItems = state.cartItems.filter((x) => x._id !== itemId)
        
            localStorage.setItem('cart', JSON.stringify(state))
        }
    }
})

export const {addToCart, removeFromCart} = cartSlice.actions;

export default cartSlice.reducer