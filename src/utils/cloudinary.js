import { v2 as cloudinary } from 'cloudinary';
import {
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET
} from '../utils/config.js';
import fs from 'fs';

// Configuration
cloudinary.config({ 
    cloud_name: CLOUDINARY_CLOUD_NAME, 
    api_key: CLOUDINARY_API_KEY, 
    api_secret: CLOUDINARY_API_SECRET
});

export const uploadFile = async (localFilePath) => {
    // Upload an image
    
    try{
        if(!localFilePath) return false;

        const result = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        });

        //Remove locally saved file
        fs.unlinkSync(localFilePath);
        
        return result.url;
    }catch(err){
        //Remove locally saved file
        fs.unlinkSync(localFilePath);
        console.log(err);
    }
}
