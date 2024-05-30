import bcrypt from 'bcrypt';

export const login = async (login: string, password: string) => {
  
  //pegar o user do microserviço de barramento do usuario no moongoose
  const user = await User.findOne({ login });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid login or password');
  }
  return user._id.toString();
};
