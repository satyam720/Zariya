import { List, Avatar } from "antd";

const {Item} = List;

const SingleCourseLessons = ({
    lessons,
    setPreview,
    setModal,
    setShowModal,

}) => {
    return ( 
        
                <div className="container">
                    <div className="row">
                        <div className="col">
                            {lessons && <h4>{lessons.length} Lessons</h4>}
                            <hr/>
                            <List 
                                itemLayout="horizontal"
                                dataSource={lessons}
                                renderItem={(item, index) => (
                                    <Item>
                                        <Item.Meta 
                                        avatar={<Avatar>{index + 1}</Avatar>}
                                        title={item.title} >
                                            
                                        </Item.Meta>
                                    </Item>
                                )}
                            /> 
                            
                            
                         </div>
                    </div>
                </div>
        
    );
};


export default SingleCourseLessons;