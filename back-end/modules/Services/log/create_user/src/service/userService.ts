import bcrypt from 'bcrypt';
import { User } from '../models/user';

let userIdCounter = 1;

export const createUser = async (name: string, password: string, birthDate: Date, login: string, email: string, cpf: string) => {
       const hashedPassword = await bcrypt.hash(password, 10);
       const user = new User({id: userIdCounter++, name, password: hashedPassword, birthDate, login, email, cpf});
       await user.save();
    return user;     
};