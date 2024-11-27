import { Router } from "express";
import {
    handleRegisterUser
} from '../controllers/user.controller.js';
import {upload} from '../middlewares/multer.middleware.js';

const router = Router();

//at /api/v1/user
router.route('/register').post(
    upload.fields([
        {
            name: 'avatar',
            maxCount: 1
        },
        {
            name: 'coverImage',
            maxCount: 1
        }
    ]),
    handleRegisterUser
);

export default router;