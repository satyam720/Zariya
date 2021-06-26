
import {useState,useEffect} from 'react';
import axios from 'axios';
import InstructorRoute from '../../../../components/routes/InstructorRoute';
import { useRouter } from 'next/router';
import CourseCreateForm from '../../../../components/forms/CourseCreateForm';
import Resizer from "react-image-file-resizer";
import {toast} from 'react-toastify';






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
        setValues(data);
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
        const {data} = await axios.post('/api/course',{
            ...values, 
            image
        });
        toast("Great! Now you can start adding lessons");
        router.push("/instructor")
       }catch (err) {
        toast(err.response.data);
       }
       

    };

   

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
            />
            </div>
            {/* <pre>{JSON.stringify(values, null, 4)}</pre>
            <hr />
            <pre>{JSON.stringify(image, null, 4)}</pre> */}
        </InstructorRoute>);
};

export default CourseEdit;

