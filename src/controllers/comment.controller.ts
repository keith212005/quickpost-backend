import { AuthRequest } from "../middlewares/auth.middleware";
import { RequestHandler, Response } from "express";
import { prisma } from "../utils/db";

export const createComment = (async (req: AuthRequest, res: Response) => {
  const postId = req.params.id;
  const userId = req.user?.userId;
  const { content, parentId } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: userId,
        parentId: parentId || null, // for nested replies
      },
    });

    return res.status(201).json({ message: "Comment added", comment });
  } catch (error) {
    console.error("Comment Error:", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
}) as unknown as RequestHandler;

export const deleteComment = (async (req: AuthRequest, res: Response) => {
  const commentId = req.params.commentId;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.authorId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    return res.status(200).json({ message: "Comment deleted" });
  } catch (error) {
    console.error("Comment Error:", error);
    return res.status(500).json({ message: "Something went wrong", error });
  }
}) as unknown as RequestHandler;
