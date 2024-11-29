import { Router } from "express";
import {
    handleRegisterUser,
    handleUserLogin,
    handleUserLogout,
    handleRefreshToken,
    handleGetCurrentUser,
    handleChangePassword
} from '../controllers/user.controller.js';
import {upload} from '../middlewares/multer.middleware.js';
import { validateInput } from "../middlewares/validation.middleware.js";
import {
    changePasswordValidationSchema,
    loginValidationSchema, 
    registerValidationSchema
} from "../validators/user.validator.js";
import { authUser } from "../middlewares/auth.middleware.js";

const router = Router();

//at /api/v1/user

//User authentication routes
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
    validateInput(registerValidationSchema),
    handleRegisterUser
);

router.route('/login').post(
    validateInput(loginValidationSchema),
    handleUserLogin
);

router.route('/logout').get(
    authUser,
    handleUserLogout
);

router.route('/refresh-token').get(
    handleRefreshToken
);

router.route('/current-user').get(
    authUser,
    handleGetCurrentUser
);

//User related operations routes
router.route('/change-password').post(
    authUser,
    validateInput(changePasswordValidationSchema),
    handleChangePassword
);

export default router;