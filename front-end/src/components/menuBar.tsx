import { Container, Dropdown, Navbar, Button, Alert } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './menuBar.css'; // Import the custom CSS file

interface menuBarProps {
    login: string;
    type: number;
    message?: string;
}

function menuBar({login, type, message }: menuBarProps) {
    const navigate = useNavigate();
    const { artworkId } = useParams<{ artworkId: string }>();
    axios.defaults.withCredentials = true;
    
  // useEffect(() => {
  //   console.log(artworkId);
  // }, [artworkId]);
    
    const buttons = [
        [],
        [
            { text: "Create Artwork", variant: "success", action: () => { navigate('/create') } },
        ],
        [
            { text: "Edit", variant: "warning", action: () => { navigate('/edit/' + artworkId) } },
            { text: "Delete", variant: "danger", action: () => { setDeleteAlert(true) } }
        ],
        [
            { text: "Delete", variant: "danger", action: () => { setDeleteAlert(true) } }
        ],
        [
            { text: "Delete", variant: "danger", action: () => { setDeleteAlert(true) } }
        ]
    ]

    const disconnect = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_LOGIN_URL}/disconnect`, { withCredentials: true });
            // console.log(res.data);
            if (res.data.disconnected) {
                navigate('/login');
            }
        } catch (err: any) {
            console.log((err as Error).message);
        }
    }

    const [deleteAlert, setDeleteAlert] = useState(false);

    const deleteArtwork = async () => {
        try {
        const res = await axios.delete(`${import.meta.env.VITE_ARTWORK_URL}/` + artworkId, { withCredentials: true });
        if (res.data.artworkDeleted) { 
            navigate('/home');
        }
        } catch (err) {
        console.log((err as Error).message);
        }
    }
    const deleteUser = async () => {
        try {
        const res = await axios.delete(`${import.meta.env.VITE_USER_URL}`);
        if (res.data.userDeleted) { 
            navigate('/home');
        }
        } catch (err) {
        console.log((err as Error).message);
        }
    }

    return (
        <>
        <Navbar
            id="navbar"
            sticky="top"
            bg="dark"
            variant="dark"
        >
            <Container className='p-2' style={{ maxWidth: "960px" }}>
            <Navbar.Brand href="/home">Toei</Navbar.Brand>
            <span>
                {buttons[type].map((button) => (
                <Button
                    key={button.text}
                    className="ms-2 me-2"
                    variant={ button.variant}
                    onClick={button.action}
                >
                    {button.text}
                </Button>
                ))}
                <Dropdown className="d-inline-block ms-2">
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    {login}
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-end">
                    <Dropdown.Item onClick={() => { navigate("/profile") }}>Profile</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => { disconnect() }} style={{ color: "crimson" }}>Disconnect</Dropdown.Item>
                </Dropdown.Menu>
                </Dropdown>
            </span>
            </Container>
            <Alert className='alert-custom' show={deleteAlert} variant="danger">
            <Alert.Heading>Delete artwork</Alert.Heading>
            <p>
                Are you sure you want to delete <b>{message}</b> forever?
            </p>
            <hr />
            <div className="d-flex justify-content-center">
                <Button variant="danger" style={{ width: "100px" }} onClick={() => { type<4?deleteArtwork():deleteUser() }}>
                Yes
                </Button>
                <Button className="ms-5" style={{ width: "100px" }} onClick={() => setDeleteAlert(false)} variant="secondary">
                No
                </Button>
            </div>
            </Alert>
        </Navbar>
        </>
    );
}

export default menuBar;