import { User } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../utils/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

type SignupInput = Pick<User, "firstName" | "lastName" | "email" | "password">;
type SigninInput = Pick<User, "email" | "password">;

export const signup = async (req: Request, res: Response) => {
  const data: SignupInput = req.body;

  if (!data.firstName || !data.lastName || !data.email || !data.password) {
    res.status(400).json({ message: "Please provide all the required fields" });
    return;
  }

  const existtingUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (existtingUser) {
    res.status(400).json({ message: "User already exists!" });
    return;
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: `${data.firstName} ${data.lastName}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
    },
  });

  const { password: _, ...safeUser } = user;

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  res.status(201).json({
    message: "User created successfully",
    token,
    user: safeUser,
  });
};

export const signin = async (req: Request, res: Response) => {
  const data: SigninInput = req.body;

  if (!data.email || !data.password) {
    res.status(400).json({ message: "Please provide all the required fields" });
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user || !user.password) {
    res
      .status(400)
      .json({ message: "User does not exist or password is missing!" });
    return;
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    res.status(400).json({ message: "Invalid password!" });
    return;
  }

  const { password: _, ...safeUser } = user;

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  res.status(200).json({
    message: "User signed in successfully",
    token,
    user: safeUser,
  });
};
