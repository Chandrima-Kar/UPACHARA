
import React, { useState } from "react";
import api from "@/utils/api";
import { toast } from "react-toastify";

const PostBlogModal = ({ isOpen, onClose, refreshArticles }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Convert tags from a comma-separated string to an array
    const formattedData = {
      ...formData,
      tags: formData.tags.split(",").map((tag) => tag.trim()),
    };

    try {
      await api.post("/article", formattedData);
      toast.success("Post Successful !!");
      refreshArticles(); // All articles automatically refreshed
      onClose();
    } catch (err) {
      setError("Failed to post article. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Post a New Article</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            className="w-full p-2 border rounded mb-2"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="content"
            placeholder="Content"
            className="w-full p-2 border rounded mb-2"
            value={formData.content}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            className="w-full p-2 border rounded mb-2"
            value={formData.category}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="tags"
            placeholder="Tags (comma separated)"
            className="w-full p-2 border rounded mb-2"
            value={formData.tags}
            onChange={handleChange}
          />
          <input
            type="text"
            name="imageUrl"
            placeholder="Image URL"
            className="w-full p-2 border rounded mb-2"
            value={formData.imageUrl}
            onChange={handleChange}
          />
          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="px-4 py-2 mr-2 bg-gray-500 text-white rounded"
              onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
              disabled={loading}>
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostBlogModal;
