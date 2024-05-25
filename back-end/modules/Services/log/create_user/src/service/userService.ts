import bcrypt from 'bcrypt';
import { User } from '../models/user';

let userIdCounter = 1;

export const createUser =  (name: string, password: string, birthDate: string, login: string, email: string, cpf: string) => {

    const dateParts = birthDate.split("/");
    
    if (dateParts.length !== 3 || dateParts[0].length !== 2 || dateParts[1].length !== 2 || dateParts[2].length !== 4) {
        throw new Error(`Invalid birthDate format. Expected format is dd/mm/yyyy.`);
    }

    const dateObject = new Date(Number(dateParts[2]), Number(dateParts[1]) - 1, Number(dateParts[0]));
    if (isNaN(dateObject.getTime())) {
        throw new Error('Invalid birthDate. Could not parse into a valid date');
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({id: userIdCounter++, name, password: hashedPassword, birthDate: dateObject, login, email, cpf});
        user.save();
    return user;     
};