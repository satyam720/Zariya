
import {useState,useEffect} from 'react';
import axios from 'axios';
import InstructorRoute from '../../../../components/routes/InstructorRoute';
import { useRouter } from 'next/router';
import CourseCreateForm from '../../../../components/forms/CourseCreateForm';
import Resizer from "react-image-file-resizer";
import {toast} from 'react-toastify';
import {List,Avatar,Modal } from "antd";
import {DeleteOutlined} from '@ant-design/icons';
import UpdateLessonForm from '../../../../components/forms/UpdateLessonForm';


const {Item } = List;






const CourseEdit = () => {

    //state
    const [values, setValues] = useState({
        name: '',
        description: '',
        price: '450',
        uploading: false,
        paid: true,
        category: '',
        loading: false,
        lessons: [],
        
        
    });

    const [image,setImage] = useState({});
    const [preview, setPreview] = useState("");
    const [uploadButtonText, setUploadButtonText] = useState("Upload Image");


    //state for lesson update
    const [visible, setVisible] = useState(false);
    const [current, setCurrent] = useState({});
    const [uploadVideoButtonText, setUploadVideoButtonText ] = useState('Upload Video');
    const [progress, setProgress] = useState(0);
    const [uploading, setUploading] = useState(false);


    //router
    const router = useRouter();
    const {slug} = router.query;

    useEffect(() => {
        loadCourse()
    }, [slug]);

    const loadCourse = async () => {
        const { data } = await axios.get(`/api/course/${slug}`);
       if(data) setValues(data);
       if(data && data.image) setImage(data.image);
    }

    //handle change event
    const handleChange = e => {
        setValues({...values, [e.target.name]: e.target.value});

    };

    const handleImage = (e) => {
        let file = e.target.files[0];
        setPreview(window.URL.createObjectURL(file));
        setUploadButtonText(file.name);
        setValues({...values, loading: true});

        //resize
        Resizer.imageFileResizer(file, 720,500, "JPEG", 100,0,async (uri) => {
            try {
                let {data} = await axios.post("/api/course/upload-image", {
                    image: uri,
                });
                console.log("IMAGE UPLOADED", data);
                //set image in the state
                setImage(data);
                setValues({...values, loading: false});
            } catch (err) {
                console.log(err);
                setValues({...values, loading: false});
                toast("Image upload failed. Try later.")
            }

        })
    };

    const handleImageRemove = async () => {
        // console.log("remover image");
        try {
            setValues({...values, loading: true});
    
            const res = await axios.post('/api/course/remove-image', {image});
            setImage({});
            setPreview('');
            setUploadButtonText("Upload Image");
            setValues({...values, loading: false});
    
           } catch (err) {
               console.log(err);
               setValues({...values, loading: false});
               toast("Image upload failed. Try later");
           }
    }


    

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(values);
       try{
        const {data} = await axios.put(`/api/course/${slug}`,{
            ...values, 
            image
        });
        toast("Course Updated!");
        // router.push("/instructor")
       }catch (err) {
        toast(err.response.data);
       }
       

    };

    const handleDrag = (e, index) => {
        // console.log("On Drag => ", index );
        e.dataTransfer.setData('itemIndex', index);
    };

    const  handleDrop =  async (e, index) => {
        // console.log("On Drop => ", index);
        const movingItemIndex = e.dataTransfer.getData("itemIndex");
        const targetItemIndex = index;
        let allLessons = values.lessons;

        let movingItem = allLessons[movingItemIndex]; // ClickedDragged item to re-order
        allLessons.splice(movingItemIndex, 1); // remove 1 item from the given index
        allLessons.splice(targetItemIndex, 0, movingItem); // push item after target item index



        setValues({...values, lessons: [...allLessons]});
         //save the newly reordered lessons in database
         const {data} = await axios.put(`/api/course/${slug}`,{
            ...values, 
            image,
        });
        toast('Lessons Rearranged successfully');
    };


    const handleDelete =async (index ) => {
        const answer = window.confirm("Are you sure you want to delete?");
        if(!answer) return;
        let allLessons = values.lessons;
        const removed =  allLessons.splice(index, 1);
        setValues({...values, lessons: allLessons});
        //send request after deleting it from frontend
        const {data} = await axios.put(`/api/course/${slug}/${removed[0]._id}`);

    }

    //Lesson update functions********************
    const handleVideo = async (e) => {
        // remove previous vid if any
        if(current.video && current.video.Location){
            const res = await axios.post(`/api/course/video-remove/${values.instructor._id}`,current.video);
            console.log("removed==>>", res);
        }

        //upload new vid
        const file = e.target.files[0];
        setUploadVideoButtonText(file.name);
        setUploading(true);

        // send video as form data for uploading
        const videoData = new FormData();
        videoData.append('video',file);
        videoData.append('courseId',values._id);

        //save progress bar and send video as form data to backend
        const {data} = await axios.post(`/api/course/video-upload/${values.instructor._id}`,videoData, {
            onUploadProgress: (e) => setProgress(Math.round((100*e.loaded)/e.total)),
        });
        console.log(data);
        setUploading(false);
        setCurrent({...current, video: data});


    }

   const handleUpdateLesson = async (e) => {
    //    console.log("handle upload lesson");
    e.preventDefault();
    const {data} = await axios.put(`/api/course/lesson/${slug}/${current._id}`,
    current);
    setUploadVideoButtonText("Upload Video");

    setVisible(false);
    
    // update ui
    if(data.ok) {
        let arr = values.lessons;
        const index = arr.findIndex((el) => el._id === current._id);
        arr[index] = current;
        setValues({...values, lessons: arr });
        toast("Lesson Update");
    }
   
   }

    return (
        <InstructorRoute>
            <h1 
            className="jumbotron text-center">
            Update Course
            </h1>
            {/* {JSON.stringify(values)} */}
            <div className="pt-3 pb-3">
            <CourseCreateForm handleSubmit={handleSubmit}
                handleChange={handleChange}
                handleImage={handleImage}
                values={values}
                setValues={setValues}
                preview={preview}
                uploadButtonText={uploadButtonText}
                handleImageRemove={handleImageRemove}
                editPage={true}
            />
            </div>
            {/* <pre>{JSON.stringify(values, null, 4)}</pre>
            <hr />
            <pre>{JSON.stringify(image, null, 4)}</pre> */}


            <hr/>
            <div className="row pb-5" >
                    <div className='col lesson-list'>
                        <h4>{values && values.lessons && values.lessons.length} Lessons</h4>
                        <List 
                        onDragOver = {(e) => e.preventDefault()}
                        itemLayout="horizontal"
                        dataSource={values && values.lessons}
                        renderItem={(item, index) =>(
                            <Item
                            draggable
                            onDragStart={e => handleDrag(e, index)}
                            onDrop={e => handleDrop(e, index)}
                            >
                                <Item.Meta
                                 onClick ={() => {
                                        setVisible(true);
                                        setCurrent(item);
                                 }}
                                avatar={<Avatar>{index +1}</Avatar>}
                                title={item.title}></Item.Meta>

                                <DeleteOutlined 
                                onClick={() => handleDelete(index)} 
                                className="text-danger float-end"/>
                            </Item>
                        )}>

                        </List>
                    </div>
                 
                 </div>
                 <Modal 
                 title="Update lesson" 
                 centered 
                 visible={visible}
                 onCancel={() => setVisible(false)}
                 footer={null}>
                 Update Lesson Form
                 {/* <pre>{JSON.stringify(current, null ,4)}</pre> */}
                 <UpdateLessonForm 
                     current={current}
                     setCurrent={setCurrent}
                     handleVideo={handleVideo}
                     handleUpdateLesson= {handleUpdateLesson}
                     uploadVideoButtonText={uploadVideoButtonText}
                     progress= {progress}
                     uploading={uploading}
                 />
                

                 </Modal>
        </InstructorRoute>);
};

export default CourseEdit;

