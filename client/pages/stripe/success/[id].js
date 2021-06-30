import { useEffect } from "react";
import { SyncOutlined } from "@ant-design/icons";
import UserRoute from "../../../components/routes/UserRoute";
import {useRouter} from "next/router";
import axios from 'axios';


const StripeSuccess = () => {
    // router
    const router = useRouter();
    const {id} = router.query;

    useEffect(() => {
        if (id) successRequest();
    },[id]);

    const successRequest = async () => {
        const {data} = await axios.get(`/api/stripe-success/${id}`);
        router.push('/user/course/${data.slug');

    };

    return (
        <UserRoute >
            <div className='row text-center'>
                <div className="col">
                    <div className="d-flex justify-content-center">
                        <SyncOutlined spin className="display-1 text-danger p-5" />
                    </div>
                </div>
            </div>
        </UserRoute>
    );
};


export default StripeSuccess;