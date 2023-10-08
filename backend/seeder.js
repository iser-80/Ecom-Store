import mongoose from "mongoose";
import dotenv from "dotenv";
import Order from "./models/orderModel.js";
import Product from "./models/productModel.js";
import User from "./models/userModel.js";
import users from "./data/users.js";
import products from "./data/products.js";
import connectDB from "./config/db.js";
dotenv.config()

connectDB()

const importData = async() =>{
    try {
        await Product.deleteMany()
        await Order.deleteMany()
        await User.deleteMany()

        const allUsers = await User.insertMany(users)
        const adminUser = allUsers[0]._id

        const allProducts = products.map((product)=>{
            return {...product, user: adminUser}
        })
        await Product.insertMany(allProducts)

        console.log("all data imported")
        process.exit()

    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}


const deleteData = async() =>{
    try {
        await Product.deleteMany()
        await Order.deleteMany()
        await User.deleteMany()

        console.log("all data destroyed")
        process.exit()

    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

if(process.argv[2]==='-d'){
    importData()
}else{
    deleteData()
}