import InputForm from '../components/inputForm'
import ButtonForm from '../components/buttonForm'
import './register.css'
import { useState } from 'react'
import axios from 'axios'

function Register() {

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
    signIn()
  }
  
  const signIn = async () => {
    try {
      const res = await axios.post('http://localhost:3000/user/', formInputs)
      console.log(res)
      
      // setTimeout(() => {
        window.location.replace('http://localhost:5173/login');
      // }, 2000);
    }
    catch (err:any) {
      console.error(err.response.data)
    }
  }
  return (
    <div>
      <h1>Sign In</h1>
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
      <a href='http://localhost:5173/login'>Login&#10;</a>
      <ButtonForm type='submit' text='Register'/>
      </form>
      </div>
    </div>
  )
}

export default Register