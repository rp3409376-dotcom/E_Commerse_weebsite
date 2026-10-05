import exppress from "express";
import { signupUser, loginUser } from "../controllers/authControllers.js";

const router = exppress.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);

export default router