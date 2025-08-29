import express from "express";
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json())

app.use('/', (req, res)=>{
    res.status(200).send("Server is running")
})

app.listen(process.env.PORT, ()=>console.log(`App listening on port ${process.env.PORT}`));