
import {useState,useEffect} from 'react';
import axios from 'axios';
import InstructorRoute from '../../../../components/routes/InstructorRoute';
import { useRouter } from 'next/router';
import CourseCreateForm from '../../../../components/forms/CourseCreateForm';
import Resizer from "react-image-file-resizer";
import {toast} from 'react-toastify';
import {List,Avatar } from "antd";
import {DeleteOutlined} from '@ant-design/icons';


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
        const {data} = await axios.put(`/api/course/${removed[0]._id}`);

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
        </InstructorRoute>);
};

export default CourseEdit;

