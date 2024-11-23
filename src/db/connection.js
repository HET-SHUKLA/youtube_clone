import mongoose from 'mongoose';
import {MONGODB_URI} from '../utils/config.js';
import {DB_NAME} from '../constants.js';

const connectDB = async () => {
    try{
        await mongoose.connect(`${MONGODB_URI}/${DB_NAME}`);
        console.log(`DB connected`);
    }catch(e){
        console.log(`Database Connection Error : ${e}`);
        process.exit(1);
    }
}

export default connectDB;