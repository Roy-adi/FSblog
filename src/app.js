import express from 'express'
import cookieParser from "cookie-parser"

import cors from 'cors'
const app = express()

app.use(cors({
    credentials: true,
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


import userRoute from './routes/userRouter.js'
import  postRoutes from './routes/postRoutes.js'
app.use('/api/v1/users', userRoute)
app.use('/api', postRoutes);

export { app}