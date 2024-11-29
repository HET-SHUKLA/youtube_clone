import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { createError } from "../utils/apiError.js";
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFile, uploadFile } from '../utils/cloudinary.js';

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
    
    const video = await Video.findOne({
        _id: videoId,
        owner: new mongoose.Types.ObjectId(req.user),
    });
    
    if (!video) {
        throw createError(401, 'Unauthorized');
    }
    
    video.isPrivate = isPrivate;
    await video.save();

    return res.status(200).json(apiResponse(video));
});

const handleVideoDelete = asyncHandler( async (req, res) => {
    if(!req.user){
        throw createError(401, 'Unauthorized');
    }

    const {videoId} = req.body;
    
    const video = await Video.findOne({
        _id: videoId,
        owner: new mongoose.Types.ObjectId(req.user),
    });

    if (!video) {
        throw createError(401, 'Unauthorized');
    }

    await Video.deleteOne(
        {
            _id: videoId,
        }
    );

    await deleteFile(video.videoFile, 'video');
    await deleteFile(video.thumbnail);

    return res.status(200).json(apiResponse('Data Deleted successfully'));
});

export {
    handleVideoUpload,
    handleVideoDelete,
    handleVideoPrivate
}