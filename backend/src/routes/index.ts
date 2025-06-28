import { Router } from "express";
import userRoutes from "./user";
import postRoutes from "./post";
import commentRoutes from "./comment";
import { Routes } from "../utils/enums";

const router = Router();

router.use("/", userRoutes);
router.use("/", postRoutes);
router.use(`/${Routes.POSTS}`, commentRoutes);

export default router;
