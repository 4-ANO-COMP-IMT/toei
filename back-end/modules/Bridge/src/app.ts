import dotenv from 'dotenv'
import express from 'express'
import axios from 'axios'
import { Request, Response } from 'express'

dotenv.config()
const { PORT, ALLOWED_PORTS, ALLOWED_URLS, PORT_NAMES } = process.env;
const allowedPorts = ALLOWED_PORTS ? ALLOWED_PORTS.split(',') : [];
const allowedOrigins = allowedPorts.map(port => `http://localhost:${port}`);
const allowedUrls = ALLOWED_URLS ? ALLOWED_URLS.split(',') : [];
const portNames = PORT_NAMES ? PORT_NAMES.split(',') : [];

const cors = require('cors');
const app = express();
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json());

app.post('/event', async (req:Request, res:Response)=>{
  const event = req.body;
  console.log(event.type, 'event received');
  
  for (let i = 0; i < allowedPorts.length; i++) {
    try {
      axios.post(`http://localhost:${allowedPorts[i]}/${allowedUrls[i]}/event`, event)
    } catch (err) {
      console.log(`Failed to send event to ${portNames[i]}`, err)
    }
  }
  res.status(201).send({status: `Event "${event.type}" received`})
})

app.listen(PORT, () => console.log(`Event-Driven. Port: ${PORT}.`))
