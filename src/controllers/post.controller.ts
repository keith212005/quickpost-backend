import { Request, RequestHandler, Response } from "express";
import { Post, User } from "@prisma/client";
import { prisma } from "../utils/db";
import { AuthRequest } from "../middlewares/auth.middleware";

type PostInput = Pick<Post, "title" | "content">;
type UserInput = Pick<User, "id">;

type TCreatePost = {
  authorId: UserInput["id"];
  title: PostInput["title"];
  content: PostInput["content"];
  tags?: string[];
};

export const getPosts = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 5;

  const skip = (page - 1) * limit;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        likes: true,
        comments: true,
      },
    }),
    prisma.post.count(),
  ]);

  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    data: posts,
    meta: {
      total,
      page,
      totalPages,
      limit,
    },
  });
};

export const createPost = async (req: Request, res: Response) => {
  const data: TCreatePost = req.body;

  if (!data.title || !data.content) {
    res.status(400).json({ message: "Title and content are required" });
    return;
  }

  const post = await prisma.post.create({
    data: {
      authorId: data.authorId,
      title: data.title,
      content: data.content,
      tags: data.tags,
    },
  });

  res.status(201).json(post);
};

export const updatePost = (async (req: AuthRequest, res: Response) => {
  const postId = req.params.id;
  const userId = req.user?.userId;
  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    if (post.authorId !== userId) {
      res.status(403).json({ message: "Not authorized to update this post" });
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: req.body,
    });

    res.status(200).json(updatedPost);
  } catch (error) {}
}) as unknown as RequestHandler;

export const deletePost = (async (req: AuthRequest, res: Response) => {
  const postId = req.params.id;
  const userId = req.user?.userId;

  try {
    const post = await prisma.post.findUnique({ where: { id: postId } });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.authorId !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    await prisma.post.delete({ where: { id: postId } });

    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err });
  }
}) as unknown as RequestHandler;
