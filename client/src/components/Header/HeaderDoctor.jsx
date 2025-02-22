"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

const HeaderDoctor = () => {
  const router = useRouter();
  const { user, logout } = useUser();

  return (
    <header className="relative w-full z-50">
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
        <nav className="flex space-x-7 text-gray-700 font-ubuntu text-base">
          <Link
            href="/"
            className="header_links transition-transform duration-700 ease transform hover:scale-110">
            Doctor Dashboard
          </Link>
          <Link
            href="/appointments"
            className="header_links transition-transform duration-700 ease transform hover:scale-110">
            Appointments
          </Link>

          <Link
            href="/blogs"
            className="header_links transition-transform duration-700 ease transform hover:scale-110">
            Blogs
          </Link>
        </nav>

        {/* User Profile */}
        <div className="flex items-center font-sans space-x-0">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-0 p-0 rounded-lg transition">
                  <img
                    src={user.image_url || "/pb.png"}
                    alt="Profile"
                    className="w-14 h-14 rounded-full border border-gray-300"
                  />
                  <ChevronDown className="w-5 h-5 text-black" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white flex flex-col my-1 shadow-lg rounded-md py-0 w-36">
                <DropdownMenuItem
                  onClick={() => {
                    router.push("/my-profile");
                  }}
                  className="flex items-center gap-2 px-4 py-2 cursor-pointer text-blue-500 hover:bg-gray-200">
                  👤 My Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    logout();
                    router.push("/login");
                  }}
                  className="flex items-center gap-2 px-4 py-2 cursor-pointer text-red-500 hover:bg-gray-200">
                  <LogOut className="w-4 h-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Link
                href="/login"
                className="transition-transform duration-700 ease font-medium text-blue-500 hover:text-blue-700 transform hover:scale-110">
                Login
              </Link>
              <Link
                href="/sign-up"
                className="transition-transform duration-700 ease font-medium text-blue-500 hover:text-blue-700 transform hover:scale-110">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default HeaderDoctor;
