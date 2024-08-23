import dotenv from 'dotenv'
import express from 'express'
import axios from 'axios'
import { Request, Response } from 'express'

dotenv.config()
const { PORT, ALLOWED_PORTS } = process.env;
const allowedPorts = ALLOWED_PORTS ? ALLOWED_PORTS.split(',') : [];
const allowedOrigins = allowedPorts.map(port => `http://localhost:${port}`);

const cors = require('cors');
const app = express();
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json());

// axios.defaults.withCredentials = true;

app.post('/event', async (req:Request, res:Response)=>{
  const event = req.body;
  // console.log(event)

  try{
      axios.post('http://localhost:3000/user/event', event)
  }catch(err){
      console.log('Failed to send event to user',err)
  }

  try{
    axios.post('http://localhost:4000/auth/event', event)
  }catch(err){
    console.log('Failed to send event to login',err)
  }
  
  try{
    axios.post('http://localhost:5000/artwork/event', event)
  }catch(err){
    console.log('Failed to send event to artwork',err)
  }

  res.status(201).send({status: `Event "${event.type}" received`})
})

app.listen(PORT, () => console.log(`Event-Driven. Port: ${PORT}.`))
