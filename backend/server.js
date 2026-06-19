import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import express from "express";
import cors from "cors";
import rateLimit from 'express-rate-limit'

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import userRoutes from "./routes/userRoutes.js"; 

const app = express()
const PORT = 5000

connectDB()

app.use(express.json())

app.use(cors())

const globalLimitter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message:"Too many requests, Please try again later"
})
app.use(globalLimitter);

const authLimitter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message:"Too many requests, Please try again later"
})


app.use("/api/auth",authLimitter,authRoutes);
app.use("/api",productRoutes);
app.use("/api", cartRoutes);
app.use("/api", orderRoutes);
app.use("/api/admin/users", userRoutes); 

app.listen(PORT, ()=>{
 console.log(`Server running in port http://localhost:${PORT}`)
})

