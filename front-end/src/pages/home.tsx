import { useEffect, useState } from "react"
import axios from 'axios'
import { useNavigate } from "react-router-dom";

function Home() {
    const [name, setName] = useState<string>('');
    const navigate = useNavigate();
    const fetchData = async () => {
        try {
            const res = await axios.get('http://localhost:4000/auth/cookies',{
                withCredentials: true
              });
            console.log(res.data);
            if (res.data.valid == true) {
                setName(res.data.username);
            }else{
                navigate('/login');
            }
        } catch (err:any) {
            console.error(err.response.data);
            navigate('/login');
        }
    };

    useEffect(() => {
        fetchData();
        console.log('i fire once');
    }, []);

    return (
        <div>
            <h1>Welcome {name}</h1>
        </div>
    )
}
export default Home