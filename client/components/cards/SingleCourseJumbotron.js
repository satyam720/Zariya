import { currencyFormatter } from "../../utils/helpers";
import {Badge, Modal, Button} from 'antd';
import ReactPlayer from "react-player";
import {LoadingOutlined, SafetyOutlined} from '@ant-design/icons';

const SingleCourseJumbotron = ({course,
showModal,
setShowModal,
preview,
setPreview,
loading,
user,
handlePaidEnrollment,
handleFreeEnrollment,
setEnrolled,
enrolled}) => {

//destructure 
const {name,
    description, 
    instructor, 
    updatedAt, 
    lessons, 
    image, 
    price, 
    paid, 
    category,
    }=course;

    return (
        <div className="container-fluid">
            <div className="row">
                {/* <pre>{JSON.stringify(course, null, 4)}</pre> */}
                <div className="jumbotron bg-primary">
                    <div className="row">
                        <div className="col-md-8">
                            {/* {title} */}
                            <h1 className="text-light font-weight-bold">{name}</h1>
                            {/* {description} */}
                            <p className="lead">
                                {description && description.substring(0, 100)}...
                            </p>
                            {/* {category} */}
                            <Badge count={category} style={{backgroundColor: "#03a9f4"}} className="pb-4 ms-2" />
                            {/* {author} */}
                            <p>Created By {instructor.name}</p>
                            {/* {updated} */}
                            <p>Last Updated {new Date(updatedAt).toLocaleString()}</p>
                            {/* {price} */}
                            <h4 className="text-light">
                                {paid ?currencyFormatter({
                                    amount: price,
                                    currency: 'inr',
                                }): "Free"}
                            </h4>
                        </div>
                        <div  className="col-md-4">
                            {/* {show video preview or course image} */}
                            {lessons[0].video && lessons[0].video.Location ? 
                            <div onClick={() => {
                                setPreview(lessons[0].video.Location);
                                setShowModal(!showModal);
                            }}> 
                                    <ReactPlayer  
                                        url={lessons[0].video.Location}
                                        light={image.Location}
                                        width ='100%'
                                        height ='250px'
                                    />
                            </div> : (
                                <>
                                <img src={image.Location}
                                alt ={name}
                                className="img img-fluid"/>
                                </>
                            )}
                            
                            {/* {enroll button} */}
                            {loading ? (
                                <div className='d-flex justify-content-center'>
                                    <LoadingOutlined className="h1 text-danger" />
                                </div>
                            ) : (
                                <Button 
                                className='mb-3 mt-3'
                                type="danger"
                                block
                                shape="round"
                                icon={<SafetyOutlined/>}
                                size="large"
                                disabled={loading}
                                onClick={paid ? handlePaidEnrollment : handleFreeEnrollment}>
                                    {user ? enrolled.status ? "Go to Course": "Enroll" : "Login to Enroll"}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default SingleCourseJumbotron;