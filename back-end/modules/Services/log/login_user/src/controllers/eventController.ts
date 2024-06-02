import express from 'express';
import { UserLogin } from '../models/userLogin';
const app = express();

type FuncoesKeys = keyof typeof funcoes;

export const handleEvent = app.post('/event', async (req, res) => {
    try{
        console.log("---------------------------------------------------------------/EVENT")
        const type: string = req.body.type
        const payload = req.body.payload
        if (type in funcoes) {
            const functionName = type as FuncoesKeys;
            funcoes[functionName](payload);
        }
        else{
            console.error(`Error: Function ${type} does not exist in funcoes.`);
        }
        res.status(200).send({message: 'Event received'});
    }catch(err){
        res.end();
    }
});

const funcoes = {
    UserRegistered:(user: any)=>{
        console.log("---------------------------------------------------------------/EVENT/USERREGISTERED")
        console.log(user)
        // pega o login e senha
        const {login,password} = user;
        console.log("----------------------------------------------------------login")
        console.log(login)
        console.log("----------------------------------------------------------password")
        console.log(password)
        console.log("----------------------------------------------------------authLogin")
        // e registra na tabela login{login,senha}
        const authLogin = new UserLogin({login, password});
        console.log(authLogin)
        authLogin.save();
    }
}