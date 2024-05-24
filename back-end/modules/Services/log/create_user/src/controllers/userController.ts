import { Request, Response } from 'express';
import * as userService from '../service/userService';
import { MissingParameters, WrongTypeParameters } from './errorsController';

export const register = async (req: Request, res: Response) => {
    
    try {
        const { name, birthDate, login, password, email, cpf } = req.body;
        
        if (!name === undefined) {
            throw new MissingParameters('name');
            
        }
        if (!birthDate === undefined) {
            throw new MissingParameters('birthDate');
            
        }
        if (!login === undefined) {
            throw new MissingParameters('login');
            
        }
        if (!password === undefined) {
            throw new MissingParameters('password');
            
        }
        if (!email === undefined) {
            throw new MissingParameters('email');
            
        }
        if (!cpf === undefined) {
            throw new MissingParameters('cpf');
            
        }
        const user = await userService.createUser(name, birthDate, login, password, email, cpf);
        
        res.json({ user });
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

