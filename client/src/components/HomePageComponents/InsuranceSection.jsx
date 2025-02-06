import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MdArrowOutward } from "react-icons/md";

const InsuranceSection = () => {
  return (
    <div className="flex items-center justify-center gap-20">
      <div>
        <Image
          src="/heroMobile.png" // Replace with actual mobile UI screenshot
          alt="Chat App"
          width={420}
          height={630}
          className="rounded-lg shadow-lg"
        />
      </div>

      <div className="flex flex-col items-center justify-center gap-12">
        <div className="flex flex-col max-w-xl  gap-5">
          <h1 className=" text-4xl font-montserrat">The Perks</h1>

          <p className=" font-lato text-gray-800">
            description Our Insurance Policy r dibi ---- Lorem ipsum dolor sit
            amet consectetur, adipisicing elit. Ipsam facere, ducimus magni ut,
            animi sit sunt a consequatur distinctio culpa laborum, officia
            perferendis asperiores doloribus. Animi
          </p>

          {/* <Link
            href="/about"
            className="bg-gradient-to-r from-[#3b82f6] to-[#174926] hover:to-[#166534]  px-4 py-2 rounded-3xl font-ubuntu font-medium text-lg text-white transition-transform duration-700 ease transform hover:scale-90 w-fit"
          >
            Learn More
          </Link> */}
        </div>
        <div className="grid grid-cols-2 items-center justify-center gap-10 max-w-xl">
          <div className="flex flex-col gap-3">
            <h1 className=" px-3 py-1 bg-blue-300 rounded-lg font-mono font-bold w-fit text-sm italic">
              Premium
            </h1>
            <h1 className=" font-montserrat">Insurance Policy 1</h1>
            <p className="text-gray-800 font-lato">
              Insurance policy describe korbi --- Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Voluptatem non nemo
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h1 className=" px-3 py-1 bg-blue-300 rounded-lg font-mono font-bold w-fit text-sm italic">
              Freemium
            </h1>
            <h1 className=" font-montserrat">Insurance Policy 2</h1>
            <p className="text-gray-800 font-lato">
              Insurance policy describe korbi --- Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Voluptatem non sit amet consectetur
              adipisicing elit. Voluptatem non nemo
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-3">
            <Link
              href="/insurance"
              className=" flex items-center justify-center w-32 h-32 outline-dotted outline-3 -outline-offset-[7px] outline-white  bg-blue-500 text-white font-semibold rounded-full shadow-lg transition-all duration-500 transform hover:scale-110 hover:bg-blue-700 cursor-pointer"
            >
              <div className="flex flex-col items-center justify-center text-base leading-5 font-light font-ubuntu">
                <MdArrowOutward className=" w-12 h-12" />
                Know <br /> More
              </div>
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <h1 className=" px-3 py-1 bg-blue-300 rounded-lg font-mono font-bold w-fit text-sm italic">
              Free
            </h1>
            <h1 className=" font-montserrat">Insurance Policy 3</h1>
            <p className="text-gray-800 font-lato">
              Insurance policy describe korbi --- Lorem ipsum dolor sit amet
              consectetur adipisicing elit. Voluptatem non nemo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceSection;
