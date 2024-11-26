import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import {CORS_ORIGIN} from './utils/config.js';

const app = express();

//Config CORS
app.use(cors({
    origin: CORS_ORIGIN,
    credentials: true
}));

//Allowing JSON request, max 16kb
app.use(express.json({
    limit: '16kb'
}));

//Allowing x-www-form-urlencoded requests, max 16kb
app.use(express.urlencoded({
    extended: true,
    limit: '16kb'
}));

//Allowing accessing Static files
app.use(express.static('public'));

//Config cookie parser
app.use(cookieParser());

//Routes
import userRoute from './routes/user.route.js';

app.use('/api/v1/user', userRoute);

export { app };