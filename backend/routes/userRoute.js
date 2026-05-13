import express from "express";
import { getUser, updateProfile } from "../controllers/authController.js";

const router = express.Router();

// Must come before /:id to avoid being matched by wildcard
router.route('/profile/update').post(updateProfile);
router.route('/:id').get(getUser);

export default router;