import bcrypt from 'bcrypt';
import { UserLogin } from '../models/userLogin';
import axios from 'axios';
import { Request } from 'express';

export const login = async (login: string, password: string) => {
    const userLogin = await UserLogin.findOne({login: login});
    if (!userLogin || !(await bcrypt.compare(password, userLogin?.password || ''))){
        return false;
    }
        return true;
};

export const event = async ( typeMessage: string, payloadMessage: any ) => {
  	axios.post('http://localhost:10000/event', {
		type: typeMessage,
		payload: payloadMessage
	}).catch((err) => {
		console.log(`Failed to send ${typeMessage} event`,err)
	});
}