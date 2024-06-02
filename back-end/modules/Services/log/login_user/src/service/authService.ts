import bcrypt from 'bcrypt';
import { UserLogin } from '../models/userLogin';

export const login = async (login: string, password: string) => {
  console.log('login', login);
  console.log('password', password)
  const userLogin = await UserLogin.findOne({login: login});
  console.log('userLogin', userLogin)
  if (!userLogin || !(await bcrypt.compare(password, userLogin?.password || ''))){
    console.log("------------FALSE")
    return false;
  }
  console.log("------------TRUE")
  return true;
};