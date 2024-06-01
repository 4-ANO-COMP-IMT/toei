import bcrypt from 'bcrypt';
import { getEventBridgeData } from '../app';

export const login = async (login: string, password: string) => {
  const user = await getEventBridgeData(); // Await the promise to get the actual user object

  const User = await user.findOne({ login });
  if (!User || !(await bcrypt.compare(password, User.password))) {
    throw new Error('Invalid login or password');
  }
  return User.email;
};
