import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import http from "http"
import connectDB from './config/mongodb.js'
import { initSocket } from './socket.js'
// app config
const app = express()
const port = process.env.PORT || 4000
connectDB() // connecting database
import { connectCloudinary } from './config/connectCloudinary.js'
connectCloudinary();
const server=http.createServer(app);
initSocket(server);

// middlewares
app.use(express.json())
app.use(cors())
app.use(cookieParser())


// api endpoints

//Imports routers
import "./utils/utils.js"
import authRoutes from "./routes/auth.route.js"
import battleRoutes from "./routes/battle.route.js"
import rapperRoutes from "./routes/rapper.route.js"
import mediaRoutes from "./routes/media.routes.js"
import emailVerificationRoutes from "./routes/emailVerification.route.js"
import voteRoutes from "./routes/vote.routes.js"


//Routes
app.use("/api/auth", authRoutes);
app.use("/api/battles", battleRoutes);
app.use("/api/rappers", rapperRoutes);
app.use("/api/media",mediaRoutes)
app.use("/api/email-verification", emailVerificationRoutes)
app.use("/api/votes",voteRoutes);



server.listen(port, ()=>{
    console.log(`Server running on ${port}`); 
})