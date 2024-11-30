import { Router } from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import {
    handleGetSubscribers,
    handleGetChannels,
    handleUserSubscribe,
    handleDeleteSubscriber
} from "../controllers/subscription.controller.js";
import { validateInput } from "../middlewares/validation.middleware.js";
import { subscriptionValidationSchema } from "../validators/subscription.validator.js";

const router = Router();

//at /api/v1/sub

router.use(authUser);

//display subscribers
router.route('/get').get(
    handleGetSubscribers
);

//display subscribed channels
router.route('/channels/get').get(
    handleGetChannels
)

//Subscribe
router.route('/subscribe').post(
    validateInput(subscriptionValidationSchema),
    handleUserSubscribe
)

//Remove Subscriber
router.route('/remove').delete(
    validateInput(subscriptionValidationSchema),
    handleDeleteSubscriber
)

export default router;