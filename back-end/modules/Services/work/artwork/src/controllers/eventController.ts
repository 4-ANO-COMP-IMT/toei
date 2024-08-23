import express from 'express';
import { ArtworksModel } from '../models/artworks';
import { ISession, SessionModel } from '../models/sessions';
import {Request, Response} from 'express';
const app = express();

type FuncoesKeys = keyof typeof funcoes;

export const handleEvent = app.post('/event', async (req:Request, res:Response) => {
    try{
        const type: string = req.body.type
        if (type in funcoes) {
            console.log('Event received:', type);
            const functionName = type as FuncoesKeys;
            funcoes[functionName](req, res);
        }
        else{
            console.error(`Event received: ${type}, does not exist in funcoes.`);
        }
        res.status(200).send({message: 'Event received'});
    }catch(err){
        res.end();
    }
      });

      const funcoes = {
        UserRegistered:(req: Request, res:Response)=>{
const {login} = req.body.payload;
            const authArtworks = new ArtworksModel({login, artworks: []});
            authArtworks.save();
            console.log(authArtworks)
            authArtworks.save();
        }
    }