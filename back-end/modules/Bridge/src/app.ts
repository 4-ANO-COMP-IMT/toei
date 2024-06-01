import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import express from 'express'
import axios from 'axios'

dotenv.config()
const { PORT } = process.env

const app = express()

app.use(express.json())



app.post('/event', async (req, res)=>{
  const event = req.body
  
// try{
//     axios.post('http://localhost:3000/eventos', event)
//     .then(res => console.log(res.data)).catch(err => {
//         console.log(err);
//         err = err[3000] || []
//         err.push({port: 3000, evento: event, erro: err})
//         err[3000] = err
//     });
//     res.status(201).send({status: 'Event create user received'})
// }catch(err){
//     console.log('Failed to publich create user event',err)
// }


 
  axios.post('http://localhost:3000/event', event)
//   .catch((err) => {
//     console.log('Failed to publich create user event',err)
//   })
//   res.status(201).send({status: 'Event create user received'})


// try{
//     axios.post('http://localhost:4000/eventos', event)
//     .then(res => console.log(res.data)).catch(err => {
//         console.log(err);
//         err = err[4000] || []
//         err.push({port: 4000, evento: event, erro: err})
//         err[4000] = err
//     });
//     res.status(201).send({status: 'Event login user received'})
// }catch(err){
//     console.log('Failed to publich login user event',err)
// }


// res.end()
// })
  
  axios.post('http://localhost:4000/event', event)
//   .catch((err) => {
//     console.log('Failed to publich login user event',err)
//   })
//   res.status(201).send({status: 'Event login user received'})

  res.end()
})

app.listen(PORT, () => console.log(`Event-Driven. Port: ${PORT}.`))