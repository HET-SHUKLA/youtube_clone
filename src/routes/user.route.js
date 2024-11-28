import { Router } from "express";
import {
    handleRegisterUser,
    handleUserLogin
} from '../controllers/user.controller.js';
import {upload} from '../middlewares/multer.middleware.js';
import { validateInput } from "../middlewares/validation.middleware.js";
import { userValidationSchema } from "../validators/user.validator.js";

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
    validateInput(userValidationSchema),
    handleRegisterUser
);

router.route('/login').post( handleUserLogin );

export default router;