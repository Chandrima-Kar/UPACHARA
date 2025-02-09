"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/utils/api";

export default function SingleBlogPage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchArticle();
    fetchComments();
  }, [id]);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/article/${id}`);
      setArticle(res.data);
    } catch (err) {
      setError("Failed to load article.");
    }
    setLoading(false);
  };

  const handleLike = async () => {
    try {
      await api.post(`/article/${id}/like`);
      setArticle((prev) => ({ ...prev, likes_count: prev.likes_count + 1 }));
    } catch {
      setError("Failed to like article.");
    }
  };

  const handleComment = async () => {
    if (comment.trim()) {
      try {
        await api.post(`/article/${id}/comments`, { comment });
        setComment("");
        fetchComments(); // Refresh article to show new comments
      } catch {
        setError("Failed to post comment.");
      }
    }
  };

  const fetchComments = async () => {
    try {
      const res = await api.get(`/article/${id}/comments`);
      setComments(res.data.comments);
    } catch (err) {
      console.error("Failed to load comments", err);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold">{article.title}</h1>
        <p className="text-sm text-gray-500">{article.category}</p>

        {article.image_url && (
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full my-4 rounded-lg"
          />
        )}

        <p className="text-gray-700">{article.content}</p>
        <p className="text-sm mt-2">
          By{" "}
          <span className="font-bold">
            {article.doctor_first_name} {article.doctor_last_name}
          </span>
          <span className="text-gray-500">
            {" "}
            ({article.doctor_specialization})
          </span>
        </p>

        <div className="mt-4 flex items-center space-x-4">
          <button
            onClick={handleLike}
            className="bg-blue-500 text-white px-4 py-2 rounded">
            Like ({article.likes_count})
          </button>
          <span className="text-gray-500">{article.views} Views</span>
        </div>

        {/* Comments Section */}
        <div className="mt-6">
          <h3 className="text-lg font-bold">
            Comments ({article.comments_count})
          </h3>

          {/* Add Comment */}
          <div className="mt-2 flex">
            <input
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="border p-2 flex-1 rounded-l"
            />
            <button
              onClick={handleComment}
              className="bg-green-500 text-white px-4 py-2 rounded-r">
              Comment
            </button>
          </div>

          {/* Display Comments */}
          <div className="mt-4 space-y-2">
            {comments && comments.length > 0 ? (
              comments.map((c) => (
                <div key={c.id} className="border-b py-2">
                  <p className="text-gray-700">{c.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No comments yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
