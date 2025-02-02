import MyButton1 from "@/components/Buttons/MyButton1";
import Image from "next/image";

export default function Home() {
  return (
    <section className="relative my-24 flex flex-col items-center justify-center px-6 text-center">
      {/* Floating User Images */}
      <div className="absolute top-40 left-40 hidden lg:block">
        <div className="bg-orange-100 rounded-lg p-2">
          <Image
            src="/ed.jpg" // Replace with actual images
            alt="User 1"
            width={100}
            height={100}
            className="rounded-lg"
          />
        </div>
      </div>

      <div className="absolute top-40 right-10 hidden lg:block">
        <div className="bg-blue-100 rounded-lg p-2">
          <Image
            src="/pb.jpg"
            alt="User 2"
            width={100}
            height={100}
            className="rounded-lg"
          />
        </div>
      </div>

      <div className="absolute bottom-10 left-10 hidden lg:block">
        <div className="bg-yellow-100 rounded-lg p-2">
          <Image
            src="/ed.jpg"
            alt="User 3"
            width={100}
            height={100}
            className="rounded-lg"
          />
        </div>
      </div>

      <div className="absolute bottom-5 right-10 hidden lg:block">
        <div className="bg-purple-100 rounded-lg p-2">
          <Image
            src="/pb.jpg"
            alt="User 4"
            width={100}
            height={100}
            className="rounded-lg"
          />
        </div>
      </div>

      {/* Main Content */}
      <h1 className="text-6xl uppercase font-extrabold text-gray-900 font-montserrat">
        YOUR personalized
        <br /> healthmap - <span className=" text-blue-500"> upachara</span>
      </h1>
      <p className="text-gray-600 max-w-xl mt-4">
        HomeHero is your home manager who takes care of all the household tasks
        and admin that you don’t want to, leaving you time for things that
        really matter in life.
      </p>

      {/* Email Input & Button */}
      <div className="mt-6 flex flex-col sm:flex-row gap-2">
        <MyButton1
          classDesign={
            "bg-gradient-to-r from-[#193c70e9] to-[#1489386c] hover:to-[#174926]"
          }
          // buttonLink={content.jobLink}
          buttonName={"Join Our Team"}
        />
        <MyButton1
          classDesign={
            "bg-gradient-to-r from-[#193c70e9] to-[#1489386c] hover:to-[#174926]"
          }
          // buttonLink={content.jobLink}
          buttonName={"Join Our Team"}
        />
      </div>

      {/* Mobile Mockup */}
      <div className="mt-10">
        <Image
          src="/ed.jpg" // Replace with actual mobile UI screenshot
          alt="Chat App"
          width={300}
          height={500}
          className="rounded-lg shadow-lg"
        />
      </div>
    </section>
  );
}
