import { User } from './../models/user';
import bcrypt from 'bcrypt';
import axios from 'axios';


export const createUser =  (name: string, password: string, birthDate: Date, login: string, email: string) => {
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({name, password: hashedPassword, birthDate, login, email});
    user.save();
    return user;
};

export const readUser = async (login:string) => {
    const user = await User.findOne({login : login});
    if(!user){
        throw new Error('User not found');
    }
    return user;
}


export const event = async ( typeMessage: string, payloadMessage: any ) => {
    axios.post('http://localhost:10000/event', {
      type: typeMessage,
      payload: payloadMessage
    }).catch((err) => {
        console.log(`Failed to send ${typeMessage} event`,err)
    });
  }