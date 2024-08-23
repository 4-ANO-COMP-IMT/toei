import express from 'express';
import { UserLogin } from '../models/userLogin';
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
        const {login,password} = req.body.payload;
        // e registra na tabela login{login,senha}
        const authLogin = new UserLogin({login, password});
        console.log(authLogin)
        authLogin.save();
    }
}