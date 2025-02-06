import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MdBatchPrediction } from "react-icons/md";

const AboutSection = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center gap-20">
      <div className="flex flex-col items-center justify-center gap-12">
        <div className="flex flex-col max-w-xl  gap-5">
          <h1 className=" text-4xl font-montserrat">
            Ekhane About Us r name er type r ekta heading hobe "About Us" likhbi
            na
          </h1>

          <p className=" font-lato text-gray-800">
            description about us dibi ---- Lorem ipsum dolor sit amet
            consectetur, adipisicing elit. Ipsam facere, ducimus magni ut, animi
            sit sunt a consequatur distinctio culpa laborum, officia perferendis
            asperiores doloribus. Animi
          </p>

          <div
            onClick={() => router.push("/about")}
            className="bg-gradient-to-r from-[#3b82f6] to-[#174926] hover:to-[#166534]  px-4 py-2 rounded-3xl font-ubuntu font-medium text-lg text-white transition-transform duration-700 ease transform hover:scale-90 w-fit cursor-pointer"
          >
            Learn More
          </div>
        </div>
        <div className="flex items-center justify-between gap-16 max-w-xl">
          <div className="flex flex-col gap-5">
            <div className=" p-1 bg-gray-300 rounded-lg w-fit">
              <MdBatchPrediction className="w-12 h-12" />
            </div>
            <h1 className=" font-montserrat">Speciality about us 1</h1>
            <p className=" font-lato text-gray-800">
              Icon change korbi based on kon speciality mention korchis ---
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptatem non nemo
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <div className=" p-1 bg-gray-300 rounded-lg w-fit">
              <MdBatchPrediction className="w-12 h-12" />
            </div>
            <h1 className=" font-montserrat">Speciality about us 2</h1>
            <p className=" font-lato text-gray-800">
              Icon change korbi based on kon speciality mention korchis ---
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Voluptatem non nemo
            </p>
          </div>
        </div>
      </div>

      <div>
        <Image
          src="/heroMobile.png" // Replace with actual mobile UI screenshot
          alt="Chat App"
          width={420}
          height={630}
          className="rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default AboutSection;
