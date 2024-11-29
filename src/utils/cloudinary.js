import { v2 as cloudinary } from 'cloudinary';
import {
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET
} from '../utils/config.js';
import fs from 'fs';
import { createError } from './apiError.js';

// Configuration
cloudinary.config({ 
    cloud_name: CLOUDINARY_CLOUD_NAME, 
    api_key: CLOUDINARY_API_KEY, 
    api_secret: CLOUDINARY_API_SECRET
});

export const uploadFile = async (localFilePath) => {
    // Upload an image/video
    
    try{
        if(!localFilePath) return false;

        const result = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        });

        //Remove locally saved file
        fs.unlinkSync(localFilePath);
        
        return result;
    }catch(err){
        //Remove locally saved file
        fs.unlinkSync(localFilePath);
        throw createError(500, 'Unable to upload video');
    }
}

export const deleteFile = async (cloudinaryUrl, resourceType = 'image') => {

    if (!cloudinaryUrl) {
        throw createError(404,'URL is required to delete a file from Cloudinary.');
    }

    const urlParts = cloudinaryUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const publicId = fileName.substring(0, fileName.lastIndexOf('.'));

    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
        });

        return result;
    } catch (error) {
        console.error('Failed to delete file from Cloudinary:', error);
        throw error;
    }
};