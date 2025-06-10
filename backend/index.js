import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'

import connectDB from './config/mongodb.js'
// app config
const app = express()
const port = process.env.PORT || 4000
connectDB() // connecting database


// middlewares
app.use(express.json())
app.use(cors())
app.use(cookieParser())

// api endpoints

//Imports routers
import rapperRoutes from "./routes/rapper.route.js"


//Routes
app.use("/api/auth", rapperRoutes);



app.listen(port, ()=>{
    console.log(`Server running on ${port}`); 
})