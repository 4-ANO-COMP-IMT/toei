import InputForm from '../components/inputForm'
import ButtonForm from '../components/buttonForm'
import './register.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Register';
  }, []);

  interface FormInputs {
    name?: string;
    birthDate?: string;
    login?: string;
    email?: string;
    password?: string;
    // passwordCheck?: string;
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
    register()
  }
  
  const register = async () => {
    try {
      const res = await axios.post('http://localhost:3000/user', formInputs)
      console.log(res)
      
      // setTimeout(() => {
        // window.location.replace('http://localhost:5173/login');
        navigate('/login')
      // }, 2000);
    }
    catch (err:any) {
      console.error(err.response.data)
    }
  }
  return (
    <div className='register'>
      <div>
        <h1>Register</h1>
      </div>
      <div>
        <div className='card'>
        <form autoComplete='off' onSubmit={submitHandler} className='form'>
        <InputForm id='name' label='Name' type='text' onChange={inputChangedHandler}/>
        {/* <InputForm id='birthDate' label='BirthDate' type='date' onChange={inputChangedHandler}/> */}

        <div>
            <label style={{display:"block"}}>BirthDate</label>
          <input id='birthDate' placeholder="dd-mm-yyyy" type='date'  onChange={inputChangedHandler}/>
        </div>

        <InputForm id='login' label='Login' type='text' onChange={inputChangedHandler}/>
        <InputForm id='email' label='Email' type='email' onChange={inputChangedHandler}/>
        <InputForm id='password'label='Password' type='password' onChange={inputChangedHandler}/>
        {/* <InputForm id='passwordCheck'label='Confirm password ' type='password' /> */}
        <div>
          <a href={'http://localhost:5173/login'}>Login</a><br />
        </div>
        <div>
          <ButtonForm type='submit' text='Register'/>
        </div>
        </form>
        </div>
      </div>
    </div>
  )
}

export default Register