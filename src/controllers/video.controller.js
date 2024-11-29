import { Video } from "../models/video.model.js";
import { createError } from "../utils/apiError.js";
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadFile } from '../utils/cloudinary.js';

const handleVideoUpload = asyncHandler(async (req, res) => {
    if(!req.user){
        throw createError(401, 'Unauthorized');
    }

    const {title, description, isPrivate} = req.body;

    //Upload files onto the cloudinary
    const { videoFile, thumbnail } = req.files;

    if(!videoFile || !thumbnail){
        throw createError(400, 'Video file and Thumbnail image is required');
    }

    const videoResult = await uploadFile(videoFile[0].path);
    const thumbnailResult = await uploadFile(thumbnail[0].path);
    
    //Storing data in DB
    const video = await Video.create(
        {
            videoFile: videoResult.url,
            thumbnail: thumbnailResult.url,
            owner: req.user,
            title,
            description,
            duration: videoResult.duration,
            isPrivate: isPrivate || false 
        }
    )

    return res.status(200).json(apiResponse(video));
});

const handleVideoPrivate = asyncHandler( async (req, res) => {
    if(!req.user){
        throw createError(401, 'Unauthorized');
    }

    const {isPrivate, videoId} = req.body;

    const video = await Video.findByIdAndUpdate(
        {
            _id: videoId,
            owner: req.user
        },
        {
            $set: {isPrivate: isPrivate}
        }
    );

    return res.status(200).json(apiResponse(video));
});

const handleVideoDelete = asyncHandler( async (req, res) => {
    if(!req.user){
        throw createError(401, 'Unauthorized');
    }
});

export {
    handleVideoUpload,
    handleVideoDelete,
    handleVideoPrivate
}