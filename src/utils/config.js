import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
const PORT = process.env.PORT;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

export {
    MONGODB_URI,
    PORT,
    CORS_ORIGIN
}