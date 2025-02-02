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
              src="/ed.jpg" // Replace with your logo path
              alt="Logo"
              width={35}
              height={35}
              className="cursor-pointer rounded-full"
            />
          </Link>
          <h1 className=" font-bold text-[1.5rem] ">Upachara</h1>
        </div>

        {/* Navigation */}
        <nav className="flex space-x-10 text-gray-700 font-logo_text text-lg  ">
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
          <Link
            href="/disease"
            className=" header_links transition-transform duration-700 ease transform hover:scale-125"
          >
            Disease
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
              <div className="absolute left-0 w-full z-50 bg-[#e4eefd] shadow-xl rounded-lg ">
                <Link
                  href="/disease/liver"
                  className="block px-4 py-2 header_links transition-transform duration-700 ease transform hover:scale-90"
                >
                  Liver
                </Link>
                <Link
                  href="/disease/kidney"
                  className="block px-4 py-2 header_links transition-transform duration-700 ease transform hover:scale-90"
                >
                  Kidney
                </Link>
                <Link
                  href="/disease/heart"
                  className="block px-4 py-2 header_links transition-transform duration-700 ease transform hover:scale-90"
                >
                  Heart
                </Link>
                <Link
                  href="/disease/diabetes"
                  className="block px-4 py-2 header_links transition-transform duration-700 ease transform hover:scale-90"
                >
                  Diabetes
                </Link>
                <Link
                  href="/disease/pancreas"
                  className="block px-4 py-2 header_links transition-transform duration-700 ease transform hover:scale-90"
                >
                  Pancreas
                </Link>
              </div>
            )}
          </div>

          {/* Drug Dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setDrugOpen(true)}
            onMouseLeave={() => setDrugOpen(false)}
          >
            <span className="header_links  cursor-context-menu">Drug</span>
            {drugOpen && (
              <div className="absolute left-0 z-50  w-40 bg-[#e4eefd] shadow-xl shadow-lg rounded-lg ">
                <Link
                  href="/drug/alternative"
                  className="block px-4 py-4 header_links transition-transform duration-700 ease transform hover:scale-90"
                >
                  Drug Alternative
                </Link>
                <Link
                  href="/drug/response"
                  className="block px-4 py-4 header_links transition-transform duration-700 ease transform hover:scale-90"
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
