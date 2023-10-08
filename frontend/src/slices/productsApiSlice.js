import { apiSlice } from "./apiSlice";

export const productsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: () => ({
                url: '/api/products'
            }),
            keepUnusedDataFor: 5
        }),
        getProductDetails: builder.query({
            query: (productId) => ({
                url: `/api/product/${productId}`
            }),
            keepUnusedDataFor: 5
        })
    })
})

export const {useGetProductsQuery, useGetProductDetailsQuery} = productsApiSlice