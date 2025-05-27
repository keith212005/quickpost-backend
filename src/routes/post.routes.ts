import express from "express";
import {
  getPosts,
  createPost,
  deletePost,
  updatePost,
} from "../controllers/post.controller";

const router = express.Router();

router.get("/", getPosts);
router.post("/", createPost);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;
