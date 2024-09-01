import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, FloatingLabel,Row, Col, Button } from 'react-bootstrap';
import AlertMessage from '../components/alertMessage';

function Register() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    document.title = 'Register';
  }, []);

  interface Counter {
    name: string,
    value: number,
    maxValue: number
}

interface Information {
    name: string;
    content: string;
}

  interface FormInputs {
    title: string;
    description: string;
    image: string;
    informations: Information[];
    tags: string[];
    counters: Counter[];
  }
  interface UserCreatedResponse {
    message: string;
    created: boolean;
  }

  const [formInputs, setFormInputs] = useState<FormInputs>()
  const [validated, setValidated] = useState(false);
  const [show, setShow] = useState(false);
  const [UCR, setUCR] = useState<UserCreatedResponse>({
    message: '',
    created: false
  })

  const inputChangedHandler = (e:any) => {
    const updatedInputs = {
      ...formInputs,
      [e.target.id]: e.target.value
    } as FormInputs;
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
      const res = await axios.post('http://localhost:3000/user', formInputs)
      setUCR({message:res.data.message, created:res.data.created})
      setShow(true);
      setTimeout(() => {
        navigate('/login')
      }, 600);
    }
    catch (err:any) {
      setUCR({message:err.response.data.message, created:err.response.data.created})
      setShow(true);
      setTimeout(() => {
        setShow(false);
      }, 1200);
    }
  }

  return (
    <>
      <Container className='pt-4' style={{maxWidth: "40rem"}}>

        <AlertMessage show={show} variant={UCR.created ? 'success' : 'danger'} title={UCR.created ? 'Success' : 'Error'} message={UCR.message}/>
        <Card className='p-4'>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Label className='h2 mb-4 fw-semibold'>Register</Form.Label>
            <FloatingLabel controlId='name' label="Name" className='mb-3'>
              <Form.Control disabled={UCR.created} required type='string' placeholder='Name' onChange={inputChangedHandler}/>
            </FloatingLabel>
            <Row>
              <Col sm={7}>
                <FloatingLabel controlId='email' label="Email" className='mb-3'>
                  <Form.Control disabled={UCR.created} required type='email' placeholder='Email' onChange={inputChangedHandler}/>
                </FloatingLabel>
              </Col>
              <Col sm={5}>
                <FloatingLabel controlId='birthDate' label="Birthdate" className='mb-3'>
                  <Form.Control disabled={UCR.created} required type='date' placeholder='dd-mm-yyy' onChange={inputChangedHandler}/>
                </FloatingLabel>
              </Col>
            </Row>
            <FloatingLabel controlId='login' label="Login" className='mb-3'>
              <Form.Control disabled={UCR.created} required type='string' placeholder='Login' onChange={inputChangedHandler}/>
            </FloatingLabel>
            <FloatingLabel controlId='password' label="Password" className='mb-2'>
              <Form.Control disabled={UCR.created} required type='password' placeholder='Password' onChange={inputChangedHandler}/>
            </FloatingLabel>
            <Container className='mb-4'>Already have an account? <br className='d-sm-none'/>Log in <a className='link-underline-primary' role="button" onClick={() => navigate('/login')}>here</a></Container>
            <Container className='d-flex justify-content-center'>
                <Button variant="primary" type="submit">
                  Register
                </Button>
            </Container>
          </Form>
        </Card>
      </Container>
    </>
  )
}

export default Register