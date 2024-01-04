import dotenv from "dotenv"
import connectDB from "./db/connectdb.js"

import { app } from "./app.js"
dotenv.config({
    path: './.env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
    })
})
.catch((err)=>{
    console.log("MONGO db connection failed !!! ", err);
})



app.get('/ram',(req,res)=>{
    res.send('radhamadhav , hare krishna')
})

