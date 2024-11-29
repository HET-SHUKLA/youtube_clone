import { Router } from "express";
import {upload} from '../middlewares/multer.middleware.js';
import { validateInput } from "../middlewares/validation.middleware.js";
import { authUser } from "../middlewares/auth.middleware.js";
import {
    videoUploadValidationSchema,
    videoPrivateValidationSchema,
    videoDeleteValidationSchema
} from "../validators/video.validator.js";
import {
    handleVideoUpload,
    handleVideoDelete,
    handleVideoPrivate,
    handleGetVideos
} from '../controllers/video.controller.js';

const router = Router();

//at /api/v1/video

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

router.route('/get').get(
    handleGetVideos
)

export default router;