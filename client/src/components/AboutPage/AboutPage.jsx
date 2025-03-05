"use client";
import { useRef, useEffect } from "react";
import Image from "next/image";
import {
  GiUpgrade,
  GiHeartPlus,
  GiMedicalPack,
  GiMedicines,
} from "react-icons/gi";
import { motion, useAnimation, useInView } from "framer-motion";

const AboutPage = () => {
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);
  const section4Ref = useRef(null);
  const section5Ref = useRef(null);

  const section1InView = useInView(section1Ref, { once: true, amount: 0.3 });
  const section2InView = useInView(section2Ref, { once: true, amount: 0.3 });
  const section3InView = useInView(section3Ref, { once: true, amount: 0.3 });
  const section4InView = useInView(section4Ref, { once: true, amount: 0.3 });
  const section5InView = useInView(section5Ref, { once: true, amount: 0.3 });

  const section1Controls = useAnimation();
  const section2Controls = useAnimation();
  const section3Controls = useAnimation();
  const section4Controls = useAnimation();
  const section5Controls = useAnimation();

  useEffect(() => {
    if (section1InView) section1Controls.start("visible");
    if (section2InView) section2Controls.start("visible");
    if (section3InView) section3Controls.start("visible");
    if (section4InView) section4Controls.start("visible");
    if (section5InView) section5Controls.start("visible");
  }, [
    section1InView,
    section1Controls,
    section2InView,
    section2Controls,
    section3InView,
    section3Controls,
    section4InView,
    section4Controls,
    section5InView,
    section5Controls,
  ]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white overflow-hidden">
      {/* Vision Section */}
      <motion.section
        ref={section1Ref}
        variants={containerVariants}
        initial="hidden"
        animate={section1Controls}
        className="py-20 px-6"
      >
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">
          <motion.div
            variants={containerVariants}
            className="flex flex-col gap-4 lg:w-1/3"
          >
            <motion.div variants={imageVariants} className="relative group">
              <div className="absolute -inset-2 bg-blue-200 rounded-2xl transform rotate-3 group-hover:rotate-1 transition-transform duration-300"></div>
              <Image
                src="/patient1.png"
                alt="Patient"
                width={300}
                height={200}
                className="rounded-2xl relative z-10 shadow-lg"
              />
            </motion.div>
            <motion.div
              variants={imageVariants}
              className="relative group mt-2"
            >
              <div className="absolute -inset-2 bg-blue-200 rounded-2xl transform -rotate-2 group-hover:rotate-0 transition-transform duration-300"></div>
              <Image
                src="/patient2.png"
                alt="Patient"
                width={300}
                height={160}
                className="rounded-2xl h-[160px] object-cover relative z-10 shadow-lg"
              />
            </motion.div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="flex flex-col items-center lg:items-start gap-8 lg:w-2/3"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl text-center lg:text-left uppercase font-extrabold font-montserrat relative"
            >
              Where We are Going?{" "}
              <span className="text-blue-500 relative">
                Our Vision
                <span className="absolute -bottom-2 left-0 w-full h-2 bg-blue-200 rounded-full"></span>
              </span>
            </motion.h1>

            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              <motion.div
                variants={containerVariants}
                className="flex flex-col gap-4 lg:w-1/2"
              >
                <motion.div variants={imageVariants} className="relative group">
                  <div className="absolute -inset-2 bg-green-100 rounded-2xl transform rotate-2 group-hover:rotate-0 transition-transform duration-300"></div>
                  <Image
                    src="https://images.pexels.com/photos/6129507/pexels-photo-6129507.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="Team Member"
                    width={300}
                    height={200}
                    className="rounded-2xl relative z-10 shadow-lg"
                  />
                </motion.div>
                <motion.div variants={imageVariants} className="relative group">
                  <div className="absolute -inset-2 bg-green-100 rounded-2xl transform -rotate-1 group-hover:rotate-1 transition-transform duration-300"></div>
                  <Image
                    src="https://images.pexels.com/photos/8376277/pexels-photo-8376277.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="Team Member"
                    width={300}
                    height={227}
                    className="rounded-2xl h-[227px] object-cover relative z-10 shadow-lg"
                  />
                </motion.div>
              </motion.div>

              <motion.div
                variants={containerVariants}
                className="flex flex-col gap-6 lg:w-1/2"
              >
                <motion.p
                  variants={itemVariants}
                  className="text-gray-700 font-lato text-lg leading-relaxed"
                >
                  We envision a world where access to healthcare information is
                  not just a luxury but a fundamental right. Our journey began
                  with a simple yet powerful idea: to empower individuals with
                  the knowledge and tools they need to take control of their
                  health.
                </motion.p>

                <motion.div
                  variants={itemVariants}
                  className="flex flex-col gap-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="p-3 bg-blue-200 rounded-lg w-fit shadow-md"
                  >
                    <GiUpgrade className="w-9 h-9 text-blue-700" />
                  </motion.div>
                  <h2 className="font-montserrat text-xl font-bold">
                    Revolutionizing Healthcare with AI
                  </h2>
                  <p className="text-gray-700 font-lato">
                    Our platform combines advanced AI with healthcare expertise
                    to deliver accurate diagnoses, personalized treatments, and
                    seamless patient management.
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Our Priority Section */}
      <motion.section
        ref={section2Ref}
        variants={containerVariants}
        initial="hidden"
        animate={section2Controls}
        className="py-20 px-6 bg-gradient-to-r from-blue-50 to-white"
      >
        <div className="container mx-auto">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-16">
            <motion.div
              variants={containerVariants}
              className="flex flex-col gap-6 lg:w-1/2"
            >
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05, rotate: -5 }}
                className="p-3 bg-blue-200 rounded-lg w-fit shadow-md"
              >
                <GiHeartPlus className="w-9 h-9 text-blue-700" />
              </motion.div>
              <motion.h2
                variants={itemVariants}
                className="font-montserrat text-2xl md:text-3xl font-bold"
              >
                Your Well-being, Our Priority
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="max-w-md font-lato text-lg text-gray-700 leading-relaxed"
              >
                Your health is our top priority. We understand that navigating
                the complexities of healthcare can be daunting. That's why we've
                gone the extra mile to provide not only accurate predictions but
                also comprehensive information about each disease. You'll find
                descriptions, recommended precautions, medications, dietary
                advice, and workout tips to support your journey to better
                health.
              </motion.p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="flex flex-col items-end gap-6 lg:w-1/2"
            >
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="p-3 bg-blue-200 rounded-lg w-fit shadow-md"
              >
                <GiMedicalPack className="w-9 h-9 text-blue-700" />
              </motion.div>
              <motion.h2
                variants={itemVariants}
                className="font-montserrat text-2xl md:text-3xl font-bold text-right"
              >
                Join Us on this Journey
              </motion.h2>
              <motion.p
                variants={itemVariants}
                className="text-right max-w-md font-lato text-lg text-gray-700 leading-relaxed"
              >
                We invite you to explore our platform, engage with our
                educational content, and take control of your health journey.
                Together, we can revolutionize the way individuals access and
                understand healthcare information. Our commitment is to provide
                you with the tools and knowledge to make informed decisions
                about your health.
              </motion.p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Team Section */}
      <motion.section
        ref={section3Ref}
        variants={containerVariants}
        initial="hidden"
        animate={section3Controls}
        className="py-20 px-6 bg-gradient-to-l from-blue-50 to-white"
      >
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">
          <motion.div
            variants={containerVariants}
            className="flex flex-col items-center lg:items-start gap-8 lg:w-2/3"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl text-center lg:text-left uppercase font-extrabold font-montserrat relative"
            >
              The Faces of Innovation{" "}
              <span className="text-blue-500 uppercase relative">
                Upachara
                <span className="absolute -bottom-2 left-0 w-full h-2 bg-blue-200 rounded-full"></span>
              </span>
            </motion.h1>

            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              <motion.div
                variants={containerVariants}
                className="flex flex-col gap-6 lg:w-1/2"
              >
                <motion.p
                  variants={itemVariants}
                  className="text-gray-700 font-lato text-lg leading-relaxed"
                >
                  We are a passionate team of healthcare professionals, data
                  scientists, and technology enthusiasts who share a common
                  goal: to make healthcare accessible, understandable, and
                  personalized for you. With years of experience in both
                  healthcare and cutting-edge technology, we've come together to
                  create this platform as a testament to our commitment to your
                  well-being.
                </motion.p>

                <motion.div
                  variants={itemVariants}
                  className="flex flex-col gap-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="p-3 bg-blue-200 rounded-lg w-fit shadow-md"
                  >
                    <GiMedicines className="w-9 h-9 text-blue-700" />
                  </motion.div>
                  <h2 className="font-montserrat text-xl font-bold">
                    Expertise Meets Compassion
                  </h2>
                  <p className="text-gray-700 font-lato">
                    Our team combines deep medical knowledge with technical
                    expertise to create solutions that are not only accurate but
                    also accessible and user-friendly for everyone.
                  </p>
                </motion.div>
              </motion.div>

              <motion.div
                variants={containerVariants}
                className="flex flex-col gap-4 lg:w-1/2"
              >
                <motion.div variants={imageVariants} className="relative group">
                  <div className="absolute -inset-2 bg-purple-100 rounded-2xl transform rotate-2 group-hover:rotate-0 transition-transform duration-300"></div>
                  <Image
                    src="https://images.pexels.com/photos/19260195/pexels-photo-19260195/free-photo-of-surgeons-in-operating-room.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="Team Member"
                    width={300}
                    height={200}
                    className="rounded-2xl relative z-10 shadow-lg"
                  />
                </motion.div>
                <motion.div variants={imageVariants} className="relative group">
                  <div className="absolute -inset-2 bg-purple-100 rounded-2xl transform -rotate-1 group-hover:rotate-1 transition-transform duration-300"></div>
                  <Image
                    src="https://images.pexels.com/photos/5327584/pexels-photo-5327584.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="Team Member"
                    width={300}
                    height={227}
                    className="rounded-2xl h-[227px] object-cover relative z-10 shadow-lg"
                  />
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="flex flex-col gap-4 lg:w-1/3"
          >
            <motion.div variants={imageVariants} className="relative group">
              <div className="absolute -inset-2 bg-blue-200 rounded-2xl transform rotate-3 group-hover:rotate-1 transition-transform duration-300"></div>
              <Image
                src="/patient3.png"
                alt="Patient"
                width={300}
                height={200}
                className="rounded-2xl relative z-10 shadow-lg"
              />
            </motion.div>
            <motion.div
              variants={imageVariants}
              className="relative group mt-2"
            >
              <div className="absolute -inset-2 bg-blue-200 rounded-2xl transform -rotate-2 group-hover:rotate-0 transition-transform duration-300"></div>
              <Image
                src="/patient4.png"
                alt="Patient"
                width={300}
                height={160}
                className="rounded-2xl h-[160px] object-cover relative z-10 shadow-lg"
              />
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Mission Statement Section */}
      <motion.section
        ref={section4Ref}
        variants={containerVariants}
        initial="hidden"
        animate={section4Controls}
        className="py-20 px-6 bg-gradient-to-b from-blue-50 to-white"
      >
        <div className="container mx-auto flex flex-col items-center gap-12">
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl font-bold font-montserrat text-center relative inline-block"
          >
            Defining Our Purpose: A Statement of Our Mission
            <span className="absolute -bottom-2 left-1/4 w-1/2 h-2 bg-blue-200 rounded-full"></span>
          </motion.h1>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
            <motion.div
              variants={imageVariants}
              whileHover={{ scale: 1.05, rotate: 3 }}
              className="relative lg:w-1/3"
            >
              <div className="absolute -inset-4 bg-gradient-to-br from-blue-200 to-green-100 rounded-2xl transform rotate-3"></div>
              <Image
                src="https://images.pexels.com/photos/5452221/pexels-photo-5452221.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Mission"
                width={400}
                height={400}
                className="rounded-2xl relative z-10 shadow-xl"
              />
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="max-w-md text-xl font-lato text-gray-700 leading-relaxed lg:w-2/3"
            >
              At Upachara, our mission is to provide you with a seamless and
              intuitive platform that leverages the power of artificial
              intelligence and machine learning. We want to assist you in
              identifying potential health concerns based on your reported
              symptoms, all while offering a wealth of educational resources to
              enhance your health literacy. We believe that informed patients
              make better decisions, and our goal is to empower you with the
              knowledge you need to take control of your health journey.
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Client Success Section */}
      <motion.section
        ref={section5Ref}
        variants={containerVariants}
        initial="hidden"
        animate={section5Controls}
        className="py-20 px-6 bg-gradient-to-t from-blue-50 to-white"
      >
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16">
          <motion.div
            variants={containerVariants}
            className="flex flex-col gap-4 lg:w-1/3"
          >
            <motion.div variants={imageVariants} className="relative group">
              <div className="absolute -inset-2 bg-yellow-100 rounded-2xl transform rotate-3 group-hover:rotate-1 transition-transform duration-300"></div>
              <Image
                src="/patient1.png"
                alt="Patient"
                width={300}
                height={200}
                className="rounded-2xl relative z-10 shadow-lg"
              />
            </motion.div>
            <motion.div
              variants={imageVariants}
              className="relative group mt-2"
            >
              <div className="absolute -inset-2 bg-yellow-100 rounded-2xl transform -rotate-2 group-hover:rotate-0 transition-transform duration-300"></div>
              <Image
                src="/patient2.png"
                alt="Patient"
                width={300}
                height={160}
                className="rounded-2xl h-[160px] object-cover relative z-10 shadow-lg"
              />
            </motion.div>
          </motion.div>

          <motion.div
            variants={containerVariants}
            className="flex flex-col items-center lg:items-start gap-8 lg:w-2/3"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl text-center lg:text-left uppercase font-extrabold font-montserrat relative"
            >
              How We Ensure{" "}
              <span className="text-blue-500 relative">
                Client
                <span className="absolute -bottom-2 left-0 w-full h-2 bg-blue-200 rounded-full"></span>
              </span>{" "}
              Success
            </motion.h1>

            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              <motion.div
                variants={containerVariants}
                className="flex flex-col gap-4 lg:w-1/2"
              >
                <motion.div variants={imageVariants} className="relative group">
                  <div className="absolute -inset-2 bg-red-100 rounded-2xl transform rotate-2 group-hover:rotate-0 transition-transform duration-300"></div>
                  <Image
                    src="https://images.pexels.com/photos/5327868/pexels-photo-5327868.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="Client Success"
                    width={300}
                    height={200}
                    className="rounded-2xl relative z-10 shadow-lg"
                  />
                </motion.div>
                <motion.div variants={imageVariants} className="relative group">
                  <div className="absolute -inset-2 bg-red-100 rounded-2xl transform -rotate-1 group-hover:rotate-1 transition-transform duration-300"></div>
                  <Image
                    src="https://images.pexels.com/photos/5214998/pexels-photo-5214998.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="Client Success"
                    width={300}
                    height={227}
                    className="rounded-2xl h-[227px] object-cover relative z-10 shadow-lg"
                  />
                </motion.div>
              </motion.div>

              <motion.div
                variants={containerVariants}
                className="flex flex-col gap-6 lg:w-1/2"
              >
                <motion.p
                  variants={itemVariants}
                  className="text-gray-700 font-lato text-lg leading-relaxed"
                >
                  Our commitment to your success goes beyond just providing a
                  platform. We continuously refine our algorithms based on the
                  latest medical research, ensuring that you receive the most
                  accurate and up-to-date information possible. We also
                  prioritize user feedback, making regular improvements to
                  enhance your experience.
                </motion.p>

                <motion.div
                  variants={itemVariants}
                  className="flex flex-col gap-4"
                >
                  <motion.div
                    whileHover={{ scale: 1.05, rotate: 5 }}
                    className="p-3 bg-blue-200 rounded-lg w-fit shadow-md"
                  >
                    <GiUpgrade className="w-9 h-9 text-blue-700" />
                  </motion.div>
                  <h2 className="font-montserrat text-xl font-bold">
                    Continuous Improvement
                  </h2>
                  <p className="text-gray-700 font-lato">
                    We're constantly evolving our platform based on user
                    feedback and the latest advancements in healthcare
                    technology to ensure you always have access to the best
                    tools and information.
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default AboutPage;
