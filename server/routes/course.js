import express from 'express';

const router = express.Router();

//middleware
import { requireSignin } from '../middlewares';

// controllers
import {uploadImage,removeImage, create, read} from '../controllers/course';

// image upload and remove routes
router.post("/course/upload-image",uploadImage);
router.post("/course/remove-image",removeImage);

// course create and save routes
router.post('/course', requireSignin, create);
router.get('/course/:slug', read)


module.exports = router;