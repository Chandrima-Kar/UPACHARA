import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaSquareXTwitter,
  FaLinkedin,
  FaYoutube,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa6";

const Footer = () => {
  return (
    <div className="bg-blue-500 w-full px-3 pt-5 pb-32 flex  items-center justify-evenly">
      <div className="flex flex-col items-center justify-center gap-2 ">
        <Link href="/">
          <Image
            src="/logoU.png" // Replace with your logo path
            alt="Logo"
            width={170}
            height={56.27}
            className="cursor-pointer rounded-full"
          />
        </Link>
        <div className="flex items-center justify-center gap-5">
          <FaFacebook className="w-5 h-5 text-gray-200 cursor-pointer transition-transform duration-300 ease transform hover:scale-125" />
          <FaInstagram className="w-5 h-5 text-gray-200 cursor-pointer transition-transform duration-300 ease transform hover:scale-125" />
          <FaLinkedin className="w-5 h-5 text-gray-200 cursor-pointer transition-transform duration-300 ease transform hover:scale-125" />
          <FaSquareXTwitter className="w-5 h-5 text-gray-200 cursor-pointer transition-transform duration-300 ease transform hover:scale-125" />
          <FaYoutube className="w-5 h-5 text-gray-200 cursor-pointer transition-transform duration-300 ease transform hover:scale-125" />
        </div>
        <div className=" font-lato text-center">
          All rights reserved <br />
          <p className="w-40 h-[0.5] bg-black"></p>
          Made by{" "}
          <span className=" text-white">
            <em>Hactivists</em>{" "}
          </span>
        </div>
      </div>
      <div className="flex  justify-center gap-x-20">
        <div>
          <h1 className=" font-montserrat mb-3">Quick Links</h1>

          <ul className=" font-medium font-lato opacity-70 flex flex-col gap-y-1">
            <Link
              href="/about"
              className="cursor-pointer underline-animation h-fit w-fit"
            >
              About Us
            </Link>
            <Link
              href="/blogs"
              className="cursor-pointer underline-animation h-fit w-fit"
            >
              Our Blogs{" "}
            </Link>
            <Link
              href="/insurance"
              className="cursor-pointer underline-animation h-fit w-fit"
            >
              Insurances{" "}
            </Link>
            <Link
              href="/disease-prediction"
              className="cursor-pointer underline-animation h-fit w-fit"
            >
              Disease Prediction
            </Link>
            <Link
              href="/drug-alternative"
              className="cursor-pointer underline-animation h-fit w-fit"
            >
              Drug Alternative
            </Link>
            <Link
              href="/drug-response"
              className="cursor-pointer underline-animation h-fit w-fit"
            >
              Drug Response
            </Link>
          </ul>
        </div>

        <div>
          <h1 className=" font-montserrat mb-3">Multi-Diseases</h1>

          <ul className=" font-medium font-lato opacity-70 flex flex-col gap-y-1">
            <Link
              href="/predict-by-reports/liver"
              className="cursor-pointer underline-animation h-fit w-fit"
            >
              Liver
            </Link>

            <Link
              href="/predict-by-reports/kidney"
              className="cursor-pointer underline-animation h-fit w-fit"
            >
              Kidney
            </Link>
            <Link
              href="/predict-by-reports/heart"
              className="cursor-pointer underline-animation h-fit w-fit"
            >
              Heart{" "}
            </Link>
            <Link
              href="/predict-by-reports/diabetes"
              className="cursor-pointer underline-animation h-fit w-fit"
            >
              Diabetes{" "}
            </Link>
            <Link
              href="/predict-by-reports/breast-cancer"
              className="cursor-pointer underline-animation h-fit w-fit"
            >
              Breast Cancer
            </Link>
            <Link
              href="/predict-by-reports/parkinson"
              className="cursor-pointer underline-animation h-fit w-fit"
            >
              Parkinson's{" "}
            </Link>
          </ul>
        </div>

        <div>
          <h1 className=" font-montserrat mb-3">Resources</h1>

          <ul className=" font-medium font-lato opacity-70 flex flex-col gap-y-1">
            <li className="cursor-pointer underline-animation h-fit w-fit">
              Terms & Conditions
            </li>
            <li className="cursor-pointer underline-animation h-fit w-fit">
              Privacy Policy
            </li>
            <li className="cursor-pointer underline-animation h-fit w-fit">
              Copyright Policy{" "}
            </li>
            <li className="cursor-pointer underline-animation h-fit w-fit">
              Hyperlinking Policy{" "}
            </li>
            <li className="cursor-pointer underline-animation h-fit w-fit">
              Accessibility Statement{" "}
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col gap-3 max-w-[18rem]">
        <h1 className="font-montserrat text-lg font-semibold">Newsletter</h1>

        <p className="opacity-70 font-lato">
          Subscribe to stay updated with the latest news!
        </p>

        <div className="relative w-full">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 pl-4 pr-14 bg-blue-200 text-sm rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 placeholder:text-black placeholder:opacity-70 placeholder:font-lato"
          />
          <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-1.5 rounded-md text-sm hover:bg-blue-600 transition font-ubuntu">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
};

export default Footer;
