import {useState, useEffect} from 'react';
import axios from 'axios';
import {useRouter} from 'next/router';
import {Badge} from 'antd';
import {currencyFormatter } from '../../utils/helpers';

const SingleCourse = ({course}) => {
    const router = useRouter();
    const {slug} = router.query;

//destructure 
const {name,
     description, 
     instructor, 
     updatedAt, 
     lessons, 
     image, 
     price, 
     paid, 
     category,}=course;

    return (
        <>

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
                            <p>show course image</p>
                            <p>show enroll button</p>
                            {/* {enroll button} */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </>);

};


export async function getServerSideProps({query}) {
    const {data} = await axios.get(`${process.env.API}/course/${query.slug}`);
    return {
        props: {
            course: data,
        },
    };
};

export default SingleCourse;