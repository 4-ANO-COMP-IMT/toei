import express from 'express';
const app = express();

export const handleEvent = app.post('/event', async (req, res) => {
    try{
        const { type , payload } = req.body;
        console.log(type);
        console.log(payload);
        res.status(200).send();
    }catch(err){
        res.end();
    }
      });
