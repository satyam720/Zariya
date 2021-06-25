import express from 'express';
import fromidable from "express-formidable";

const router = express.Router();

//middleware
import { requireSignin } from '../middlewares';

// controllers
import {uploadImage,removeImage, create, read,uploadVideo,removeVideo} from '../controllers/course';

// image upload and remove routes
router.post("/course/upload-image",uploadImage);
router.post("/course/remove-image",removeImage);

// course create and save routes
router.post('/course', requireSignin, create);
router.get('/course/:slug', read)
router.post('/course/video-upload', requireSignin, fromidable(), uploadVideo);
router.post('/course/video-remove', requireSignin,  removeVideo);



module.exports = router;