import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Hero = () => {
  const router = useRouter();

  return (
    <section className="relative  flex flex-col items-center justify-center px-6 text-center">
      <div className="absolute top-[15rem] -left-20 hidden lg:block perspective">
        <div className="bg-green-100 p-4 w-[220px] h-[250px] rounded-lg transform rotate-x-[15deg] -translate-y-4"></div>

        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center perspective">
          <Image
            src="/patient1.png"
            alt="User 1"
            width={200}
            height={200}
            className="rounded-lg rotate-3d-1 shadow-xl  shadow-green-100"
          />
        </div>
      </div>

      <div className="absolute top-[22rem] -right-16 hidden lg:block perspective">
        <div className="bg-yellow-100 p-4 w-[300px] h-[150px] rounded-lg transform rotate-x-[15deg] -translate-y-4"></div>

        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center perspective">
          <Image
            src="/patient2.png"
            alt="User 1"
            width={450}
            height={300}
            className="rounded-lg rotate-3d-2 shadow-xl  shadow-yellow-100"
          />
        </div>
      </div>

      <div className="absolute bottom-10 -left-16 hidden lg:block perspective">
        <div className="bg-red-100 p-4 w-[300px] h-[150px] rounded-lg transform rotate-x-[15deg] -translate-y-4"></div>

        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center perspective">
          <Image
            src="/patient3.png"
            alt="User 1"
            width={450}
            height={300}
            className="rounded-lg rotate-3d-1 shadow-xl  shadow-red-100"
          />
        </div>
      </div>

      <div className="absolute bottom-0 -right-20  hidden lg:block perspective">
        <div className="bg-purple-100 p-4 w-[220px] h-[250px] rounded-lg transform rotate-x-[15deg] -translate-y-4"></div>

        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center perspective">
          <Image
            src="/patient4.png"
            alt="User 1"
            width={300}
            height={450}
            className="rounded-lg rotate-3d-2 shadow-xl  shadow-purple-100"
          />
        </div>
      </div>

      {/* Main Content */}
      <h1 className="text-6xl uppercase font-extrabold text-gray-900 font-montserrat">
        YOUR personalized
        <br /> healthmap - <span className=" text-blue-500"> upachara</span>
      </h1>
      <p className="text-gray-600 max-w-xl mt-4">
        Your Health, Our Priority: Predict, Prevent, and Protect. AI-Powered
        Healthcare at Your Fingertips – Smarter Diagnoses, Personalized Care,
        and Seamless Access to Medical Solutions Anytime, Anywhere.
      </p>

      {/* Email Input & Button */}
      <div className="mt-6 flex  gap-10">
        <div
          onClick={() => router.push("/disease-prediction")}
          className="bg-gradient-to-r from-[#3b82f6] to-[#174926] hover:to-[#166534]  px-8 py-4 rounded-full font-ubuntu font-medium text-lg text-white transition-transform duration-700 ease transform hover:scale-110 cursor-pointer">
          {" "}
          👩‍⚕️ Check Your Health
        </div>

        <Link
          href="https://youtu.be/9DXZKdeETJw"
          target="blank"
          className="bg-gradient-to-r from-[#bfdbfe] to-[#eff6ff] hover:to-[#bbf7d0] border border-[#000000] px-8 py-4 rounded-full font-ubuntu font-medium text-lg text-black transition-transform duration-700 ease transform hover:scale-110">
          {" "}
          🎬 Watch Our Story
        </Link>
      </div>

      {/* Mobile Mockup */}
      <div className="mt-10 text-green-200">
        <Image
          src="/heroMobile.png"
          alt="Chat App"
          width={420}
          height={630}
          className=""
        />
      </div>
    </section>
  );
};

export default Hero;
