import express from "express";
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from "mongoose";
import containerRoutes from './routes/containerRoutes.js'

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json())
app.use('/api/containers', containerRoutes);


mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB connected"))
.catch((err)=>console.log(err))



app.listen(process.env.PORT, ()=>console.log(`App listening on port ${process.env.PORT}`));