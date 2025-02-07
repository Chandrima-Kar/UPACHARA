import { body } from "express-validator";

export const validateArticle = [
  body("title").isLength({ min: 5, max: 255 }).trim().escape(),
  body("content").isLength({ min: 100 }).trim(),
  body("category").optional().isString().trim(),
  body("tags").optional().isArray(),
  body("imageUrl").optional().isURL(),
];

export const validateComment = [
  body("comment").isLength({ min: 1, max: 1000 }).trim().escape(),
];
