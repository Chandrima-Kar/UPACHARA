"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Header = () => {
  const [multiDiseaseOpen, setMultiDiseaseOpen] = useState(false);
  const [drugOpen, setDrugOpen] = useState(false);
  return (
    <header className=" relative w-full z-50">
      <div className="max-w-[85rem] mx-auto flex items-center justify-between px-6 py-5">
        {/* Logo */}
        <div className="flex gap-x-1 items-center">
          <Link href="/">
            <Image
              src="/logoU.png"
              alt="Logo"
              width={170}
              height={56.27}
              className="cursor-pointer rounded-full"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex space-x-10 text-gray-700 font-ubuntu text-base  ">
          <Link
            href="/"
            className=" header_links transition-transform duration-700 ease transform hover:scale-125"
          >
            Home
          </Link>
          <Link
            href="/about"
            className=" header_links transition-transform duration-700 ease transform hover:scale-125"
          >
            About
          </Link>

          {/* Multi-disease Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setMultiDiseaseOpen(true)}
            onMouseLeave={() => setMultiDiseaseOpen(false)}
          >
            <span className="header_links  cursor-context-menu">
              Multi-diseases
            </span>
            {multiDiseaseOpen && (
              <div className="absolute left-0 w-44 z-50 bg-[#e4eefd] shadow-xl rounded-lg ">
                <Link
                  href="/predict-by-reports"
                  className="block px-4 py-2 header_links transition-transform duration-700 ease transform hover:scale-90"
                >
                  Predict by Reports
                </Link>
                <Link
                  href="/predict-by-images"
                  className="block px-4 py-2 header_links transition-transform duration-700 ease transform hover:scale-90"
                >
                  Predict by Images
                </Link>
              </div>
            )}
          </div>
          <Link
            href="/disease-prediction"
            className=" header_links transition-transform duration-700 ease transform hover:scale-125"
          >
            Disease Prediction
          </Link>

          {/* Drug Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setDrugOpen(true)}
            onMouseLeave={() => setDrugOpen(false)}
          >
            <span className="header_links  cursor-context-menu">Drug</span>
            {drugOpen && (
              <div className="absolute left-0 z-50  w-40 bg-[#e4eefd] shadow-xl rounded-lg ">
                <Link
                  href="/drug-alternative"
                  className="block px-4 py-2 header_links transition-transform duration-700 ease transform hover:scale-90"
                >
                  Drug Alternative
                </Link>
                <Link
                  href="/drug-response"
                  className="block px-4 py-2 header_links transition-transform duration-700 ease transform hover:scale-90"
                >
                  Drug Response
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/insurance"
            className=" header_links transition-transform duration-700 ease transform hover:scale-125"
          >
            Insurance
          </Link>
          <Link
            href="/blogs"
            className=" header_links transition-transform duration-700 ease transform hover:scale-125"
          >
            Blogs
          </Link>
        </nav>

        {/* User Profile */}
        <div className="flex items-center space-x-4">
          <Image
            src="/pb.jpg" // Replace with the user's profile image
            alt="User"
            width={52}
            height={52}
            className="rounded-full cursor-pointer border-2 border-gray-300"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
