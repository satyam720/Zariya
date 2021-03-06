import {useState, useEffect, useContext} from 'react';
import {Context} from '../../context';
import InstructorRoute from '../../components/routes/InstructorRoute';
import axios from 'axios';
import {SyncOutlined,DollarOutlined, SettingOutlined, LoadingOutlined} from '@ant-design/icons';
import {stripeCurrencyFormatter} from '../../utils/helpers';


const instructorRevenue = () => {

    const [balance, setBalance, ]= useState({pending: []});
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        sendBalanceRequest();
    }, []);

    const sendBalanceRequest = async () => {
        const {data } = await axios.get('/api/instructor/balance');
        setBalance(data);
    };



    return (

        
        <InstructorRoute>
            <div className="container">
                <div className="row pt-2">
                    <div className="col-md-8 offset-md-2 bg-light p-5">
                        <h2>Revenue Report <DollarOutlined className="float-end" />{ " "}</h2>
                        <small>You get paid directly from stripe to your bank account every 48 hours</small>
                        <hr />
                        {/* {JSON.stringify(balance, null, 4)} */}
                        <h4>Pending Balance 
                        {balance.pending && balance.pending.map((bp, i) =>(
                            <span key={i} className="float-end">{stripeCurrencyFormatter(bp)}</span>
                        ))}
                        </h4>
                         <small>
                           For 48 hours
                        </small>
                        
                       
                    </div>
                </div>
            </div>
            
        </InstructorRoute>

    )};


export default instructorRevenue;