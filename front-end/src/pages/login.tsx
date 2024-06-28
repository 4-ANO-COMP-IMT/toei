import InputForm from '../components/inputForm'
import ButtonForm from '../components/buttonForm'
import './login.css'
import { useState } from 'react'
import axios from 'axios'

function Login() {

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
    logIn()
  }
  
  const logIn = async () => {
    try {
      const res = await axios.post('http://localhost:4000/auth/', formInputs)
      console.log(res.data)
      // Save JWT token
      // Redirect to another page
    }
    catch (err:any) {
      console.error(err.response.data)
    }
  }
  return (
    <div>
      <h1>Log In</h1>
      <div className='card'>
      <form autoComplete='off' onSubmit={submitHandler} className='form'>
      <InputForm id='login' label='Login' type='text' onChange={inputChangedHandler}/>
      <InputForm id='password'label='Password' type='password' onChange={inputChangedHandler}/>
      {/* <InputForm id='passwordCheck'label='Confirm password ' type='password' /> */}
      <ButtonForm type='submit' text='Login'/>
      </form>
      </div>
    </div>
  )
}

export default Login