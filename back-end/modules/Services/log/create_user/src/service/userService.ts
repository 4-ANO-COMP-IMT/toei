import bcrypt from 'bcrypt';
import { User } from '../models/user';


export const createUser =  (name: string, password: string, birthDate: Date, login: string, email: string, cpf: string) => {

    
    

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({name, password: hashedPassword, birthDate, login, email, cpf});
        user.save();
    return user;     
};