

import { useState, useEffect,createElement } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import StudentRoute from "../../../components/routes/StudentRoute";
import { Button, Menu, Avatar } from "antd";
import ReactPlayer from 'react-player';
import ReactMarkdown from 'react-markdown';
import {PlayCircleOutlined,MenuFoldOutlined, MenuUnfoldOutlined} from '@ant-design/icons'

const { Item } = Menu;

const SingleCourse = () => {
  const [clicked, setClicked] = useState(-1);
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState({ lessons: [] });
  const [completedLessons, setCompletedLessons] = useState([]);
  // router
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (slug) loadCourse();
  }, [slug]);

  useEffect(() => {
    if (course) loadCompletedLessons();
  }, [course]);

  const loadCompletedLessons = async () => {
    const {data} = await axios.post(`/api/list-completed`,{
      courseId: course._id,

    });
    console.log("completed lessons => ", data);
    setCompletedLessons(data);
  }

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/user/course/${slug}`);
    setCourse(data);
  };

  const markCompleted = async () => {
    const {data} = await axios.post(`/api/mark-completed`, {
      courseId: course._id,
      lessonId: course.lessons[clicked]._id,
    });
  console.log(data);
  }


  return (
    <StudentRoute>
      <div className="row">
        <div className="col-md-2" >
        
        <Button 
        onClick={() => setCollapsed(!collapsed)}
        className="text-primary mt-1  mb-2">
       
            {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)} {!collapsed && "Lessons"}
            
        </Button>
        
          <Menu
            defaultSelectedKeys={[clicked]}
            inlineCollapsed={collapsed}
            style={{ height: "80vh",  }}
          >
            {course.lessons.map((lesson, index) => (
              <Item
                onClick={() => setClicked(index)}
                key={index}
                icon={<Avatar>{index + 1}</Avatar>}
              >
                {lesson.title.substring(0, 30)}
              </Item>
            ))}
          </Menu>
        </div>

        <div className="col">
        
      
          {clicked !== -1 ? (
            
            <>
            <div className="col alert alert-primary">
                        <b>{course.lessons[clicked].title.substring(0,30)}</b>
                        <span className="float-end cursor-pointer" onClick={markCompleted}>
                            Mark as Completed
                        </span>
                    </div>
            {course.lessons[clicked].video && course.lessons[clicked].video.Location && (
                <> 
                
                    
                    <div className="wrapper">
                        <ReactPlayer className="player" 
                            url={course.lessons[clicked].video.Location}
                            width="80%"
                            height="100%"
                            controls
                        />
                    </div>
                    
                </>
            )}
            <ReactMarkdown children={course.lessons[clicked].content} className="single-post" />
            </>
          ) : (
            <div className="d-flex justify-content-center p-5">
            <div className="text-center p-5">
            <PlayCircleOutlined className ="text-primary display-1 p-5"/>
            <p> Click on the lessons to start Learning</p>
            </div>

            </div>
          )}
        </div>
      </div>
    </StudentRoute>
  );
};

export default SingleCourse;
