import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { GiHealthPotion, GiUpgrade } from "react-icons/gi";

const AboutSection = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center gap-20">
      <div className="flex flex-col items-center justify-center gap-12">
        <div className="flex flex-col max-w-xl  gap-5">
          <h1 className=" text-4xl font-montserrat">
            Our Mission in Healthcare Innovation
          </h1>

          <p className=" font-lato text-gray-800">
            Our platform harnesses the power of AI to enhance medical diagnosis,
            optimize treatment plans, and improve patient care. By integrating
            advanced analytics and automation, we make healthcare more
            efficient, accessible, and personalized for everyone.
          </p>

          <div
            onClick={() => router.push("/about")}
            className="bg-gradient-to-r from-[#3b82f6] to-[#174926] hover:to-[#166534]  px-4 py-2 rounded-3xl font-ubuntu font-medium text-lg text-white transition-transform duration-700 ease transform hover:scale-90 w-fit cursor-pointer"
          >
            Learn More
          </div>
        </div>
        <div className="flex items-center justify-between gap-12 max-w-xl">
          <div className="flex flex-col gap-5">
            <div className=" p-2 bg-blue-200 rounded-lg w-fit">
              <GiUpgrade className="w-12 h-12" />
            </div>
            <h1 className=" font-montserrat">
              Revolutionizing Healthcare with AI
            </h1>
            <p className=" font-lato text-gray-800">
              Our platform combines advanced AI with healthcare expertise to
              deliver accurate diagnoses, personalized treatments, and seamless
              patient management.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <div className=" p-2 bg-blue-200 rounded-lg w-fit">
              <GiHealthPotion className="w-12 h-12" />
            </div>
            <h1 className=" font-montserrat">
              Empowering Smarter & Safer Healthcare
            </h1>
            <p className=" font-lato text-gray-800">
              We leverage AI-driven insights to enhance medical decision-making,
              improve accessibility, and ensure accurate, secure, data-driven
              patient care.
            </p>
          </div>
        </div>
      </div>

      <div>
        <Image
          src="/doctor.jpg"
          alt="Chat App"
          width={420}
          height={630}
          className=""
        />
      </div>
    </div>
  );
};

export default AboutSection;
