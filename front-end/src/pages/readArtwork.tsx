import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Table, Row, Col, Stack, ButtonGroup, Button } from 'react-bootstrap';
import './readArtwork.css';
import Tags from '../components/tags';
import MenuBar from '../components/menuBar';

function readArtwork() {
    const { artworkId } = useParams<{ artworkId: string }>();
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

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
        image: string;
        informations: Information[];
        tags: string[];
        counters: Counter[];
    }

    const emptyArtwork = {
        title: "",
        description: "",
        counters: [],
        tags: [],
        informations: [],
        image: ""
    }

    const [artwork, setArtwork] = useState<Artwork>(emptyArtwork);

    useEffect(() => {
        check();
    }, [artworkId]);

    const check = async () => {
        await checkCookie();
        await checkArtwork();
    }
    
    const [login, setLogin] = useState<string>("");

    const checkCookie = async () => {
        try {
            const res = await axios.get('http://localhost:4000/auth/cookies', { withCredentials: true });
            if (res.data.valid) {
                setLogin(res.data.username)
            }
            else {
                navigate('/login');
            }

        } catch (err: any) {
            console.log("No session cookie");
            navigate('/login');
        }
    };

    const checkArtwork = async () => {
        try {
            const res = await axios.get('http://localhost:5000/artwork/' + artworkId);
            if (res.data.read) {
                setArtwork(res.data.artworkRead[0].artwork);
            }
        } catch (err) {
            console.error((err as Error).message);
        }
    }

    const updateCounter = async (index: number, value: number) => {
        if (value < 0 || value > artwork.counters[index].maxValue) {
            console.log("Invalid value");
            return;
        }
        try {
            const updatedArtwork = { ...artwork };
            updatedArtwork.counters = [...artwork.counters];
            updatedArtwork.counters[index] = { ...artwork.counters[index], value: value };
            const res = await axios.put('http://localhost:5000/artwork/' + artworkId, { artwork: updatedArtwork });
            if (res.data.updated) {
                setArtwork(updatedArtwork);
            }
        } catch (err) {
            console.log((err as Error).message);
        }
    }

    useEffect(() => {
        console.log("ARTWORK UPDATED:", artwork);
    }, [artwork]); // Apenas para monitorar mudanças em artwork

    return (
        <>
            <MenuBar login={login} type={2} message={artwork.title}/>
                <Container className='p-2' style={{ maxWidth: "960px" }}>
                    <h1>{artwork.title}</h1>
                    
                    {artwork.tags.length != 0 ? (
                        <>
                            <Row className="mb-3">
                                <Col md="auto">
                                    <div className='artwork-tags'>
                                        <Tags tags={artwork.tags} id={artworkId as string} className="artwork-tags" />
                                    </div>
                                </Col>
                            </Row>
                        </>
                    ) : null}
                    <hr />
                    {artwork.counters.length != 0 ? (
                        <Row className="justify-content-sm-center mb-4">
                            <Col sm="auto">
                                <div className='artwork-sm-counters'>
                                    <h5>
                                        <Stack direction="horizontal" gap={2} className="artwork-counters">
                                            {artwork.counters.map((counter: Counter, counterIndex: number) =>
                                                <div key={counter.name} className='d-inline me-4 text-center'>
                                                    <div className='d-inline'>
                                                        {counter.name}
                                                    </div><br/>
                                                    <div className='d-inline-block'>
                                                        <ButtonGroup aria-label="Basic example">
                                                            <Button variant="outline-secondary" style={{ width: "3rem" }} onClick={() => { updateCounter(counterIndex, counter.value - 1) }}>-</Button>
                                                            <Button variant="outline-secondary" disabled>{String(counter.value)}/{String(counter.maxValue)}</Button>
                                                            <Button variant="outline-secondary" style={{ width: "3rem" }} onClick={() => { updateCounter(counterIndex, counter.value + 1) }}>+</Button>
                                                        </ButtonGroup>
                                                    </div>
                                                </div>
                                            )}
                                        </Stack>
                                    </h5>
                                </div>
                            </Col>
                        </Row>
                    ) : null}
                    <Table striped bordered hover>
                        {artwork.informations.length !== 0 ? (
                            <thead><tr><th className='text-center' colSpan={2}><h5><b>{artwork.title}</b></h5></th></tr></thead>
                        ) : null}
                        <tbody>
                            {artwork.informations.map((info: Information, index) => {
                                return (
                                    <tr key={index}>
                                        {artwork.informations[index].content == "" ?
                                            (
                                                <th className='text-center' colSpan={2}>{info.name}</th>
                                            )
                                            :
                                            (<>
                                                <td>{info.name}</td>
                                                <td>{info.content}</td>
                                            </>)
                                        }
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                    {artwork.description.split('</br>').map((line, index) => {
                        return (
                            <p key={index}>{line}</p>
                        );
                    })}
                </Container>
        </>
    );
}

export default readArtwork;