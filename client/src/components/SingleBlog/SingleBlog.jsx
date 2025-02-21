"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import api from "@/utils/api";
import { toast } from "react-toastify";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import ReactMarkdown from "react-markdown";

export default function SingleBlogPage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetchArticle();
    fetchComments();
  }, [id]);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/article/${id}`);
      if (response.status === 200) {
        setArticle(response.data);
      }
    } catch (err) {
      setError("Failed to load article.");
    }
    setLoading(false);
  };

  const fetchComments = async () => {
    try {
      const res = await api.get(`/article/${id}/comments`);
      setComments(res.data.comments);
    } catch (err) {
      console.error("Failed to load comments", err);
    }
  };

  const handleLike = async () => {
    try {
      setLiked(!liked);
      const response = await api.post(`/article/${id}/like`);
      if (response.status === 200) {
        setArticle((prev) => ({ ...prev, likes_count: prev.likes_count + 1 }));
        toast.success("Article liked successfully!");
      }
    } catch (err) {
      console.error("Error liking article.", err);
      toast.error("Failed to like article! Try again.");
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

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-3xl flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-center font-montserrat mb-3">
          {article.title}
        </h1>
        <p className="text-base font-mono text-gray-700">{article.category}</p>
        {article.image_url && (
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full my-4 rounded-lg"
          />
        )}
        <ReactMarkdown>{article.content}</ReactMarkdown>{" "}
        <div className="flex flex-col mt-4 justify-start w-full gap-4">
          <p className="text-sm  font-lato ">
            By{" "}
            <span className="font-bold">
              Dr. {article.doctor_first_name} {article.doctor_last_name}
            </span>
            <span className="text-gray-500">
              {" "}
              ({article.doctor_specialization})
            </span>
          </p>

          <div className="flex items-center space-x-4 font-ubuntu">
            <button
              onClick={handleLike}
              className="flex items-center justify-center gap-1">
              {liked ? <FaHeart className="text-red-500" /> : <FaRegHeart />} (
              {liked ? 1 : 0})
            </button>
            <span className="text-gray-500">{article.views} Views</span>
          </div>

          {/* Comments Section */}
          <div className="mt-6">
            <h3 className="text-lg font-mono font-bold">
              Comments ({article.comments_count})
            </h3>

            {/* Add Comment */}
            <div className="mt-2 flex items-center justify-center gap-3">
              <input
                type="text"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm"
              />
              <button
                onClick={handleComment}
                className="w-fit py-2 px-4 text-white bg-blue-500 rounded-md shadow-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 font-ubuntu focus:ring-blue-500 disabled:opacity-50 transition-all duration-500 transform hover:scale-110 ">
                Comment
              </button>
            </div>

            {/* Display Comments */}
            <div className="mt-4 space-y-2">
              {comments && comments.length > 0 ? (
                comments.map((c) => (
                  <div key={c.id} className="border-b py-2">
                    <p className="text-gray-700 font-lato px-1">{c.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No comments yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
