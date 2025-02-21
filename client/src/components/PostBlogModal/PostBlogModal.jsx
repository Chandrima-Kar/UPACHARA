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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[35rem] relative z-50">
        <h2 className="text-2xl font-montserrat font-bold mb-4">
          Post a New Article
        </h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="content"
            placeholder="Content"
            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm max-h-24"
            value={formData.content}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm"
            value={formData.category}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="tags"
            placeholder="Tags (comma separated)"
            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm"
            value={formData.tags}
            onChange={handleChange}
          />
          <input
            type="text"
            name="imageUrl"
            placeholder="Image URL"
            className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm"
            value={formData.imageUrl}
            onChange={handleChange}
          />
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              className=" bg-gray-500 w-fit py-2 px-4 text-white rounded-md shadow-md font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 font-ubuntu focus:ring-gray-500 disabled:opacity-50 transition-all duration-500 transform hover:scale-110 "
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-fit py-2 px-4 text-white bg-blue-500 rounded-md shadow-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 font-ubuntu focus:ring-blue-500 disabled:opacity-50 transition-all duration-500 transform hover:scale-110 "
              disabled={loading}
            >
              {loading ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostBlogModal;
