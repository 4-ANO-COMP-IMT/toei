import { User } from './../models/user';
import bcrypt from 'bcrypt';
import axios from 'axios';


export const createUser =  (name: string, password: string, birthDate: Date, login: string, email: string) => {

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = new User({name, password: hashedPassword, birthDate, login, email});
        user.save();

    axios.post('http://localhost:10000/event', {
        type: 'UserRegistered',
        payload: {
            name: user.name,
            password: user.password,
            birthDate: user.birthDate,
            login: user.login,
            email: user.email
        }
    }).catch((err) => {
        console.log('Failed to send UserRegistered event \n%s',err)
    });
    
    return user;     
};

export const readUser = async (login:string) => {
    const user = await User.findOne({login : login});

    if(!user){
        throw new Error('User not found');
    }

    axios.post('http://localhost:10000/event', {
        type: 'UserSelected',
        payload: {
            user
        }
    }).catch((err) => {
        console.log('Failed to send UserSelected event',err)
    });

    return user;
}