import express from "express";
import { getOtherUsers, login, logout, register } from "../controllers/userController.js";
import isAuthenticated from "../middleware/isAuthenticated.js";

const router = express.Router();

router.route("/register").post(register);        // Public route
router.route("/login").post(login);              // Public route
router.route("/logout").get(logout);             // Public route (optional if logout needs no auth)
router.route("/").get(isAuthenticated, getOtherUsers); // Protected route

export default router;
