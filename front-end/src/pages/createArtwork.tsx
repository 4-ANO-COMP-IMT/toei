import { Container } from 'react-bootstrap'
import MenuBar from '../components/menuBar'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Card, FloatingLabel, Button, Row, Col } from 'react-bootstrap';

function createArtwork() {

    // check if user is logged in

    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const [login, setLogin] = useState<string>("");

    const checkCookie = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_LOGIN_URL}/cookies`, { withCredentials: true });
            if (res.data.valid) {
                setLogin(res.data.username)
            }else{
                navigate('/login');
            }
        } catch (err: any) {
            console.log("No session cookie");
            navigate('/login');
        }
    };
    
    useEffect(() => {
        checkCookie();
    }, []);

    // create artwork

    interface Counter {
        name: string,
        value: number,
        maxValue: number
    }

    interface Information {
        name: string;
        content: string;
    }

    interface Artwork {
        title: string;
        description: string;
        img: string;
        informations: Information[];
        tags: string[];
        counters: Counter[];
    }

    const emptyArtwork:Artwork = {
        title: "",
        description: "",
        img: "default",
        counters: [{ name: "", value: 0, maxValue: 0 }],
        tags: [],
        informations: []
    }

    const [artworkInputs, setArtworkInputs] = useState<Artwork>(emptyArtwork);
    
    // map artwork to form
    
    interface ArtworkCreatedResponse {
        message: string;
        created: boolean;
    }
  
    const [validated, setValidated] = useState(false);        // check if form is valid
    const [ACR, setACR] = useState<ArtworkCreatedResponse>({  // alert message
        message: '',
        created: false
    })
  
    const handleSubmit = (event:any) => {
        try{
            event.preventDefault();
            const form = event.currentTarget;
            console.log(artworkInputs)
            if (form.checkValidity() === false) {
                setValidated(false);
                event.stopPropagation();
            } else {
                createArtwork()
            }
            setValidated(true);
        } catch (err: any) {
            console.log((err as Error).message)
            navigate('/home');
        }
    };

    const createArtwork = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_ARTWORK_URL}`, {artwork:artworkInputs})
            setACR({message:res.data.message, created:res.data.created})
            if (res.data.created) {
                navigate('/home');
            }
        } catch (err: any) {
            setACR({message:err.response.data.message, created:err.response.data.created})
        }
    }
    
    const inputChangedHandler = (e:any) => {
        const { id, value } = e.target;
        const [field, index] = id.split('-');
        const updatedInputs: Artwork = { ...artworkInputs };
        
        if (field.startsWith('counter')) {
            const counterIndex = parseInt(index);
            const counterField = field.split('.')[1];
            updatedInputs.counters[counterIndex] = {
                ...updatedInputs.counters[counterIndex],
                [counterField]: counterField === 'value' || counterField === 'maxValue' ? parseInt(value) : value
            };
        } else if (field.startsWith('info')) {
            const infoIndex = parseInt(index);
            const infoField = field.split('.')[1];
            updatedInputs.informations[infoIndex] = {
                ...updatedInputs.informations[infoIndex],
                [infoField]: value
            };
        } else if (field === 'tags') {
            updatedInputs.tags = Array.from(new Set(value.split(';')
                .map((tag: string) => tag.trim().toUpperCase())
                .filter((tag: string | any[]) => tag.length > 0)));
        } else {
            updatedInputs[field as keyof Artwork] = value;
        }

        setArtworkInputs(updatedInputs);
        console.log(id, value);
    }

    const [counterQuantity, setCounterQuantity] = useState<number>(0);
    const [infoQuantity, setInfoQuantity] = useState<number>(0);

    useEffect(() => {
        setArtworkInputs(prevInputs => ({
            ...prevInputs,
            counters: Array.from({ length: counterQuantity }, (_, i) => prevInputs.counters[i] || { name: "", value: 0, maxValue: 0 }),
            informations: Array.from({ length: infoQuantity }, (_, i) => prevInputs.informations[i] || { name: "", content: "" })
        }));
    }, [counterQuantity, infoQuantity]);

    return(
        <>
        <MenuBar login={login} type={0}/>
        <Container style={{ height: "100vh", width: "100vw" }}>
            <Container className='pt-4' style={{ maxWidth: "960px" }}>

            <Card className='p-4'>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <FloatingLabel controlId='title' label="Title" className='mb-3'>
                    <Form.Control disabled={ACR.created} required type='string' placeholder='Title' onChange={inputChangedHandler}/>
                  </FloatingLabel>
                  <FloatingLabel controlId='description' label="Description" className='mb-3'>
                    <Form.Control disabled={ACR.created} required as="textarea" maxLength={7000} type='string' placeholder='Description' onChange={inputChangedHandler}/>
                  </FloatingLabel>
                  <hr/>
                  <h4>Counters</h4>
                  {Array.from({length: counterQuantity}, (_, i) => (
                    <Row className="mt-1 mb-1" key={`counters[${i}]`}>
                      <Form.Group as={Col} md="4" controlId={`counter.name-${i}`}>
                        <FloatingLabel controlId={`counter.name-${i}`} label="Name" className='mb-3'>
                          <Form.Control disabled={ACR.created} required type='string' placeholder="Name" maxLength={20} onChange={inputChangedHandler}/>
                        </FloatingLabel>
                      </Form.Group>
                      <Form.Group as={Col} md="4" controlId={`counter.value-${i}`}>
                        <FloatingLabel controlId={`counter.value-${i}`} label="Value" className='mb-3'>
                          <Form.Control min={0} max={artworkInputs.counters[i]?.maxValue} disabled={ACR.created} required type='number' placeholder="Value" maxLength={20} onChange={inputChangedHandler}/>  
                        </FloatingLabel>
                      </Form.Group>
                      <Form.Group  as={Col} md="4" controlId={`counter.maxValue-${i}`}>
                        <FloatingLabel controlId={`counter.maxValue-${i}`} label="Max Value" className='mb-3'>
                          <Form.Control min={0} max={10000} disabled={ACR.created} required type='number' placeholder="Max Value" maxLength={20} onChange={inputChangedHandler}/>
                        </FloatingLabel>
                      </Form.Group>
                    </Row>
                  ))}
                  <Button style={{width:"6rem"}} variant='outline-success' onClick={() => setCounterQuantity(counterQuantity + 1)}>Add</Button>
                  <Button style={{width:"6rem"}} variant='outline-danger' className='ms-4' onClick={() => setCounterQuantity(counterQuantity>0?counterQuantity - 1:counterQuantity)}>Remove</Button>
                  <hr/>
                  <h4>Tags</h4>
                  <FloatingLabel controlId='tags' label="Tags (example: tag1;tag2;tag3)" className='mb-3'>
                    <Form.Control disabled={ACR.created} type='string' placeholder="Tags" onChange={inputChangedHandler}/>
                  </FloatingLabel>
                  <hr/>
                  <h4>Informations</h4>
                  {Array.from({length: infoQuantity}, (_, i) => (
                    <Row className="mt-1 mb-1" key={`information[${i}]`}>
                      <Form.Group as={Col} md="6" controlId={`info.name-${i}`}>
                        <FloatingLabel controlId={`info.name-${i}`} label="Name" className='mb-3'>
                          <Form.Control disabled={ACR.created} required type='string' placeholder="Name" maxLength={30} onChange={inputChangedHandler}/>
                        </FloatingLabel>
                      </Form.Group>
                      <Form.Group as={Col} md="6" controlId={`info.content-${i}`}>
                        <FloatingLabel controlId={`info.content-${i}`} label="Content" className='mb-3'>
                          <Form.Control disabled={ACR.created} type='string' placeholder="Content" maxLength={100} onChange={inputChangedHandler}/>  
                        </FloatingLabel>
                      </Form.Group>
                    </Row>
                  ))}
                  <Button style={{width:"6rem"}} variant='outline-success' onClick={() => setInfoQuantity(infoQuantity + 1)}>Add</Button>
                  <Button style={{width:"6rem"}} variant='outline-danger' className='ms-4' onClick={() => setInfoQuantity(infoQuantity>0?infoQuantity - 1:infoQuantity)}>Remove</Button>
                  <hr/>
                  <Button disabled={ACR.created} variant='primary' type='submit'>Create Artwork</Button>
                </Form>
            </Card>

            </Container>
        </Container>
        </>
    )
}
export default createArtwork