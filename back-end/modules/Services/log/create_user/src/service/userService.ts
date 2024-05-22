import bcrypt from 'bcrypt';
import { User } from '../models/user';

let userIdCounter = 1;

export const createUser =  (name: string, password: string, birthDate: Date, login: string, email: string, cpf: string) => {
       const hashedPassword =  bcrypt.hash(password, 10);
       const user = new User({id: userIdCounter++, name, password: hashedPassword, birthDate, login, email, cpf});
        user.save();
    return user;     
};