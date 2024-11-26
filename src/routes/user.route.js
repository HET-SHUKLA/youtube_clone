import { Router } from "express";
import {
    handleRegisterUser
} from '../controllers/user.controller.js';

const router = Router();

router.route('/register').post(handleRegisterUser);

export default router;