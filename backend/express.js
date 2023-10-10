import express from "express";
import connectDB from "./config/db.js";
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'
import Product from "./models/productModel.js";
import User from "./models/userModel.js";
import bcrypt from 'bcryptjs';

const port = process.env.PORT;

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("API is running...");
});

// PRODUCTS ROUTES

app.get("/api/products", async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(404).json({ message: 'Not found' });
    }
});

app.get("/api/product/:id", async (req, res) => {
    try {
        const prod = await Product.findById(req.params.id);
        res.status(200).json(prod);
    } catch (error) {
        res.status(404).json({ message: 'Not found' });
    }
});

// USER ROUTES

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
    const token = req.cookies.jwt;

    try {
        if (!token) {
            throw new Error("Unauthorized");
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decode.userId);
        next(); // Continue to the next middleware or route
    } catch (error) {
        console.log("error");
        res.status(401).json("Unauthorized or Invalid Token");
    }
};

// Middleware to verify the user is admin
const admin = (req, res, next) => {
    if (req.user && (req.user.isAdmin===true)) {
        next();
    } else {
        res.status(401).json("Not authorized, only admin can access");
    }
};

app.post("/api/users/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            // Return a 401 Unauthorized response if the user does not exist.
            return res.status(401).json("Invalid email or password 1");
        }

        // change the bcrypt location 'check user Model'
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (isPasswordValid) {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

            // Set JWT in an HttpOnly cookie
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: 'development' || 'production',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 // 1 day
            });

            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            });
        } else {
            res.status(401).json("Invalid email or password");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error");
    }
});

app.get("/api/users/profile", verifyToken, async(req, res) => {
    const user = await User.findById(req.user._id)
    if(user){
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin
        });
    }else{
        res.status(404).json('user not found')
    }
    
});

app.get("/api/users", verifyToken, admin, (req, res) => {
    res.send("Get users");
});

app.get("/api/users/:id", verifyToken, admin, (req, res) => {
    res.send("Get user by ID");
});

app.post("/api/users/register", async (req, res) => {
    const { name, email, password } = req.body;

    const existUser = await User.findOne({ email });
    if (existUser) {
        res.status(400).json("User already exists");
    } else {
        try {
            const user = await User.create({
                name,
                email,
                password,
            });

            if (user) {
                const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

                // Set JWT in an HttpOnly cookie
                res.cookie('jwt', token, {
                    httpOnly: true,
                    secure: 'development' || 'production',
                    sameSite: 'strict',
                    maxAge: 1000 * 60 * 60 * 24, // 1 day
                });

                res.status(201).json({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                });
            } else {
                res.status(400).json('Invalid user data');
            }
        } catch (error) {
            console.error(error);
            res.status(500).json("Internal Server Error");
        }
    }
});


app.post("/api/users/logout", async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({message: 'logged out successfully'})
});

app.put("/api/users/profile", verifyToken, async(req, res) => {
    const user = await User.findById(req.user._id)

    if(user){
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email

        if(req.body.password){
            user.password = req.body.password
        }

        const updatedUser = await user.save()

        res.status(201).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,       
            isAdmin: updatedUser.isAdmin,
        });
    }else{
        res.status(404).json('error')
    }
});

app.put("/api/users/:id", verifyToken, admin, (req, res) => {
    res.send("Update user by ID");
});



app.delete("/api/users/:id", verifyToken, admin, (req, res) => {
    res.send("Delete user");
});

app.listen(port, () => {
    console.log("Server is running on port", port);
});
