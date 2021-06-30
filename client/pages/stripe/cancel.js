import {CloudSyncOutlined} from '@ant-design/icons';
import userRoute from '../../components/routes/UserRoute';

const StripeCancel = () => {
    return ( 
        <userRoute>
            <div className="row text-center">
                 <div className="col">
                    <CloudSyncOutlined className='display-1 text-danger p-5' />
                    <p className="lead">Payment Failed. Try Again </p>
                </div>
            </div>
        </userRoute>
    )
};


export default StripeCancel;