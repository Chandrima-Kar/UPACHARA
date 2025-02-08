import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { MdArrowOutward } from "react-icons/md";

const InsuranceSection = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center gap-20">
      <div>
        <Image
          src="/insurance.png" // Replace with actual mobile UI screenshot
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
            Our AI-powered insurance advisor analyzes your medical history, age,
            and location to recommend the best healthcare insurance plans. It
            ensures you get the right coverage tailored to your needs, providing
            financial security and peace of mind.
          </p>
        </div>
        <div className="grid grid-cols-2 items-center justify-center gap-10 max-w-xl">
          <div className="flex flex-col gap-3">
            <h1 className=" px-3 py-1 bg-blue-300 rounded-lg font-mono font-bold w-fit text-sm italic">
              Premium
            </h1>
            <h1 className=" font-montserrat"> Comprehensive Health Coverage</h1>
            <p className="text-gray-800 font-lato">
              Get extensive medical coverage, including hospitalization,
              pre-existing conditions, and preventive care.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h1 className=" px-3 py-1 bg-blue-300 rounded-lg font-mono font-bold w-fit text-sm italic">
              Freemium
            </h1>
            <h1 className=" font-montserrat">Affordable Family Insurance</h1>
            <p className="text-gray-800 font-lato">
              Protect your entire family with a single plan that covers medical
              emergencies, consultations, and routine check-ups.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-3">
            <div
              onClick={() => router.push("/insurance")}
              className=" flex items-center justify-center w-32 h-32 outline-dotted outline-3 -outline-offset-[7px] outline-white  bg-blue-500 text-white font-semibold rounded-full shadow-lg transition-all duration-500 transform hover:scale-110 hover:bg-blue-700 cursor-pointer"
            >
              <div className="flex flex-col items-center justify-center text-base leading-5 font-light font-ubuntu">
                <MdArrowOutward className=" w-12 h-12" />
                Know <br /> More
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h1 className=" px-3 py-1 bg-blue-300 rounded-lg font-mono font-bold w-fit text-sm italic">
              Free
            </h1>
            <h1 className=" font-montserrat">Customizable Plans </h1>
            <p className="text-gray-800 font-lato">
              Choose insurance that fits your needs, with flexible premiums,
              add-on benefits, and cashless claim options.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceSection;
