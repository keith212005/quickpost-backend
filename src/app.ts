import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./utils/swagger";

import { authenticate } from "./middlewares/auth.middleware";

import authRoutes from "./routes/auth.routes";
import postRoutes from "./routes/post.routes";
import likeRoutes from "./routes/like.routes";
import commentRoutes from "./routes/comment.route";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", authRoutes);
app.use("/api/post", authenticate, postRoutes);
app.use("/api/post", authenticate, likeRoutes);
app.use("/api/post", authenticate, commentRoutes);

export default app;
