import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { createError } from "../utils/apiError.js";
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { deleteFile, uploadFile } from '../utils/cloudinary.js';
import { VIDEO_FILTER_ENUM } from "../constants.js";

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
        owner: req.user,
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
        owner: req.user,
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

const handleGetVideos = asyncHandler(async (req, res) => {
    const {page = 1, limit = 20} = req.query;

    //Validating inputs
    if(isNaN(page) || page < 1){
        throw createError(400, 'Page must be a valid number');
    }

    const size = Math.min(Number(limit) || 20, 100);
    const skip = Number((page-1)*size);

    //Query
    const videos = await Video.find({
        isPrivate: false
    }).sort({createdAt: -1})
    .skip(skip)
    .limit(size);
    
    const totalVideos = videos.length;
    
    return res.status(200).json(apiResponse({videos, totalVideos}));
});

const handleGetUserVideo = asyncHandler(async (req, res) => {
    if(!req.user){
        throw createError(401, 'Unauthorized');
    }

    const {page = 1, limit = 20, filter = 'createdAt', ascending = false} = req.query;

    //Validating inputs
    if(!VIDEO_FILTER_ENUM.includes(filter)){
        throw createError(400, `Filter can only contains these values : ${VIDEO_FILTER_ENUM.join(', ')}`);
    }

    if(!Boolean(ascending)){
        throw createError(400, 'ascending can only be true or false');
    }

    if(isNaN(page) || page < 1){
        throw createError(400, 'Page must be a valid number');
    }

    const size = Math.min(Number(limit) || 20, 100);
    const skip = Number((page-1)*size);

    //Query
    const order = ascending ? 1 : -1;

    const videos = await Video.find({
        owner: req.user
    }).sort({[filter] : order})
    .skip(skip)
    .limit(size);

    const totalDocuments = videos.length;

    return res.status(200).json(apiResponse({videos, totalDocuments}));
});

export {
    handleVideoUpload,
    handleVideoDelete,
    handleVideoPrivate,
    handleGetVideos,
    handleGetUserVideo
}