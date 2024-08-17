import bcrypt from 'bcrypt';
import { UserLogin } from '../models/userLogin';
import axios from 'axios';

export const login = async (login: string, password: string) => {
 
  const userLogin = await UserLogin.findOne({login: login});

  if (!userLogin || !(await bcrypt.compare(password, userLogin?.password || ''))){
    return false;
  }

  
  axios.post('http://localhost:10000/event', {
    type: 'UserLogged',
    payload: {
        login: userLogin.login
    }
  }).catch((err) => {
      console.log('Failed to send UserLogged event',err)
  });

  return true;
};