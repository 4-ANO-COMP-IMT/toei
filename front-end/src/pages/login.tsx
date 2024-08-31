import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, FloatingLabel, Button } from 'react-bootstrap';
import AlertMessage from '../components/alertMessage';

function Login() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    document.title = 'Login';
    checkCookie()
  }, []);

  const checkCookie = async () => {
    try{
      const res = await axios.get('http://localhost:4000/auth/cookies', {withCredentials: true})
      if(res.data.valid){
        navigate('/home')
      }
    }catch(err:any){
      console.log("No session cookie")
    }
  }

  interface FormInputs {
    login?: string;
    password?: string;
  }
  interface UserLoginResponse {
    message: string;
    logged: boolean;
  }
  
  const [formInputs, setFormInputs] = useState<FormInputs>()
  const [validated, setValidated] = useState(false);
  const [show, setShow] = useState(false);
  const [ULR, setULR] = useState<UserLoginResponse>({
    message: '',
    logged: false
  })

  const inputChangedHandler = (e:any) => {
    const updatedInputs = {
      ...formInputs,
      [e.target.id]: e.target.value
    }
    setFormInputs(updatedInputs)
  }
  
  const handleSubmit = (event:any) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(false);
      event.stopPropagation();
    } else {
      register()
    }
    setValidated(true);
  };
  
  const register = async () => {
    try {
      const res = await axios.post('http://localhost:4000/auth', formInputs)
      setULR({message:res.data.message, logged:res.data.logged})
      setShow(true);
      setTimeout(() => {
        navigate('/home')
      }, 3000);
    }
    catch (err:any) {
      setULR({message:err.response.data.message, logged:err.response.data.logged})
      setShow(true);
      setTimeout(() => {
        setShow(false);
      }, 1500);
    }
  }

  return (
      <Container className='pt-4' style={{maxWidth: "40rem"}}>
        <AlertMessage show={show} variant={ULR.logged?'success':'danger'} title={ULR.logged?"User created":"Error"} message={ULR.message}/>
        <Card className='p-4'>
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Label className='h2 mb-4 fw-semibold'>Log in</Form.Label>
            <FloatingLabel controlId='login' label="Login" className='mb-3'>
              <Form.Control disabled={ULR.logged} required type='string' placeholder='Login' onChange={inputChangedHandler}/>
            </FloatingLabel>
            <FloatingLabel controlId='password' label="Password" className='mb-4'>
              <Form.Control disabled={ULR.logged} required type='password' placeholder='Password' onChange={inputChangedHandler}/>
            </FloatingLabel>
            <Container className='mb-4'>Don't have an account? <br className='d-sm-none'/>Register <a className='link-underline-primary' role="button" onClick={() => navigate('/register')}>here</a></Container>
            <Container className='d-flex justify-content-center'>
                <Button variant="primary" type="submit">
                  Log in
                </Button>
            </Container>
          </Form>
        </Card>
      </Container>
  )
}

export default Login