import {useState, useContext, useEffect} from "react";
import { Context } from "../../context";
import UserRoute from "../../components/routes/UserRoute";
import axios from "axios";


const UserIndex = () => {


//Create context
const {state} = useContext(Context);
const {user} = state;

const [courses,setCourses] = useState([]);

useEffect (() => {
    loadCourses()
},[]);

const loadCourses = async () => {
    const {data } = await axios.get('/api/user-courses');
    <pre>{JSON.stringify(courses,null, 4)}</pre>
    setCourses(data);
}


 
    
    
    return (
        <UserRoute>
        <h1 className="jumbotron text-center">
            User Dashboard
            </h1>   
        
         </UserRoute>   
        );
};

export default UserIndex;