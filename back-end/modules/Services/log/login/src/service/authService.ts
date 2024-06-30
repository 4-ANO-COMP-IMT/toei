import bcrypt from 'bcrypt';
import { UserLogin } from '../models/userLogin';

export const login = async (login: string, password: string) => {
 
  const userLogin = await UserLogin.findOne({login: login});

  if (!userLogin || !(await bcrypt.compare(password, userLogin?.password || ''))){
    return false;
  }
  return true;
};