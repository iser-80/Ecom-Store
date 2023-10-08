import express from "express";
import connectDB from "./config/db.js";
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors'
import Product from "./models/productModel.js";
const port = process.env.PORT

connectDB();

const app = express()
app.use(cors())

app.get("/", (req, res)=>{
    res.send("API is running...")
})

app.get("/api/products", async (req, res)=>{
    try {
        const products = await Product.find({})
        res.status(200).json(products)
    } catch (error) {
        res.status(404).json({message: 'not found'})
    }
})

app.get("/api/product/:id", async(req, res)=>{
    try {
        const prod = await Product.findById(req.params.id)
        res.status(200).json(prod)
    } catch (error) {
        res.status(404).json({message: 'not found'})
    }
})

app.listen(port, ()=>{
    console.log("port is connected on", port)
})