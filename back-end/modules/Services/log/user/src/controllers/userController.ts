import { Request, Response } from 'express';
import * as userService from '../services/userService';
import { MissingParameters, WrongTypeParameters, Invalid } from './errorsController';
import { IUser, UserModel, IUserInput } from '../models/user';
import { ICookieConfig } from '../models/sessions';
import bcrypt from 'bcrypt';

declare module 'express-session' {
    interface SessionData {
        login_cookie: string;
        ip_cookie: string;
    }
}

export const create_user = async (req: Request, res: Response) => {
    try {
        console.log(req);
        const userInput:IUserInput = req.body;
        const user:IUser = await checkUser(userInput);
        await createExists(user.login,user.email);
        user.password = crypto(user.password);
        
        const userCreated:IUser = await userService.createUser(user);
        if(!userCreated){
            return res.status(404).json({ created:false, message: 'User not created' });
        }
        if(req.session.login_cookie){
            const cookie_config = cookieConfig(req)
            await userService.event('UserDisconnected',{cookie_config});
            await req.session.destroy((err) => {
                if (err) {return res.status(500).json({message: err});}
            })
        }
        res.status(201).json({ created:true, userCreated, message: 'User created successfully' });
        console.log("User created by:",userCreated.login);
        
        userService.event('UserCreated', userCreated);
    } catch (error) {
        res.status(400).json({ created:false, message: (error as Error).message });
    }
};

export const read_user = async (req: Request, res: Response) => {
    try {
        if(!req.session.login_cookie || req.session.ip_cookie !== req.ip){
            return res.status(401).json({ read:false, message: 'User not logged in' });
        }
        const login = req.session.login_cookie;
        const userRead = await userService.readUser(login);
        if(!userRead){
            return res.status(404).json({ read:false, message: 'User not found' });
        }

        res.status(200).json({ read:true, userRead , message: 'User read successfully' });
        console.log("User read by:",login);

		const cookie_config = cookieConfig(req)
        userService.event('UserRead', {userRead, cookie_config});
    } catch (error) {
        res.status(400).json({ read:false, message: (error as Error).message });
    }
}

export const update_user = async (req: Request, res: Response) => {
    try {
        if(!req.session.login_cookie || req.session.ip_cookie !== req.ip){
            return res.status(401).json({ created:false, message: 'User not logged in' });
        }
        const userInput:IUserInput = req.body;
        const user:IUser = await checkUser(userInput);
        user.password = crypto(user.password);

        const login = req.session.login_cookie;
        const { login:oldLogin, email:oldEmail,password:oldPassword} = await userService.readUser(login);
        const userChanges = { oldLogin, oldEmail, oldPassword, newLogin:user.login, newEmail:user.email, newPassword:user.password};
        await updateExists( userChanges );
        
        const userUpdated = await userService.updateUser(login, user);
        if(!userUpdated || userUpdated.modifiedCount === 0){
            return res.status(404).json({ updated:false, message: 'User not found' });
        }
        req.session.login_cookie = user.login;

        res.status(200).json({ updated:true, userUpdated, message: 'User updated successfully' });
        console.log("User updated by:",login);

        const cookie_config = cookieConfig(req)
        cookie_config.login = user.login
        userService.event('UserUpdated', {userUpdated, userChanges, cookie_config});
    } catch (error) {
        res.status(400).json({ updated:false, message: (error as Error).message });
    }
}

export const delete_user = async (req: Request, res: Response) => {
    try {
        if(!req.session.login_cookie || req.session.ip_cookie !== req.ip){
            return res.status(401).json({ deleted:false, message: 'User not logged in' });
        }
        const login = req.session.login_cookie;

        const userDeleted = await userService.deleteUser(login);
        if(!userDeleted || userDeleted.deletedCount === 0){
            return res.status(404).json({  deleted:false, message: 'User not found' });
        }

        res.status(200).json({ deleted:true, userDeleted, message: 'User deleted successfully' });
        console.log("User deleted by:",login);

        const cookie_config = cookieConfig(req)
        req.session.destroy((err) => {
            if (err) {return console.log(err);}
        });
        userService.deleteSessions(cookie_config.login);
        console.log("Session destroyed");
        userService.event('UserDeleted', {userDeleted, cookie_config});
    } catch (error) {
        res.status(400).json({ deleted:false, message: (error as Error).message });
    }
}

const cookieConfig = (req:Request) => {
	const login:string = req.session.login_cookie as string
	const session:string = req.sessionID
	const _expires:Date=req.session.cookie.expires as Date
	const maxAge:number = req.session.cookie.originalMaxAge as number
    const ip_cookie:string = req.session.ip_cookie as string

	const cookieConfig:ICookieConfig = {login, session, _expires, maxAge, ip_cookie}
	return cookieConfig
}

const crypto = (text:string) => {
    return bcrypt.hashSync(text, 10);
}

// funções de validação

const checkStr = (input: string, name: string) => {
    if (!input) {throw new MissingParameters(name);}
    if (typeof input !== 'string') {throw new WrongTypeParameters(name);}
    if (input.trim() === "") {throw new Invalid(name);}
}

const checkUser = async(user:IUserInput) => {
    const { name, password, birthDate, login, email } = user;
    checkStr(name, 'name');
    checkStr(password, 'password');
    checkStr(birthDate, 'birthDate');
    checkStr(login, 'login');
    checkStr(email, 'email');

    const dateParts = birthDate.split("-");

    if (dateParts.length !== 3 || dateParts[0].length !== 4 || dateParts[1].length !== 2 || dateParts[2].length !== 2) {
        throw new Error(`Invalid birthDate format. Expected format is yyyy-mm-dd.`);
    }
    const dateObject:Date = new Date(Number(dateParts[0]), Number(dateParts[1]) - 1, Number(dateParts[2]));
    if (isNaN(dateObject.getTime())) {
        throw new Error('Invalid birthDate. Date is not valid.');
    }

    return {name, password, birthDate:dateObject, login, email};
}

const createExists = async (login:string,email:string) => {
    const existingUser = await UserModel.findOne({ login });
    if (existingUser) {throw new Error('User with this login already exists');}
    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {throw new Error('User with this email already exists');}
}
const updateExists = async ({oldLogin, oldEmail, newLogin, newEmail}: { oldLogin: string, oldEmail: string, newLogin: string, newEmail: string }) => {
    const existingUser = await UserModel.findOne(
        {
            $and:[
                { login:{$ne:oldLogin}, email:{$ne:oldEmail} },
                { login:newLogin }
            ]
        }
    );
    if (existingUser) {throw new Error('User with this login already exists');}
    const existingEmail = await UserModel.findOne(
        {
            $and:[
                { login:{$ne:oldLogin}, email:{$ne:oldEmail} },
                { email:newEmail }
            ]
        }
    );
    if (existingEmail) {throw new Error('User with this email already exists');}
}