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
    handleVideoPrivate
} from '../controllers/video.controller.js';

const router = Router();

//at /api/v1/video

//Middleware to auth users
router.use(authUser);

router.route('/upload').post(
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
    validateInput(videoDeleteValidationSchema),
    handleVideoDelete
);

router.route('/private').patch(
    validateInput(videoPrivateValidationSchema),
    handleVideoPrivate
);

export default router;