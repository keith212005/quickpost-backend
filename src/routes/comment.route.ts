import express from "express";
import {
  createComment,
  deleteComment,
} from "../controllers/comment.controller";

const router = express.Router();

router.post("/:id/comment", createComment);
router.delete("/:id/comment/:commentId", deleteComment);

export default router;
