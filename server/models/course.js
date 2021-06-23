import mongoose from 'mongoose';




const {ObjectId} = mongoose.Schema;


const lessonSchema = new mongoose.Schema({
  title: {
      type: String,
      trim: true,
      minLength: 3,
      maxlength: 320,
      required: true,

  },
  slug: {
      type : String,
      lower: true,

  },
  content: {
      type: {},
      minlength: 200,

  },
  video_link: {},

      free_preview: {
          type: Boolean,
          default: false,
      },
  },

  {timestamps: true}
);

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 320,
        required: true,
    },
    slug: {
        type : String,
        lower: true,
  
    },
    description: {
        type: {},
        minlength: 200,
        required: true,
    },
    price: {
        type : Number,
        default: 450,
    },
    image: {},
    category: String,
    publish: {
        type: Boolean,
        default: false,
    },
    paid: {
        type: Boolean,
        default: true,
    },
    instructor: {
        type: ObjectId,
        ref: "User",
        required: true,
    },
    lessons: {lessonSchema},


}, {timestamps: true});


export default mongoose.model("Course", courseSchema);



