import bcrypt from 'bcrypt';
import { User } from '../models/user';
import axios from 'axios';


export const createUser =  (name: string, password: string, birthDate: Date, login: string, email: string) => {

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({name, password: hashedPassword, birthDate, login, email});
        user.save();

    return user;     
};