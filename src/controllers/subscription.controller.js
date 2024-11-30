import { SUB_FILTER_ENUM } from "../constants.js";
import { Subscription } from "../models/subscription.model.js";
import { createError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from '../utils/apiResponse.js';

const handleGetSubscribers = asyncHandler(async (req, res) => {
    if(!req.user){
        throw createError(401, 'Unauthorized');
    }

    const {page = 1, limit = 20, filter = 'createdAt', ascending = false} = req.query;

    //Validating inputs
    if(!SUB_FILTER_ENUM.includes(filter)){
        throw createError(400, `Filter can only contains these values : ${SUB_FILTER_ENUM.join(', ')}`);
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

    const subcribers = await Subscription.find({
        channel: req.user
    }).sort({[filter] : order})
    .skip(skip)
    .limit(size);

    const totalDocuments = subcribers.length;

    return res.status(200).json(apiResponse({subcribers, totalDocuments}));
});

const handleGetChannels = asyncHandler(async (req, res) => {
    if(!req.username){
        throw createError(401, 'Unauthorized');
    }

    const channels = await Subscription.find(
        {
            subscriber: req.username
        }
    );

    const totalDocuments = channels.length;

    return res.status(200).json(apiResponse({channels, totalDocuments}));
});

const handleUserSubscribe = asyncHandler(async (req, res) => {
    if(!req.username){
        throw createError(401, 'Unauthorized');
    }

    const { channelId } = req.body;

    const subscribe = await Subscription.create(
        {
            subscriber: req.username,
            channel: new mongoose.Types.ObjectId(channelId)
        }
    );

    return res.status(200).json(apiResponse(subscribe));
});

const handleDeleteSubscriber = asyncHandler(async (req, res) => {
    if(!req.username){
        throw createError(401, 'Unauthorized');
    }

    const { channelId } = req.body;

    const sub = await Subscription.findOne({
        subscriber: req.username,
        channel: new mongoose.Types.ObjectId(channelId)
    });

    if (!sub) {
        throw createError(401, 'Unauthorized');
    }
    
    await Subscription.deleteOne(
        {
            _id: sub._id
        }
    );

    return res.status(200).json(apiResponse('Unsubscribed successfully'));
});

export {
    handleGetSubscribers,
    handleGetChannels,
    handleUserSubscribe,
    handleDeleteSubscriber
}