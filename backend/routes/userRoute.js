import express from "express";
import { getUser, login, logout, register, updateProfile } from "../controllers/userController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('profile').get(isAuthenticated, getUser);
router.route('/profile/update').put(isAuthenticated, updateProfile);

export default router;