"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ImagePredictionCards = [
  {
    imageN: "/1.png",
    heading: "BRAIN",
    para: " Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rem eligendi velit dolorum neque vero ex! Incidunt.",
    link: "/predict-by-images/brain",
  },
  {
    imageN: "/1.png",
    heading: "CHEST",
    para: " Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rem eligendi velit dolorum neque vero ex! Incidunt.",
    link: "/predict-by-images/chest",
  },
  {
    imageN: "/1.png",
    heading: "SKIN",
    para: " Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rem eligendi velit dolorum neque vero ex! Incidunt.",
    link: "/predict-by-images/skin",
  },
  {
    imageN: "/1.png",
    heading: "MALARIA",
    para: " Lorem ipsum dolor sit, amet consectetur adipisicing elit. Rem eligendi velit dolorum neque vero ex! Incidunt.",
    link: "/predict-by-images/malaria",
  },
];
const PredictByImages = () => {
  const router = useRouter();

  return (
    <section className="flex flex-col my-16 gap-14 items-center justify-center ">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl text-center uppercase font-extrabold text-gray-900 font-montserrat">
          Predict Your Disease
          <br /> Using Images Like -{" "}
          <span className=" text-blue-500"> X-ray, MRI, etc.</span>
        </h1>
        <p className="text-gray-600 max-w-3xl text-center">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo
          impedit perspiciatis provident recusandae vero, aspernatur,
          repellendus nostrum sit tenetur sequi laudantium
        </p>
      </div>
      <div className="grid grid-cols-2 max-w-5xl gap-14 items-center justify-center">
        {ImagePredictionCards.map((content, ind) => (
          <div
            key={ind}
            onClick={() => router.push(`${content.link}`)}
            className="flex flex-col items-center justify-center gap-3 border border-blue-400 p-3 rounded-3xl shadow-xl shadow-blue-300 transition-all duration-500 transform hover:scale-105 cursor-pointer "
          >
            <Image
              src={content.imageN}
              alt={content.heading}
              width={300}
              height={200}
              className="rounded-2xl"
            />
            <h1 className=" font-mono text-lg">{content.heading} ➤</h1>
            <p className="font-lato text-gray-600 text-center">
              {content.para}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PredictByImages;
