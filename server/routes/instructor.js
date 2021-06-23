import express from 'express';

const router = express.Router();

//middleware
import { requireSignin } from '../middlewares';

// controllers
import {makeInstructor, 
       getAccountStatus,
       currentInstructor} from "../controllers/instructor";

//endpoint
router.post("/makeInstructor",requireSignin, makeInstructor);
router.post("/get-account-status",requireSignin, getAccountStatus);
router.get('/current-instructor', requireSignin, currentInstructor);

module.exports = router;