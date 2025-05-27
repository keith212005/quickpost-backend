import express from "express";
import { likePost } from "../controllers/like.controller";

const router = express.Router();

router.post("/:id/like", likePost);

export default router;
