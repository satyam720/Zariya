import express from 'express';
import fromidable from "express-formidable";

const router = express.Router();

//middleware
import { requireSignin, isEnrolled } from '../middlewares';

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
    updateLesson,
    publishCourse,
    unpublishCourse,
    courses,
    checkEnrollment,
    freeEnrollment,
    paidEnrollment,
    stripeSuccess,
    userCourses,
    markCompleted,
    listCompleted,
    markIncomplete} from '../controllers/course';

// get the published courses
router.get('/courses', courses )

// image upload and remove routes
router.post("/course/upload-image",uploadImage);
router.post("/course/remove-image",removeImage);

// course create and save routes
router.post('/course', requireSignin,create);
router.put('/course/:slug', requireSignin,update);
router.get('/course/:slug', read);
router.post('/course/video-upload/:instructorId', requireSignin, fromidable(), uploadVideo);
router.post('/course/video-remove/:instructorId', requireSignin,  removeVideo);

//publish unpublish
router.put('/course/publish/:courseId', requireSignin, publishCourse);
router.put('/course/unpublish/:courseId', requireSignin, unpublishCourse);

// `/api/course/lesson/${slug}/${course.instructor._id}`,values
router.post('/course/lesson/:slug/:instructorId', requireSignin, addLesson);
router.put('/course/lesson/:slug/:instructorId', requireSignin, updateLesson);
router.put('/course/:slug/:lessonId', requireSignin, removeLesson);


router.get('/check-enrollment/:courseId',requireSignin, checkEnrollment);

//enrollment
router.post("/free-enrollment/:courseId", requireSignin, freeEnrollment);
router.post("/paid-enrollment/:courseId", requireSignin, paidEnrollment);
router.get("/stripe-success/:courseId", requireSignin, stripeSuccess);

//user courses
router.get('/user-courses', requireSignin,userCourses)
router.get('/user/course/:slug',requireSignin,isEnrolled, read);

// mark completed
router.post('/mark-completed', requireSignin,markCompleted);
router.post('/list-completed', requireSignin,listCompleted);
router.post('/mark-incomplete', requireSignin,markIncomplete);


module.exports = router;