import { Button } from "antd";


const AddLessonForm = ({values, 
    setValues, 
    handleAddLesson,
    uploading,
    uplaodButtonText,
    handleVideo}) => {
    return (<div className="container pt-3"> 
                <form  onSubmit={handleAddLesson}>
                    <input 
                    type="text" 
                    className="form-control"
                     onChange={(e) => setValues({...values, title: e.target.value})}
                     value={values.title}
                     placeholder="Title"
                     autoFocus
                     required
                     />

                     <textarea 
                         className="form-control mt-3"
                         cols="7"
                         rows="7"
                         onChange={(e) => setValues({...values, content: e.target.value})}
                         values={values.content}
                         placeholder="Content"
                     />
                        
                        <label className="btn btn-dark w-100 text-left mt-3" >
                       {uplaodButtonText}
                      <input onChange={handleVideo } type="file" accept="video/*" hidden>


                      </input>

                     </label>
                        
                     
                        <div className='d-grid gap-2'>
                        <Button onClick={handleAddLesson}
                     className="col  mt-3"
                     size="large"
                     type="primary"
                     loading={uploading} 
                     shape="round"
                    > Save
                    </Button>
                        </div>
                   
                </form>
    
    </div>)
}

export default AddLessonForm;