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

const DoctorHeader = () => {
  const router = useRouter();
  const { user, logout } = useUser();

  return (
    <header className="relative w-full z-50">
      <div className="max-w-[85rem] mx-auto flex items-center justify-between px-6 py-5">
        <Link href="/">
          <Image
            src="/logoU.png"
            alt="Logo"
            width={170}
            height={56.27}
            className="cursor-pointer rounded-full"
          />
        </Link>
        <nav className="flex space-x-7 text-gray-700 font-ubuntu text-base">
          <Link href="/" className="header_links hover:scale-110">
            Doctor Dashboard
          </Link>
          <Link href="/appointments" className="header_links hover:scale-110">
            Appointments
          </Link>
          <Link href="/blogs" className="header_links hover:scale-110">
            Blogs
          </Link>
        </nav>
        {user && <UserDropdown user={user} logout={logout} router={router} />}
      </div>
    </header>
  );
};

const PatientHeader = () => {
  const router = useRouter();
  const { user, logout } = useUser();
  const [multiDiseaseOpen, setMultiDiseaseOpen] = useState(false);
  const [drugOpen, setDrugOpen] = useState(false);

  return (
    <header className="relative w-full z-50">
      <div className="max-w-[85rem] mx-auto flex items-center justify-between px-6 py-5">
        <Link href="/">
          <Image
            src="/logoU.png"
            alt="Logo"
            width={170}
            height={56.27}
            className="cursor-pointer rounded-full"
          />
        </Link>
        <nav className="flex space-x-7 text-gray-700 font-ubuntu text-base">
          <Link href="/" className="header_links hover:scale-110">
            Home
          </Link>
          <Link href="/about" className="header_links hover:scale-110">
            About
          </Link>
          <Dropdown
            label="Multi-diseases"
            open={multiDiseaseOpen}
            setOpen={setMultiDiseaseOpen}>
            <Link href="/predict-by-reports">Predict by Reports</Link>
            <Link href="/predict-by-images">Predict by Images</Link>
          </Dropdown>
          <Link
            href="/disease-prediction"
            className="header_links hover:scale-110">
            Disease Prediction
          </Link>
          <Link
            href="/book-appointment"
            className="header_links hover:scale-110">
            Book Appointment
          </Link>
          <Dropdown label="Drug" open={drugOpen} setOpen={setDrugOpen}>
            <Link href="/drug-alternative">Drug Alternative</Link>
            <Link href="/drug-response">Drug Response</Link>
          </Dropdown>
          <Link href="/insurance" className="header_links hover:scale-110">
            Insurance
          </Link>
          <Link href="/blogs" className="header_links hover:scale-110">
            Blogs
          </Link>
        </nav>
        {user && <UserDropdown user={user} logout={logout} router={router} />}
      </div>
    </header>
  );
};

const UserDropdown = ({ user, logout, router }) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button className="flex items-center gap-0 p-0 rounded-lg">
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
        onClick={() => router.push("/dashboard")}
        className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-200">
        <LayoutDashboard className="w-4 h-4 text-blue-500" /> Dashboard
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => router.push("/my-profile")}
        className="flex items-center gap-2 px-4 py-2 cursor-pointer text-blue-500 hover:bg-gray-200">
        👤 My Profile
      </DropdownMenuItem>
      <DropdownMenuItem
        onClick={() => {
          logout();
          router.push("/login");
        }}
        className="flex items-center gap-2 px-4 py-2 cursor-pointer text-red-500 hover:bg-gray-200">
        <LogOut className="w-4 h-4" /> Logout
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const Dropdown = ({ label, open, setOpen, children }) => (
  <div
    className="relative group"
    onMouseEnter={() => setOpen(true)}
    onMouseLeave={() => setOpen(false)}>
    <span className="header_links cursor-context-menu">{label}</span>
    {open && (
      <div className="absolute left-0 z-50 bg-[#e4eefd] shadow-xl rounded-lg">
        {children}
      </div>
    )}
  </div>
);

export { DoctorHeader, PatientHeader };