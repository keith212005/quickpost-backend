import { AuthRequest } from "../middlewares/auth.middleware";
import { RequestHandler, Response } from "express";
import { prisma } from "../utils/db";

export const likePost = (async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const postId = req.params.id;

  console.log("POST ID:", req.params.id);
  console.log("USER ID:", req.user?.userId);

  try {
    // Check if like already exists
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
      return res.status(200).json({ message: "Post unliked" });
    }

    await prisma.like.create({
      data: {
        userId,
        postId,
      },
    });

    return res.status(200).json({ message: "Post liked" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
}) as unknown as RequestHandler;
