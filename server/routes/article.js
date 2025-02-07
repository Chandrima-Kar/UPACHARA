import express from "express";
import {
  comment_article,
  delete_article,
  get_article,
  get_articles,
  get_comments,
  get_doctor_articles,
  like_article,
  post_article,
  update_article,
} from "../controller/article.js";
import { authenticateToken, authorizeDoctor } from "../middleware/index.js";
import { validateArticle, validateComment } from "../validators/articles.js";

const router = express.Router();

router.post(
  "/api/articles",
  authenticateToken,
  authorizeDoctor,
  validateArticle,
  post_article
);

router.get("/api/articles", get_articles);

router.get("/api/articles/:id", get_article);

router.put(
  "/api/articles/:id",
  authenticateToken,
  authorizeDoctor,
  validateArticle,
  update_article
);

router.delete(
  "/api/articles/:id",
  authenticateToken,
  authorizeDoctor,
  delete_article
);

router.post("/api/articles/:id/like", authenticateToken, like_article);

router.post(
  "/api/articles/:id/comments",
  authenticateToken,
  validateComment,
  comment_article
);

router.get("/api/articles/:id/comments", get_comments);

router.get(
  "/api/doctor/articles",
  authenticateToken,
  authorizeDoctor,
  get_doctor_articles
);

export default router;
