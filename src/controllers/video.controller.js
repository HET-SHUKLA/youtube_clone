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

const handleGetVideos = asyncHandler( async (req, res) => {
    const {limit = 20, cursor, userId} = req.query;

    const size = Math.min(Number(limit) || 20, 100);

    let queryCondition;
    if(userId){
        queryCondition = cursor
        ? { createdAt: { $lt: cursor }, isPrivate: false, owner: new mongoose.Types.ObjectId(userId) }
        : { isPrivate: false, owner: new mongoose.Types.ObjectId(userId) };
    } else{
        queryCondition = cursor
        ? { createdAt: { $lt: cursor }, isPrivate: false }
        : { isPrivate: false };
    }
    
    // Fetch data sorted by creation time
    const videos = await Video.find(queryCondition)
    .sort({ createdAt: -1 })
    .limit(size);

    // Determine the next cursor
    const nextCursor = videos.length > 0 ? videos[videos.length - 1].createdAt : null;

    return res.status(200).json(apiResponse({'videos': videos, 'nextCursor': nextCursor}));
});

const handleGetVideoPage = asyncHandler(async (req, res) => {
    const {page = 1, limit = 20, userId} = req.query;

    if(isNaN(page) || page < 1){
        throw createError(400, 'Page must be a valid number');
    }

    const size = Math.min(Number(limit) || 20, 100);
    const skip = Number((page-1)*size);

    let videos;
    if(userId){
        videos = await Video.aggregate([
            {
                $match: {isPrivate: false, owner: new mongoose.Types.ObjectId(userId)}
            },
            {
                $sort: {createdAt: -1}
            },
            {
                $skip: skip
            },
            {
                $limit: size
            },
        ]);
    }else{
        videos = await Video.aggregate([
            {
                $match: {isPrivate: false}
            },
            {
                $sort: {createdAt: -1}
            },
            {
                $skip: skip
            },
            {
                $limit: size
            },
        ]);
    }
    
    return res.status(200).json(apiResponse({'videos': videos}));
});

export {
    handleVideoUpload,
    handleVideoDelete,
    handleVideoPrivate,
    handleGetVideos,
    handleGetVideoPage
}