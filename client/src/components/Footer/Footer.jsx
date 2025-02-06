import React from "react";
import Image from "next/image";
import {
  FaSquareXTwitter,
  FaLinkedin,
  FaYoutube,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa6";

const Footer = () => {
  return (
    <div className="bg-blue-500 w-full p-5 flex  items-center justify-evenly">
      <div className="flex flex-col items-center justify-center gap-3">
        <Image
          src="/ed.jpg"
          alt="User 1"
          width={200}
          height={200}
          className="rounded-lg w-20 h-20 "
        />
        <div className="flex items-center justify-center gap-3">
          <FaFacebook />
          <FaInstagram />
          <FaLinkedin />
          <FaSquareXTwitter />
          <FaYoutube />
        </div>
        <h1>All rights reserved</h1>
      </div>
      <div className="flex items-center justify-center gap-x-10">
        <div>
          <h1>Quick Links</h1>

          <ul className=" font-semibold flex flex-col gap-y-2">
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
        <div>Resources</div>
      </div>
      <div>Newsletter subs</div>
    </div>
  );
};

export default Footer;
