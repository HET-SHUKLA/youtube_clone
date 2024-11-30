import { Router } from "express";
import {upload} from '../middlewares/multer.middleware.js';
import { validateInput } from "../middlewares/validation.middleware.js";
import { authUser } from "../middlewares/auth.middleware.js";
import {
    videoUploadValidationSchema,
    videoPrivateValidationSchema,
    videoDeleteValidationSchema,
} from "../validators/video.validator.js";
import {
    handleVideoUpload,
    handleVideoDelete,
    handleVideoPrivate,
    handleGetVideos,
    handleGetVideoPage,
    handleGetUserVideo
} from '../controllers/video.controller.js';

const router = Router();

//at /api/v1/video
//For logged in user
router.route('/upload').post(
    authUser,
    upload.fields([
        {
            name: 'videoFile',
            maxCount: 1
        },
        {
            name: 'thumbnail',
            maxCount: 1
        }
    ]),
    validateInput(videoUploadValidationSchema),
    handleVideoUpload,
);

router.route('/delete').delete(
    authUser,
    validateInput(videoDeleteValidationSchema),
    handleVideoDelete
);

router.route('/private').patch(
    authUser,
    validateInput(videoPrivateValidationSchema),
    handleVideoPrivate
);

router.route('/user/get').get(
    authUser,
    handleGetUserVideo
)

//For all users
//With cursor
router.route('/get').get(
    handleGetVideos
);

//With pagination
router.route('/get/pages').get(
    handleGetVideoPage
)

export default router;