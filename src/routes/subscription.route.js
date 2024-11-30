import { Router } from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import {
    handleGetSubscribers,
} from "../controllers/subscription.controller.js";

const router = Router();

//at /api/v1/sub

router.use(authUser);

//display subscribers
router.route('/get').get(
    handleGetSubscribers
);

export default router;