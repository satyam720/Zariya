import {useState,useEffect,useContext} from 'react';
import axios from "axios";
import {toast} from 'react-toastify';
import { SyncOutlined } from '@ant-design/icons';
import Link from 'next/Link';
import { Context } from "../context";
import {useRouter} from 'next/router';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    //create context
    const {state} = useContext(Context);
    const {user} = state;

    // if user already logged in  redirect to home page so that he cannot access home page
    
    useEffect(() => {
        if(user !==null) router.push("/");
    }, [user]);
    
    const handleSubmit = async (e) =>{
        e.preventDefault();
        try{
        setLoading(true);
        // console.table({name, email, password});
        const {data} = await axios.post(`/api/register`,{
                name,
                email,
                password,
        });
        // console.log("register response", data)
        toast.success('Registration successfull. Please login');
        setName("");
        setEmail("");
        setPassword("");
        setLoading(false);
       }
       catch (err) {
           toast.error(err.response.data);
           setLoading(false);
           
       }
    };

    return (
        <>
            <h1 className="jumbotron text-center bg-primary square">Register</h1>
            <div className="container col-md-4 offset-md-4 pb-5">
                <form onSubmit={handleSubmit}>
                    <input type="text" 
                    className="form-control mb-4 p-4"
                     value={name} 
                     onChange={(e) => setName(e.target.value)}
                     placeholder ="Enter Name" 
                     required   
                     />

                     <input type="email" 
                    className="form-control mb-4 p-4"
                     value={email} 
                     onChange={(e) => setEmail(e.target.value)}
                     placeholder ="Enter your Email" 
                     required   
                     />

                     <input type="password" 
                    className="form-control mb-4 p-4"
                     value={password} 
                     onChange={(e) => setPassword(e.target.value)}
                     placeholder ="Enter Password" 
                     required   
                     />
                     <div class="d-grid gap-2">
                     <button 
                     type="submit" 
                     className="btn  btn-primary"
                     disabled={!name || !email || !password || loading}>{loading ? <SyncOutlined spin/> : "Submit"}</button>
                     </div>
                     
                </form>
                <p className="text-center p-3">
                Already Registered? 
                <Link href="/login"><a> Login</a></Link>
                </p>

            </div>
        </>
        )
}

export default Register;