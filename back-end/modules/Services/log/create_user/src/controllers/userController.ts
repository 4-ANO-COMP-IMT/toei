import { Request, Response } from 'express';
import * as userService from '../service/userService';
import { MissingParameters, WrongTypeParameters } from './errorsController';

export const register =  (req: Request, res: Response) => {
    
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

//validaçao do formato da data    
        const dateParts = birthDate.split("/");
  
    if (dateParts.length !== 3 || dateParts[0].length !== 2 || dateParts[1].length !== 2 || dateParts[2].length !== 4) {
        throw new Error(`Invalid birthDate format. Expected format is dd/mm/yyyy.`);
    }

        const dateObject = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));
    if (isNaN(dateObject.getTime())) {
        throw new Error('Invalid birthDate. Could not parse into a valid date');
    }

        const user =  userService.createUser(name, password, dateObject, login,  email, cpf);
        
        res.status(201).json({ user });

    } catch (error) {

        res.status(400).json({ message: (error as Error).message });
    }
};

