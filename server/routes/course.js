import express from 'express';
import fromidable from "express-formidable";

const router = express.Router();

//middleware
import { requireSignin } from '../middlewares';

// controllers
import {uploadImage,
    removeImage, 
    create, 
    read,
    uploadVideo,
    removeVideo,
    addLesson,
    update,
    removeLesson,
    updateLesson} from '../controllers/course';

// image upload and remove routes
router.post("/course/upload-image",uploadImage);
router.post("/course/remove-image",removeImage);

// course create and save routes
router.post('/course', requireSignin,create);
router.put('/course/:slug', requireSignin,update);
router.get('/course/:slug', read)
router.post('/course/video-upload/:instructorId', requireSignin, fromidable(), uploadVideo);
router.post('/course/video-remove/:instructorId', requireSignin,  removeVideo);

// `/api/course/lesson/${slug}/${course.instructor._id}`,values
router.post('/course/lesson/:slug/:instructorId', requireSignin, addLesson);
router.put('/course/lesson/:slug/:instructorId', requireSignin, updateLesson);

router.put('/course/:slug/:lessonId', requireSignin, removeLesson)


module.exports = router;