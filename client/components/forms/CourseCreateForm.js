
import {Select,Button,Avatar,Badge} from 'antd';

const {Option} = Select;

const CourseCreateForm =({
    handleSubmit, 
    handleImage, 
    handleChange, 
    values, 
    setValues,
    preview,
    uploadButtonText,
    handleImageRemove,
})  => {

    const children =[] 

    for (let i = 450; i<= 4500; ){
        children.push(<Option key={i}>₹{i}</Option>);
        i+=50;
        
    }

    return(
    <form  onSubmit={handleSubmit}>
    <div className="form-group">
        <input 
        type="text" 
        name="name" 
        className="form-control" 
        placeholder="Name" 
        value={values.name} 
        onChange={handleChange}>

        </input>
    </div>

    <div className="form-group pt-3" >
      <textarea 
      name="description" 
      cols="7" 
      rows="7"
      value={values.description}
      className="form-control"
      onChange={handleChange}>

      </textarea>

    </div>

    <div className ="row form-group pt-4">
        <div className="col form-group">
            
                <Select
                style={{width: "100%"}}
                size="large"
                value={values.paid}
                onChange={v => setValues({...values, paid: !values.paid})} >
                    <Option value={true}>
                        Paid
                    </Option>

                    <Option value={false}
                    width="100%">
                       Free
                    </Option>
                </Select>
            
           
        </div>
        {values.paid && 
        <div className="form-group col">
        <Select defaultValue="₹450"
        // style={{width: '100%'}}
        onChange={v => setValues({...values, price: v})}
        tokenSeparators={[,]}
        size="large"
        >
            {children}
        </Select>

        </div>
        
        }
        
    </div>

    <div className="form-group pt-3">
        <input 
        type="text" 
        name="category" 
        className="form-control" 
        placeholder="category" 
        value={values.category} 
        onChange={handleChange}>

        </input>
    </div>

    <div className="row form-row pt-3">
        <div className="col">
            <div className="form-group">
                <label className="btn btn-outline-secondary d-grid gap-2 text-left">
                    {uploadButtonText}
                    <input 
                    type="file" 
                    name="image" 
                    onChange={handleImage} 
                    accept="image/*" 
                    hidden>

                    </input>
                </label>
            </div>
        </div>
        {preview && (
                <div className="col">
                    <Badge count="X" onClick={handleImageRemove} className="pointer">
                    <Avatar width={200} src={preview} />
                    </Badge>

                </div>
        )}
    </div>

    
        <div className="row pt-3">
            <div className="col">
                <Button 
                onClick={handleSubmit}
                disabled={values.loading || values.uploading}
                className="btn btn-primary "
                loading={values.loading}
                type="primary"
                size="large"
                shape="round">
                    {values.loading ? 'Saving...' : "Save and Continue"}
                </Button>
            </div>
        </div>
  
</form>)
};

export default CourseCreateForm;