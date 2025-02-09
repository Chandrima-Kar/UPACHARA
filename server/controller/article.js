import { validationResult } from "express-validator";
import { pool } from "../index.js";

export const post_article = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, content, category, tags, imageUrl } = req.body;
    const doctorId = req.user.id;

    const result = await pool.query(
      `INSERT INTO articles (doctor_id, title, content, category, tags, image_url)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, title, created_at`,
      [doctorId, title, content, category, tags, imageUrl]
    );

    res.status(201).json({
      message: "Article created successfully",
      article: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const get_articles = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;
    const offset = (page - 1) * limit;

    let query = `
          SELECT 
            a.*,
            d.first_name as doctor_first_name,
            d.last_name as doctor_last_name,
            d.specialization as doctor_specialization,
            (SELECT COUNT(*) FROM article_likes WHERE article_id = a.id) as likes_count,
            (SELECT COUNT(*) FROM article_comments WHERE article_id = a.id) as comments_count
          FROM articles a
          JOIN doctors d ON a.doctor_id = d.id
        `;

    const params = [];
    if (category) {
      query += ` WHERE a.category = $1`;
      params.push(category);
    }

    query += ` ORDER BY a.created_at DESC LIMIT $${params.length + 1} OFFSET $${
      params.length + 2
    }`;
    params.push(limit, offset);

    const result = await pool.query(query, params);

    const countResult = await pool.query(
      "SELECT COUNT(*) FROM articles" +
        (category ? " WHERE category = $1" : ""),
      category ? [category] : []
    );

    res.json({
      articles: result.rows,
      total: parseInt(countResult.rows[0].count),
      currentPage: parseInt(page),
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const get_article = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT 
            a.*,
            d.first_name as doctor_first_name,
            d.last_name as doctor_last_name,
            d.specialization as doctor_specialization,
            (SELECT COUNT(*) FROM article_likes WHERE article_id = a.id) as likes_count,
            (SELECT COUNT(*) FROM article_comments WHERE article_id = a.id) as comments_count
          FROM articles a
          JOIN doctors d ON a.doctor_id = d.id
          WHERE a.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Article not found" });
    }

    await pool.query("UPDATE articles SET views = views + 1 WHERE id = $1", [
      id,
    ]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const update_article = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { title, content, category, tags, imageUrl } = req.body;
    const doctorId = req.user.id;

    const articleCheck = await pool.query(
      "SELECT doctor_id FROM articles WHERE id = $1",
      [id]
    );

    if (articleCheck.rows.length === 0) {
      return res.status(404).json({ error: "Article not found" });
    }

    if (articleCheck.rows[0].doctor_id !== doctorId) {
      return res
        .status(403)
        .json({ error: "Not authorized to update this article" });
    }

    await pool.query(
      `UPDATE articles 
         SET title = $1, content = $2, category = $3, tags = $4, 
             image_url = $5, updated_at = CURRENT_TIMESTAMP
         WHERE id = $6 AND doctor_id = $7`,
      [title, content, category, tags, imageUrl, id, doctorId]
    );

    res.json({ message: "Article updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const delete_article = async (req, res) => {
  try {
    const { id } = req.params;
    const doctorId = req.user.id;

    const result = await pool.query(
      "DELETE FROM articles WHERE id = $1 AND doctor_id = $2 RETURNING id",
      [id, doctorId]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Article not found or not authorized" });
    }

    res.json({ message: "Article deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const like_article = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userType = req.user.role;

    const likeExists = await pool.query(
      "SELECT * FROM article_likes WHERE article_id = $1 AND user_id = $2 AND user_type = $3",
      [id, userId, userType]
    );

    if (likeExists.rows.length > 0) {
      await pool.query(
        "DELETE FROM article_likes WHERE article_id = $1 AND user_id = $2 AND user_type = $3",
        [id, userId, userType]
      );
      res.json({ message: "Article unliked successfully" });
    } else {
      await pool.query(
        "INSERT INTO article_likes (article_id, user_id, user_type) VALUES ($1, $2, $3)",
        [id, userId, userType]
      );
      res.json({ message: "Article liked successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const comment_article = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { comment } = req.body;
    const userId = req.user.id;
    const userType = req.user.role;

    const result = await pool.query(
      `INSERT INTO article_comments (article_id, user_id, user_type, comment)
         VALUES ($1, $2, $3, $4)
         RETURNING id, comment, created_at`,
      [id, userId, userType, comment]
    );

    res.status(201).json({
      message: "Comment added successfully",
      comment: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const get_comments = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const comments = await pool.query(
      `SELECT 
            ac.*,
            CASE 
              WHEN ac.user_type = 'doctor' THEN 
                json_build_object(
                  'first_name', d.first_name,
                  'last_name', d.last_name,
                  'specialization', d.specialization
                )
              WHEN ac.user_type = 'patient' THEN 
                json_build_object(
                  'first_name', p.first_name,
                  'last_name', p.last_name
                )
            END as user_info
          FROM article_comments ac
          LEFT JOIN doctors d ON ac.user_type = 'doctor' AND ac.user_id = d.id
          LEFT JOIN patients p ON ac.user_type = 'patient' AND ac.user_id = p.id
          WHERE ac.article_id = $1
          ORDER BY ac.created_at DESC
          LIMIT $2 OFFSET $3`,
      [id, limit, offset]
    );

    const countResult = await pool.query(
      "SELECT COUNT(*) FROM article_comments WHERE article_id = $1",
      [id]
    );

    res.json({
      comments: comments.rows,
      total: parseInt(countResult.rows[0].count),
      currentPage: parseInt(page),
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const get_doctor_articles = async (req, res) => {
  try {
    const doctorId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT 
          a.*,
          (SELECT COUNT(*) FROM article_likes WHERE article_id = a.id) as likes_count,
          (SELECT COUNT(*) FROM article_comments WHERE article_id = a.id) as comments_count
        FROM articles a
        WHERE a.doctor_id = $1
        ORDER BY a.created_at DESC
        LIMIT $2 OFFSET $3`,
      [doctorId, limit, offset]
    );

    const countResult = await pool.query(
      "SELECT COUNT(*) FROM articles WHERE doctor_id = $1",
      [doctorId]
    );

    res.json({
      articles: result.rows,
      total: parseInt(countResult.rows[0].count),
      currentPage: parseInt(page),
      totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
