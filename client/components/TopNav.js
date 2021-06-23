
import {useState, useEffect,useContext} from "react";
import {Menu}  from  "antd";
import Link from "next/Link";
import {AppstoreOutlined,
        CoffeeOutlined, 
        LoginOutlined,
        LogoutOutlined,
        UserAddOutlined,
        CarryOutOutlined,
        TeamOutlined} from '@ant-design/icons'
import {Context} from '../context';
import axios from 'axios';
import {useRouter} from "next/router";
import {toast} from 'react-toastify';

const {Item, SubMenu, ItemGroup} = Menu; 



const TopNav = () => {
     
    const [current, setCurrent] = useState("");

    // create router 
    const router = useRouter();

    const {state, dispatch} = useContext(Context);

    // destructure user from state to conditionally render navlinks
    const {user} = state;

    useEffect (() => {
        process.browser && setCurrent(window.location.pathname)
       
    }, [process.browser && window.location.pathname])

    // logout function
    const logout = async () =>{
        dispatch ({type: "LOGOUT"});
        window.localStorage.removeItem("user");
        const {data} = await axios.get("/api/logout");
        toast.success(data.message);
        router.push("/login");

    }

    return (
        <Menu mode = "horizontal" selectedKeys={[current]} className="mb-2">
            <Item key="/" onClick={e => setCurrent(e.key)} icon={<AppstoreOutlined/>}>
                
                <Link href="/">
                    <a>App</a>
                </Link>
            </Item>

            {user && user.role && user.role.includes("Instructor") ? (
                <Item 
                key="/Instructor/course/create" 
                onClick={e => setCurrent(e.key)} 
                 icon={<CarryOutOutlined />}>
                <Link href="/instructor/course/create">
                    <a>Create Course</a>
                </Link>
            </Item>

            ):(
                <Item 
                key="/user/become-instructor" 
                onClick={e => setCurrent(e.key)} 
                 icon={<TeamOutlined />}>
                <Link href="/user/become-instructor">
                    <a>Become Instructor</a>
                </Link>
            </Item>

            )}

            {user === null && (
                <>
                <Item key="/login"  onClick={e => setCurrent(e.key)} icon={<LoginOutlined />}>
                <Link href="/login">
                    <a>Login</a>
                </Link>
            </Item>

            <Item key="/register"  onClick={e => setCurrent(e.key)} icon={<UserAddOutlined />}>
                <Link href="/register">
                    <a>Register</a>
                </Link>
            </Item>
                </>
            )}

            
            

           {user !== null && (
            <SubMenu
             icon={<CoffeeOutlined/>} 
            title={user && user.name}
            className="ms-auto"
            >
            <ItemGroup>
            
            <Item key ="/user">
            <Link href ='/user'>
                <a>Dashboard</a>
                </Link>
            </Item>


            <Item 
            onClick={logout} 
             
            className="ms-auto">
                Logout
            </Item>
            
            
            </ItemGroup>
            </SubMenu>
           )}
            
           
           {user && user.role && user.role.includes("Instructor") && (
                
                <Item 
                key="/instructor" 
                onClick={e => setCurrent(e.key)} 
                 icon={<TeamOutlined />}
                 
                //  className="ms-10"
                 >

                <Link href="/instructor">
                    <a> Instructor</a>
                </Link>
            </Item>
               
                 
            ) }

        </Menu>
        
        );
};

export default TopNav;