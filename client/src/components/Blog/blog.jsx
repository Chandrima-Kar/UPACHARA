"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/utils/api";
import flaskapi from "@/utils/flaskapi";
import PostBlogModal from "@/components/PostBlogModal/PostBlogModal.jsx";
import { useUser } from "@/context/UserContext";

export default function BlogsPage() {
  const { user } = useUser();
  const [articles, setArticles] = useState([]);
  const [recommendedArticles, setRecommendedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fix for Next.js hydration error
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch latest articles
  const fetchArticles = async (page = 1, limit = 10, category = "") => {
    const { data } = await api.get(
      `/article?page=${page}&limit=${limit}&category=${category}`
    );
    return data;
  };

  // Fetch recommended articles only if patient logged in.
  // FIXME: But here the  value of user from global state is initially fetched as null.
  const fetchRecommendedArticles = async () => {
    try {
      setLoadingRecommendations(true);

      if (!user) {
        console.warn("No user logged in. Skipping recommendations.");
        return [];
      }

      if (user.role !== "patient" || !user.medical_history) { //FIXME: There is nothing such as user.role
        console.warn(
          "User is not a patient or has no medical history. Skipping recommendations."
        );
        return [];
      }

      const response = await flaskapi.post("/recommend-articles", {
        user_history: user.medical_history,
      });

      console.log("Recommended Articles:", response.data.recommendations);
      return response.data.recommendations;
    } catch (error) {
      console.error(
        "Error fetching recommendations:",
        error.response?.data || error.message
      );
      return [];
    } finally {
      setLoadingRecommendations(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const articlesData = await fetchArticles();
        setArticles(articlesData.articles);

        const recommendedData = await fetchRecommendedArticles();
        setRecommendedArticles(recommendedData);
      } catch (error) {
        console.error("Error loading articles:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  if (loading) {
    return <p>Loading articles...</p>;
  }

  // Fix for Next.js hydration error
  if (!isClient) {
    return null;
  }

  return (
    <div className="container mx-auto px-4">
      {/* Recommended Articles Section */}
      {loadingRecommendations ? (
        <p className="text-gray-600 my-6 text-lg">
          Fetching recommended articles...
        </p>
      ) : (
        recommendedArticles.length > 0 && (
          <div className="my-6">
            <h2 className="text-2xl font-bold mb-4">
              Tailored Reads Just for You!
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedArticles.map((article) => (
                <div
                  key={article.id}
                  className="p-4 shadow-md border rounded-lg">
                  <h2 className="text-xl font-semibold">{article.title}</h2>
                  <p className="text-gray-600">{article.category}</p>
                  <img
                    src={article.image_url}
                    className="w-full h-72 rounded-md"
                  />
                  <p className="text-sm">
                    {article.doctor_first_name} {article.doctor_last_name}
                  </p>
                  <Link
                    href={`/blogs/${article.id}`}
                    className="text-blue-500 mt-2 block">
                    Read More
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )
      )}

      {/* Latest Articles Section */}
      <div className="flex justify-between items-center my-4">
        <h1 className="text-3xl font-bold">Latest Articles</h1>
        {/* Show Post Article button only if the user is a doctor */}
        {user?.role === "doctor" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded">
            Post Article
          </button>
        )}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
          <div key={article.id} className="p-4 shadow-md border rounded-lg">
            <h2 className="text-xl font-semibold">{article.title}</h2>
            <p className="text-gray-600">{article.category}</p>
            <img src={article.image_url} className="w-full h-72 rounded-md" />
            <p className="text-sm">
              {article.doctor_first_name} {article.doctor_last_name}
            </p>
            <Link
              href={`/blogs/${article.id}`}
              className="text-blue-500 mt-2 block">
              Read More
            </Link>
          </div>
        ))}
      </div>

      {/* Post Article Modal */}
      {user?.role === "doctor" && ( //FIXME: There is nothing such as user.role
        <PostBlogModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          refreshArticles={() =>
            fetchArticles().then((data) => setArticles(data.articles))
          }
        />
      )}
    </div>
  );
}
