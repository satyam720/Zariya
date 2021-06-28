import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import axios from 'axios';
import {Avatar, Tooltip, Button,Modal, List} from "antd";
import { EditOutlined, CheckOutlined, UploadOutlined, QuestionOutlined, CloseOutlined } from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import AddLessonForm from '../../../../components/forms/AddLessonForm';
import {toast} from 'react-toastify';
import Item from "antd/lib/list/Item";

const CourseView = () => {
    const [course, setCourse] = useState();
    
    // for lesson
    const [visible, setVisible] = useState(false);
    const [values, setValues] = useState({
        title: "",
        content: "",
        video: {},
    });
    const [uploading, setUploading] = useState(false);

    const [uplaodButtonText, setUploadButtonText] = useState("Upload Video");
    const [progress,setProgress] = useState(0);

    const router = useRouter();
    const {slug} = router.query;

    useEffect(() => {
        loadCourse()
    }, [slug]);

    const loadCourse = async () => {
        const {data} = await axios.get(`/api/course/${slug}`);
        setCourse(data);
        
    }

   // Fucntions for adding lessons
   const handleAddLesson = async (e) => {
       e.preventDefault();
    //    console.log(values);
        try{
            const {data} = await axios.post(`/api/course/lesson/${slug}/${course.instructor._id}`,values);
        
        setValues({...values, title: '',content: '', video: {} });
        setProgress(0);
        setUploadButtonText('Upload Video');
        setVisible(false);
        
        setCourse(data);
        toast('Lesson Added');
        } catch (err){
            console.log(err);
            toast('Lesson Add Failed');
        };
   };

   const handleVideo = async (e) => {
       
      try{
        const file = e.target.files[0]
        setUploadButtonText(file.name);
        setUploading(true);

        const videoData = new FormData();
        videoData.append('video',file)

        //save progress bar and send video as form data to backend
        const {data} = await axios.post(`/api/course/video-upload/${course.instructor._id}`, videoData,{
            onUploadProgress: (e) => {
                setProgress(Math.round((100 * e.loaded)/e.total))
            }
        })

        //once response is received
        console.log(data)
        setValues({...values, video: data})
        setUploading(false);
      } catch (err) {
          console.log(err);
          setUploading(false);
          toast("Video upload failed");
      }
    
   }

   //remove video from frontend and aws
   const handleVideoRemove = async () => {
      try{
        setUploading(true);
        const {data} = await axios.post(
            `/api/course/video-remove/${course.instructor._id}`,
            values.video
        );
        console.log(data)
        setValues({...values, video: {} })
        
        setUploading(false);
        setUploadButtonText("upload another video");
      } catch (err) {
          console.log(err);
          setUploading(false);
          toast("Video remove failed");
      }
   }

    const handlePublish =async (e, courseId) => {
        try {
            let answer = window.confirm("Once you Publish your course, it will be live in the marketplace to enroll");
        if(!answer) return;
        const {data} = await axios.put(`/api/course/publish/${courseId}`);
        setCourse(data);
        toast('Congrats! Your course is live'); 
        } catch (err) {
          toast('Course Publish failed! Try Again'); 
        }

    };

    const handleUnpublish =async (e, courseId) => {
        try{
            let answer = window.confirm("Once you Unpublish your course, it will not be available for users to enroll");
            if(!answer) return;
        const {data} = await axios.put(`/api/course/unpublish/${courseId}`);
        setCourse(data);
        toast("Course is now Unpublished");
        

        } catch (err){
            toast("Course Unpublish failed! Try again");
        }
    };

    return (
        <InstructorRoute>
            <div className="container-fluid pt-3">
            {/* <pre>{JSON.stringify(course, null, 4)}</pre>
             */}
             {course && 
             <div className="container-fluid pt-1"> 
                <div className="d-flex">
                    <Avatar size={80} 
                    src={course.image ? course.image.Location: '/course.png'}>

                    </Avatar>
                    <div className="pl-2 d-flex course-edit">
                        <div className="row">
                            <div className="col">
                                <h5 className="mt-2 text-primary">
                                    {course.name}
                                </h5>
                                <p style={{marginTop: "-10px"}}>{course.lessons && course.lessons.length} Lessons</p>
                                <p style={{marginTop: '-15px', fontSize: "10px"}}>{course.category}</p>
                    
                                
                    
                            </div>
                            
                            <div className="mt-2  col button1-edit flex-end">
                            <Tooltip title="Edit">
                                <EditOutlined onClick={() => router.push(`/instructor/course/edit/${slug}`)} className="h5 pointer text-warning mr-4"/>
                            </Tooltip>


                            {course.lessons && course.lessons.length < 5 ? <Tooltip title="Min 5 lessons required to publish">
                                <QuestionOutlined className="h5 ms-4 pointer text-danger"/>
                            </Tooltip> : course.published ?( 
                                <Tooltip title="Unpublish">
                                <CloseOutlined onClick={e => handleUnpublish(e, course._id)} className="h5 ms-4 pointer text-danger"/>
                            </Tooltip> ):( <Tooltip title="Publish">
                                <CheckOutlined onClick={e => handlePublish(e, course._id)} className="h5 ms-4 pointer text-success"/>
                            </Tooltip> ) }

                            
                        </div>
                        
                    
                        </div>
                       
                        
                    </div>

                   

                </div>
                <hr />
                <div className="row">
                        <div className="col">
                        
                           <ReactMarkdown children= {course.description} />

                        </div>

                    </div>
                <br />
                
                <div className="row">
                    <Button 
                    onClick={() => setVisible(true)}
                    className="col-md-6 offset-md-3 text-center"
                    type="primary"  
                    shape="round"
                    icon={<UploadOutlined/>} 
                    size="large"               
                    >
                    Add Lessons</Button>
                </div>
                

                <Modal title="+ Add Lesson"
                centered
                visible={visible}
                onCancel={() => setVisible(false)}
                footer={null}>
                    <AddLessonForm 
                        values={values}
                        setValues={setValues}
                        handleAddLesson={handleAddLesson}
                        uploading={uploading}
                        uplaodButtonText={uplaodButtonText}
                        handleVideo={handleVideo}
                        progress = {progress}
                        handleVideoRemove={handleVideoRemove}
                    />
                </Modal>
                <div className="row pb-5" >
                    <div className='col lesson-list'>
                        <h4>{course && course.lessons && course.lessons.length} Lessons</h4>
                        <List 
                        itemLayout="horizontal"
                        dataSource={course && course.lessons}
                        renderItem={(item, index) =>(
                            <Item>
                                <Item.Meta 
                                avatar={<Avatar>{index +1}</Avatar>}
                                title={item.title}></Item.Meta>
                            </Item>
                        )}>

                        </List>
                    </div>
                 
                 </div>
             </div>
             
             }

            </div>
        </InstructorRoute>)
}


export default CourseView;