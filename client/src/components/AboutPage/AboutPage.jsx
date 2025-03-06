import Image from "next/image";
import { GiUpgrade } from "react-icons/gi";

const AboutPage = () => {
  return (
    <div className="flex flex-col my-4 mb-12 p-16 shadow-lg gap-20 items-center justify-center bg-blue-100">
      <div className="flex items-start gap-7">
        <div className="flex flex-col gap-2">
          <Image
            src="/patient1.png"
            alt="00"
            width={300}
            height={200}
            className="rounded-t-2xl"
          />
          <Image
            src="/patient3.png"
            alt="00"
            width={300}
            height={200}
            className="rounded-b-2xl h-[240px]"
          />
        </div>

        <div className="flex flex-col items-center justify-center gap-7">
          <h1 className="text-4xl text-center uppercase font-extrabold text-gray-900 font-montserrat">
            Where We are Going?{" "}
            <span className="text-blue-500">Our Vision</span>
          </h1>
          <div className="flex items-center justify-center gap-20">
            <div className=" flex flex-col items-center justify-center gap-4">
              <Image
                src="/doctor.jpg"
                alt="00"
                width={300}
                height={200}
                className="rounded-2xl"
              />
              <Image
                src="/patient2.png"
                alt="00"
                width={300}
                height={200}
                className="rounded-2xl h-[227px]"
              />
            </div>

            <div className="flex font-lato flex-col gap-5 max-w-xs">
              <p className="text-gray-600  ">
                We envision a world where access to healthcare information is
                not just a luxury but a fundamental right. Our journey began
                with a simple yet powerful idea: to empower individuals with the
                knowledge and tools they need to take control of their health
              </p>
              <div className="flex flex-col gap-5">
                <div className=" p-2 bg-blue-200 rounded-lg w-fit">
                  <GiUpgrade className="w-9 h-9" />
                </div>
                <h1 className=" font-montserrat">
                  Revolutionizing Healthcare with AI
                </h1>
                <p className="  text-gray-800">
                  Our platform combines advanced AI with healthcare expertise to
                  deliver accurate diagnoses, personalized treatments, and
                  seamless patient management.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="items-center justify-center">
        <div className="flex items-start justify-between space-x-56 w-full">
          <div className="flex flex-col gap-5">
            <div className=" p-2 bg-blue-200 rounded-lg w-fit">
              <GiUpgrade className="w-9 h-9" />
            </div>
            <h1 className=" font-montserrat text-2xl">
              Your Well-being, Our Priority
            </h1>
            <p className=" max-w-md  font-lato text-gray-800">
              Your health is our top priority. We understand that navigating the
              complexities of healthcare can be daunting. That's why we've gone
              the extra mile to provide not only accurate predictions but also
              comprehensive information about each disease. You'll find
              descriptions, recommended precautions, medications, dietary
              advice, and workout tips to support your journey to better health.
            </p>
          </div>
          <div className="flex items-end flex-col gap-5">
            <div className=" p-2 bg-blue-200 rounded-lg w-fit">
              <GiUpgrade className="w-9 h-9" />
            </div>
            <h1 className=" font-montserrat text-2xl">
              Join Us on this Journey
            </h1>
            <p className=" text-right max-w-sm font-lato  text-gray-800">
              We invite you to explore our platform, engage with our educational
              content, and take control of your health journey. Together, we can
              revolutionize the way individuals access and understand healthcare
              information. Lorem ipsum, dolor sit amet consectetur adipisicing
              elit. Sapiente expedita
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-7">
        <div className="flex flex-col items-center justify-center gap-7">
          <h1 className="text-4xl text-center uppercase font-extrabold text-gray-900 font-montserrat">
            The Faces of Innovation{" "}
            <span className="text-blue-500 uppercase">Upachara</span>
          </h1>
          <div className="flex items-center justify-center gap-32">
            <div className="flex font-lato flex-col gap-5 max-w-xs">
              <p className="text-gray-600  ">
                We are a passionate team of healthcare professionals, data
                scientists, and technology enthusiasts who share a common goal:
                to make healthcare accessible, understandable, and personalized
                for you. With years of experience in both healthcare and
                cutting-edge technology, we've come together to create this
                platform as a testament to our commitment to your well-being.
              </p>
              <div className="flex flex-col gap-5">
                <div className=" p-2 bg-blue-200 rounded-lg w-fit">
                  <GiUpgrade className="w-9 h-9" />
                </div>
                <h1 className=" font-montserrat">
                  Revolutionizing Healthcare with AI
                </h1>
                <p className="  text-gray-800">
                  Our platform combines advanced AI with healthcare expertise to
                  deliver accurate diagnoses, personalized treatments, and
                  seamless patient management.
                </p>
              </div>
            </div>

            <div className=" flex flex-col items-center justify-center gap-4">
              <Image
                src="/patient1.png"
                alt="00"
                width={300}
                height={200}
                className="rounded-2xl"
              />
              <Image
                src="/patient2.png"
                alt="00"
                width={300}
                height={200}
                className="rounded-2xl h-[227px]"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Image
            src="/doctor.jpg"
            alt="00"
            width={300}
            height={200}
            className="rounded-t-2xl"
          />
          <Image
            src="/doctor3.jpg"
            alt="00"
            width={300}
            height={200}
            className="rounded-b-2xl h-[240px]"
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-10">
        <h1 className=" font-montserrat text-4xl">
          Defining Our Purpose: A Statement of Our Mission
        </h1>
        <div className="flex items-center justify-center gap-20">
          <Image
            src="/mission.png"
            alt="mission"
            width={450}
            height={400}
            className="rounded-2xl"
          />
          <p className=" max-w-md  text-lg font-lato text-gray-800">
            At this website, our mission is to provide you with a seamless and
            intuitive platform that leverages the power of artificial
            intelligence and machine learning. We want to assist you in
            identifying potential health concerns based on your reported
            symptoms, all while offering a wealth of educational resources to
            enhance your health literacy.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-7">
        <div className="flex flex-col gap-2">
          <Image
            src="/patient6.png"
            alt="00"
            width={300}
            height={200}
            className="rounded-t-2xl"
          />
          <Image
            src="/doctor6.jpg"
            alt="00"
            width={300}
            height={200}
            className="rounded-b-2xl h-[240px]"
          />
        </div>

        <div className="flex flex-col items-center justify-center gap-7">
          <h1 className="text-4xl text-center uppercase font-extrabold text-gray-900 font-montserrat">
            How We Ensure <span className="text-blue-500">Client</span> Success
          </h1>
          <div className="flex items-center justify-center gap-20">
            <div className=" flex flex-col items-center justify-center gap-4">
              <Image
                src="/patient5.png"
                alt="00"
                width={300}
                height={200}
                className="rounded-2xl"
              />
              <Image
                src="/patient4.png"
                alt="00"
                width={300}
                height={200}
                className="rounded-2xl h-[320px]"
              />
            </div>

            <div className="flex font-lato flex-col gap-5 max-w-xs">
              <p className="text-gray-600  ">
                We envision a world where access to healthcare information is
                not just a luxury but a fundamental right. Our journey began
                with a simple yet powerful idea: to empower individuals with the
                knowledge and tools they need to take control of their health
              </p>
              <div className="flex flex-col gap-5">
                <div className=" p-2 bg-blue-200 rounded-lg w-fit">
                  <GiUpgrade className="w-9 h-9" />
                </div>
                <h1 className=" font-montserrat">
                  Revolutionizing Healthcare with AI
                </h1>
                <p className="  text-gray-800">
                  Our platform combines advanced AI with healthcare expertise to
                  deliver accurate diagnoses, personalized treatments, and
                  seamless patient management.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
