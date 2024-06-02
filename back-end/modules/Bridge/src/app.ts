import dotenv from 'dotenv'
import express from 'express'
import axios from 'axios'

dotenv.config()
const { PORT } = process.env

const app = express()

app.use(express.json())

app.post('/event', async (req, res)=>{
  const event = req.body
  console.log(event)

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

  res.status(201).send({status: `Event "${event.type}" received`})
})
app.listen(PORT, () => console.log(`Event-Driven. Port: ${PORT}.`))