import {useState, useEffect} from 'react';
import axios from 'axios';
import CourseCard from '../components/cards/CourseCard';





const Index = () => {

  const [courses, setCourses] = useState([]);


  useEffect(() => {
    const fetchCourses = async () => {
      const {data} = await axios.get("/api/courses");
      setCourses(data);

    };
    fetchCourses();
  }, []);


    return (
      <>
        <h1 className="jumbotron text-center bg-primary">Online Education MarketPlace</h1>
        <div className="row"> 
          {courses.map((course) => (
            <div key={course.id} className="col-md-4">
                <CourseCard course={course} />
            </div>
          ))}
        </div>
        
      
      </>
      
      );
};

export default Index;