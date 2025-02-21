"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import api from "@/utils/api";
import flaskapi from "@/utils/flaskapi";
import PostBlogModal from "@/components/PostBlogModal/PostBlogModal.jsx";
import { useUser } from "@/context/UserContext";
import VanillaTilt from "vanilla-tilt";

// vanilla-tilt
function Tilt(props) {
  const { options, ...rest } = props;
  const tilt = useRef(null);

  useEffect(() => {
    VanillaTilt.init(tilt.current, options);
  }, [options]);

  return <div ref={tilt} {...rest} />;
}

export default function BlogsPage() {
  const { user, role } = useUser();
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

      if (user.role !== "patient" || !user.medical_history) {
        //FIXME: There is nothing such as user.role
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
    };

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
    <div className="container mx-auto px-[8rem] my-10 min-h-screen">
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
                  className="p-4 shadow-md border rounded-lg"
                >
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
                    className="text-blue-500 mt-2 block"
                  >
                    Read More
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )
      )}

      {/* Latest Articles Section */}
      <div className="flex justify-between w-full items-center my-4 ">
        <h1 className="text-3xl font-serif tracking-wider font-bold">
          Latest Articles
        </h1>
        {/* Show Post Article button only if the user is a doctor */}
        {role === "doctor" && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-fit py-2 px-4 text-white bg-blue-500 rounded-md shadow-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 font-ubuntu focus:ring-blue-500 disabled:opacity-50 transition-all duration-500 transform hover:scale-110 "
          >
            Post Article
          </button>
        )}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7 ">
        {articles.map((article) => (
          // <div
          //   key={article.id}
          //   className="flex flex-col items-center justify-center font-lato gap-1"
          // >
          //   <img src={article.image_url} className="w-full h-72 rounded-md" />
          //   <h2 className="text-lg font-semibold text-center">
          //     {article.title}
          //   </h2>
          //   <div className="flex justify-between w-full px-2">
          //     <p className="text-sm text-gray-700">
          //       <b>Category:</b> {article.category}
          //     </p>
          //     <p className="text-sm text-gray-700">
          //       <b>Author:</b> {article.doctor_first_name}{" "}
          //       {article.doctor_last_name}
          //     </p>
          //   </div>

          //   <Link
          //     href={`/blogs/${article.id}`}
          //     className="w-fit py-1 px-4 text-white bg-blue-500 rounded-md shadow-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 font-ubuntu focus:ring-blue-500 disabled:opacity-50 transition-all duration-500 transform hover:scale-110"
          //   >
          //     Read More
          //   </Link>
          // </div>

          <Tilt
            key={article.id}
            className="relative w-full mb-7 h-auto rounded-2xl overflow-hidden shadow-lg blogCards"
          >
            <img
              src={article.image_url || "/default-image.jpg"}
              alt={article.title || "Blog Image"}
              className="w-full h-full rounded-2xl object-cover"
            />
            <div className="text-dark_primary_text flex flex-col items-center justify-end gap-1 overflow-hidden left-0 bottom-0 absolute h-full w-full rounded-2xl px-3 py-10 blogCardsContents">
              <h3 className="text-center text-white font-bold font-playfair text-2xl">
                {article.title}
              </h3>

              <div className="absolute bottom-3 right-5 italic text-sm tracking-wider font-playfair">
                <p className="text-sm text-gray-100">
                  <b>Category:</b> {article.category}
                </p>
              </div>

              <div className="absolute bottom-3 left-5 italic text-sm tracking-wider font-playfair">
                <p className="text-sm text-gray-100">
                  <b>Author:</b> {article.doctor_first_name}{" "}
                  {article.doctor_last_name}
                </p>
              </div>

              <Link
                href={`/blogs/${article.id}`}
                className="w-fit py-1 px-4 text-white bg-blue-500 rounded-md shadow-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 font-ubuntu focus:ring-blue-500 disabled:opacity-50 transition-all duration-500 transform hover:scale-110"
              >
                Read More
              </Link>
            </div>
          </Tilt>
        ))}
      </div>

      {/* Post Article Modal */}
      {role === "doctor" && (
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
