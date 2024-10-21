import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Row, Col, Stack, ButtonGroup, DropdownButton, ToggleButton } from "react-bootstrap";
import './home.css';
import Tags from '../components/tags';
import MenuBar from '../components/menuBar';

function Home() {
    const navigate = useNavigate();
    axios.defaults.withCredentials = true;

    const [login, setLogin] = useState<string>('');
    const [tags, setTags] = useState<string[]>([]);
    
    interface Counter {
        name: string,
        value: number,
        maxValue: number
    }
    interface ArtworkData {
        title: string;
        description: string;
        counter: Counter;
        tags: string[];
        image: string
    }
    interface Artwork {
        _id: string;
        login: string;
        artwork: ArtworkData;
    }
    
    const [artworks, setArtworks] = useState<Artwork[]>([]);

    interface FormInputs {
        title: string;
        tags: string[];
        filters: string[];
        sort: string; // _id, artwork.title
        order: Boolean; // true, false
    }
    
    const [formInputs, setFormInputs] = useState<FormInputs>({
        "title": "",
        "tags": [],
        "filters": [],
        "sort": "_id",
        "order": false // false = ascending(mais novos antes/A-Z), true = descending (mais antigos antes/Z-A)
    });

    const [buttonsTag, setButtonsTag] = useState<boolean[]>([]);
    const [buttonsFilter, setButtonsFilter] = useState<boolean[]>([]);

    useEffect(() => {
        document.title = 'Home';
        axios.defaults.withCredentials = true;
        check();
    }, []);

    const check = async () => {
        await checkCookie();
        await checkArtworks();
        await checkTags();
    }

    const checkCookie = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_LOGIN_URL}/cookies`, { withCredentials: true });
            if (res.data.valid) {
                setLogin(res.data.username);
            } else {
                navigate('/login');
            }
        } catch (err: any) {
            console.log("No session cookie");
            navigate('/login');
        }
    };

    const checkArtworks = async () => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_QUERY_URL}`, { formInputs });
            if (res.data.artworks) {
                setArtworks(res.data.artworks);
                console.log(artworks);
            }
        } catch (err) {
            console.log((err as Error).message);
        }
    }

    const checkTags = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_QUERY_URL}/tags`, { withCredentials: true });
            if (res.data.tags) {
                if (res.data.tags[0].tags.length > 0) {
                    let aux:string[] = res.data.tags[0].tags;
                    aux.sort((a, b) => a.localeCompare(b));
                    setTags(aux);
                    setButtonsTag(new Array(aux.length).fill(false));
                    setButtonsFilter(new Array(aux.length).fill(false));
                }
            } else {
                setTags([]);
            }
        } catch (err) {
            console.log((err as Error).message);
        }
    }

    const updateCounter = async (id: string, index: number, newValue: number) => {
        // console.log("Updating counter");
        if (newValue < 0 || newValue > artworks[index].artwork.counter.maxValue) {
            newValue = 0;
            return;
        }
        try {
            const res = await axios.put(`${import.meta.env.VITE_COUNTER_URL}/` + id, { position: 0, value: newValue });
            if (res.data.updated) {
                let aux = artworks;
                aux[index].artwork.counter.value = newValue;
                setArtworks([...aux]);
            }
        } catch (err) {
            console.log((err as Error).message);
        }
    }

    const inputChangedHandler = (e: any) => {
        const updatedInputs = {
            ...formInputs,
            [e.target.id]: e.target.value
        }
        // console.log(e.target.id, e.target.value);
        setFormInputs(updatedInputs);
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
        try {
            // console.log(formInputs);
            checkArtworks();
        } catch (err: any) {
            console.log("Error");
        }
    };

    // useEffect(() => {
    //     console.log("ARTWORKS UPDATED:", artworks);
    // }, [artworks]); // Apenas para monitorar mudanças em artworks

    // useEffect(() => {
    //     console.log("TAGS UPDATED:", tags);
    // }, [tags]); // Apenas para monitorar mudanças em tags

    useEffect(() => {
        const selectedTags = tags.filter((_, index) => buttonsTag[index]);
        setFormInputs((prevInputs) => ({
            ...prevInputs,
            tags: selectedTags
        }));
    }, [buttonsTag, tags]);

    useEffect(() => {
        const selectedFilters = tags.filter((_, index) => buttonsFilter[index]);
        setFormInputs((prevInputs) => ({
            ...prevInputs,
            filters: selectedFilters
        }));
    }, [buttonsFilter, tags]);

    const updateTag = (n: number) => {
        let aux = buttonsTag;
        aux[n] = !aux[n];
        setButtonsTag(() => [...aux]);
    }

    const updateFilter = (n: number) => {
        let aux = buttonsFilter;
        aux[n] = !aux[n];
        setButtonsFilter(() => [...aux]);
    }
    const resetTags = ()=>{setButtonsTag(new Array(tags.length).fill(false));}
    const resetFilters = ()=>{setButtonsFilter(new Array(tags.length).fill(false));
    }

    return (
        <>
            <MenuBar login={login} type={1}/>
                <Container className='p-2 pt-4' style={{ maxWidth: "960px" }}>

                    <Card className='p-4 mb-4' id="search">
                        <Form onSubmit={handleSubmit}>
                            <Form.Label className='h2 mb-4 fw-semibold'>Search</Form.Label>

                            <div  className="mb-2 d-flex">
                                <Form.Control id="title" type="string" placeholder="Title" className="me-2" onChange={inputChangedHandler} />
                                <Button onClick={(event) => { handleSubmit(event) }} className="p-2 ms-auto">Search</Button>
                            </div>

                            <Stack direction="horizontal" gap={2}>
                                <DropdownButton
                                id="dropdown-basic-button"
                                title="Tags"
                                style={{ display: "inline" }}>
                                    <Container style={{ "width": "25rem" }}>
                                    <Button className="m-1" variant="warning" onClick={() => { resetTags() }}>Reset</Button>
                                        {tags.map((tag, index) => (
                                            <ToggleButton
                                                key={index}
                                                className="m-1"
                                                value={"tag" + index + buttonsTag[index]?.toString()}
                                                id={"toggle-check" + index}
                                                type="checkbox"
                                                variant="outline-success"
                                                checked={buttonsTag[index]}
                                                onChange={() => {
                                                    updateTag(index);
                                                }}
                                            >
                                                {tag}
                                            </ToggleButton>
                                        ))}
                                    </Container>
                                </DropdownButton>

                                <DropdownButton 
                                id="dropdown-basic-button2"
                                title="Filters"
                                style={{ display: "inline" }}>
                                    <Container style={{ "width": "25rem" }}>
                                    <Button className="m-1" variant="warning" onClick={() => { resetFilters() }}>Reset</Button>
                                        {tags.map((tag, index) => (
                                            <ToggleButton
                                                key={index}
                                                className="m-1"
                                                value={"filter" + index + buttonsFilter[index]?.toString()}
                                                id={"toggle-check2" + index}
                                                type="checkbox"
                                                variant="outline-danger"
                                                checked={buttonsFilter[index]}
                                                onChange={() => {
                                                    updateFilter(index);
                                                }}
                                            >
                                                {tag}
                                            </ToggleButton>
                                        ))}
                                    </Container>
                                </DropdownButton>
                            </Stack>
                        </Form>
                    </Card>

                    <Row className="g-4 mb-4">
                        {artworks.map((e: Artwork, index) => {
                            return (
                                <Col key={e._id} lg={6}>
                                    <Card className='p-4 card-item'>
                                        {/* <Card.Img src={e.artwork.image} variant="top" alt={e.artwork.title}/> */}
                                        <a href={"artwork/" + e._id}>
                                            <Card.Title className="card-title">
                                                <b>
                                                    {e.artwork.title}
                                                </b>
                                            </Card.Title>
                                        </a>
                                        <Card.Text id="description" className="mt-3 mb-3 card-description" style={{ height: "3em", lineHeight: "1.5em", overflow: "hidden"}}>{e.artwork.description}
                                        </Card.Text>
                                            {e.artwork.counter?
                                                <Row className="justify-content-md-center">
                                                    <Col xs className="position-relative">
                                                        <div className="position-absolute top-50 start-50 translate-middle">
                                                            <Card.Text>{e.artwork.counter.name}</Card.Text>
                                                        </div>
                                                    </Col>
                                                    <Col xs="auto">
                                                        <ButtonGroup aria-label="Basic example">
                                                            <Button variant="outline-secondary" style={{ width: "3rem" }} onClick={() => { updateCounter(e._id, index, e.artwork.counter.value - 1) }}>-</Button>
                                                            <Button variant="outline-secondary" disabled>{String(e.artwork.counter.value)}/{String(e.artwork.counter.maxValue)}</Button>
                                                            <Button variant="outline-secondary" style={{ width: "3rem" }} onClick={() => { updateCounter(e._id, index, e.artwork.counter.value + 1) }}>+</Button>
                                                        </ButtonGroup>
                                                    </Col>
                                                </Row>
                                                :<></>
                                            }
                                        {e.artwork.tags.length>0?
                                        <>
                                        <hr />
                                        <Tags tags={e.artwork.tags} id={e._id} className="home-tags pb-2"/> 
                                        </>
                                        :<></>
                                        }
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
            </Container>
        </>
    )
}
export default Home;