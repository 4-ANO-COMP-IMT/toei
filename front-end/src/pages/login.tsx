import InputForm from '../components/inputForm'
import ButtonForm from '../components/buttonForm'
import './login.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    document.title = 'Login';
  }, []);

  interface FormInputs {
    login?: string;
    password?: string;
  }
  
  const [formInputs, setFormInputs] = useState<FormInputs>()
  
  const inputChangedHandler = (e:any) => {
    console.log(e.target.id, e.target.value)
    const updatedInputs = {
      ...formInputs,
      [e.target.id]: e.target.value
    }
    setFormInputs(updatedInputs)
  }
  
  const submitHandler = (e:any) => {
    e.preventDefault()
    // console.log(formInputs)
    login()
  }
  
  const login = async () => {
    try {
      const res = await axios.post('http://localhost:4000/auth', formInputs)
      console.log(res.data)
      // Redirect to another page
      navigate('/home')
    }
    catch (err:any) {
      console.error(err.response.data)
    }
  }
  return (
    <div className='login'>
      <div>
        <h1>Login</h1>
      </div>
      <div>
        <div className='card'>
        <form autoComplete='off' onSubmit={submitHandler} className='form'>
        <InputForm id='login' label='Login' type='text' onChange={inputChangedHandler}/>
        <InputForm id='password'label='Password' type='password' onChange={inputChangedHandler}/>
        {/* <InputForm id='passwordCheck'label='Confirm password ' type='password' /> */}
        <div>
          <a href={'http://localhost:5173/register'}>Register</a><br />
        </div>
        <div>
          <ButtonForm type='submit' text='Login'/>
        </div>
        </form>
        </div>
      </div>
    </div>
  )
}

export default Login