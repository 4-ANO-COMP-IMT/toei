import { Request, Response } from 'express';
import * as userService from '../service/userService';
import { MissingParameters, WrongTypeParameters } from './errorsController';

export const register = async (req: Request, res: Response) => {
    
    try {
        const { name,password, birthDate, login, email, cpf } = req.body;
        
        if (!name) {
            throw new MissingParameters('name');
            
        }
        if (!birthDate) {
            throw new MissingParameters('birthDate');
            
        }
        if (!login) {
            throw new MissingParameters('login');
            
        }
        if (!password) {
            throw new MissingParameters('password');
            
        }
        if (!email) {
            throw new MissingParameters('email');
            
        }
        if (!cpf) {
            throw new MissingParameters('cpf');
            
        }
        const user = await userService.createUser(name, password, birthDate, login,  email, cpf);
        
        res.status(201).json({ user });
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

