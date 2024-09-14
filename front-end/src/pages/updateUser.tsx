import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, FloatingLabel, Row, Col, Button } from 'react-bootstrap';
import AlertMessage from '../components/alertMessage';
import MenuBar from '../components/menuBar';

function updateUser() {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  
  const [login, setLogin] = useState<string>('');

  useEffect(() => {
    document.title = 'Register';
    checkCookie();
    readUser();
  }, []);

  const[userId, setUserId] = useState<string | null>(null);
    
  const checkCookie = async () => {
    try {
        const res = await axios.get('http://localhost:4000/auth/cookies', { withCredentials: true });
        if (!res.data.valid) {
            navigate('/login');
        }
    } catch (err: any) {
        console.log("No session cookie");
        navigate('/login');
    }
};

  interface FormInputs {
    name: string;
    email: string;
    birthDate: string;
    login: string;
    password: string;
  }

  interface UserCreatedResponse {
    message: string;
    created: boolean;
  }

  const emptyFormInputs: FormInputs = {
    name: "",
    email: "",
    birthDate: "",
    login: "",
    password: ""
  };

  const [formInputs, setFormInputs] = useState<FormInputs>(emptyFormInputs);
  const [validated, setValidated] = useState(false);
  const [show, setShow] = useState(false);
  const [UCR, setUCR] = useState<UserCreatedResponse>({
    message: '',
    created: false
  });

  const inputChangedHandler = (e: any) => {
    const { id, value } = e.target;
    const updatedInputs = {
      ...formInputs,
      [id]: value
    } as FormInputs;
    setFormInputs(updatedInputs);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      setValidated(false);
      event.stopPropagation();
    } else {
      if (userId) {
        updateUser();
      }
    }
    setValidated(true);
  };

  const updateUser = async () => {
    try {
      console.log(formInputs);
      const res = await axios.put('http://localhost:3000/user', formInputs );
      if(res.data.updated) {
        setUCR({ message: res.data.message, created: res.data.updated });
        setShow(true);
        setTimeout(() => {
          navigate('/home');
        }, 600);
      }
    } catch (err: any) {
      setUCR({ message: err.response.data.message, created: err.response.data.updated });
      setShow(true);
      setTimeout(() => {
        setShow(false);
      }, 3000);
    }
  };

  const readUser = async () => {
    try {
      const res = await axios.get('http://localhost:3000/user', { withCredentials: true });
      if (res.data.read) {
        const user = res.data.userRead;
        user.password = ""
        user.birthDate = user.birthDate.split('T')[0]; // Format birthDate to YYYY-MM-DD
        setUserId(user._id);
        setFormInputs(user);
        setLogin(user.login);
      }
    } catch (err: any) {
      setUCR({ message: err.response.data.message, created: err.response.data.read });
      setShow(true);
      setTimeout(() => {
        setShow(false);
      }, 1200);
    }
  };

  return (
    <> 
      <MenuBar type={4} login={login} message="your account"/>
      <Container className='pt-4' style={{ maxWidth: "40rem" }}>
        <AlertMessage show={show} variant={UCR.created ? 'success' : 'danger'} title={UCR.created ? 'Success' : 'Error'} message={UCR.message} />
        <Card className='p-4'>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Label className='h2 mb-4 fw-semibold'>{userId ? 'Update User' : 'Register'}</Form.Label>
            <FloatingLabel controlId='name' label="Name" className='mb-3'>
              <Form.Control disabled={UCR.created} required type='string' placeholder='Name' value={formInputs.name} onChange={inputChangedHandler} />
            </FloatingLabel>
            <Row>
              <Col sm={7}>
                <FloatingLabel controlId='email' label="Email" className='mb-3'>
                  <Form.Control disabled={UCR.created} required type='email' placeholder='Email' value={formInputs.email} onChange={inputChangedHandler} />
                </FloatingLabel>
              </Col>
              <Col sm={5}>
                <FloatingLabel controlId='birthDate' label="Birthdate" className='mb-3'>
                  <Form.Control disabled={UCR.created} required type='date' placeholder='dd-mm-yyy' value={formInputs.birthDate} onChange={inputChangedHandler} />
                </FloatingLabel>
              </Col>
            </Row>
            <FloatingLabel controlId='login' label="Login" className='mb-3'>
              <Form.Control disabled={UCR.created} required type='string' placeholder='Login' value={formInputs.login} onChange={inputChangedHandler} />
            </FloatingLabel>
            <FloatingLabel controlId='password' label="Password" className='mb-2'>
              <Form.Control disabled={UCR.created} required type='password' placeholder='Password' value={formInputs.password} onChange={inputChangedHandler} />
            </FloatingLabel>
            <Container className='d-flex justify-content-center'>
              <Button variant="primary" type="submit">
                {userId ? 'Update User' : 'Register'}
              </Button>
            </Container>
          </Form>
        </Card>
      </Container>
    </>
  );
}

export default updateUser;