import express from 'express';
import { ArtworksModel } from '../models/artworks';
const app = express();

type FuncoesKeys = keyof typeof funcoes;

export const handleEvent = app.post('/event', async (req, res) => {
    try{
        const type: string = req.body.type
        const payload = req.body.payload
        if (type in funcoes) {
            const functionName = type as FuncoesKeys;
            funcoes[functionName](payload);
        }
        else{
            console.error(`Error: Function ${type} does not exist in funcoes.`);
        }
        res.status(200).send();
    }catch(err){
        res.end();
    }
      });

      const funcoes = {
        UserRegistered:(user: any)=>{

            console.log(user)
            // pega o login
            const {login} = user;

            // e registra na tabela artworks{login,artworks[]}
            const authArtworks = new ArtworksModel({login, artworks: []});
            console.log(authArtworks)
            authArtworks.save();
        }
    }