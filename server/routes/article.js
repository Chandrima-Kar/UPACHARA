import express from "express";
import {
  comment_article,
  delete_article,
  get_article,
  get_articles,
  get_comments,
  like_article,
  post_article,
  update_article,
} from "../controller/article.js";
import { authenticateToken, authorizeDoctor } from "../middleware/index.js";
import { validateArticle, validateComment } from "../validators/articles.js";

const router = express.Router();

router.post(
  "/",
  authenticateToken,
  authorizeDoctor,
  validateArticle,
  post_article
);

router.get("/", get_articles);

router.get("/:id", get_article);

router.put(
  "/:id",
  authenticateToken,
  authorizeDoctor,
  validateArticle,
  update_article
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeDoctor,
  delete_article
);

router.post("/:id/like", authenticateToken, like_article);

router.post(
  "/:id/comments",
  authenticateToken,
  validateComment,
  comment_article
);

router.get("/:id/comments", get_comments);



export default router;
