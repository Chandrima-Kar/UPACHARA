"use client";
import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { SlRefresh } from "react-icons/sl";
import api from "@/utils/api";
import { toast } from "react-toastify";

const generateCaptcha = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(
    { length: 6 },
    () => characters[Math.floor(Math.random() * characters.length)]
  ).join("");
};

const LoginPage = () => {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const [userType, setUserType] = useState("patient");

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (captchaInput !== captcha) {
      alert("Captcha verification failed. Please try again.");
      return;
    }

    const formData = {
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      const loginRoute = `/auth/${userType}/login`;
      const profileRoute = `/auth/${userType}/profile`;
      
      const response = await api.post(loginRoute, formData);
      console.log(response);
      
      const data = response.data;
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      
      const profileResponse = await api.get(profileRoute);
      console.log(profileResponse.data);
      localStorage.setItem("profile", JSON.stringify(profileResponse.data));

      toast.success("Login successful!");
    } catch (error) {
      toast.error("Login failed");
    }
  };

  return (
    <section className="flex flex-col my-10 gap-12 items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl text-center uppercase font-extrabold text-gray-900 font-montserrat">
          Login To Your
          <br /> <span className="text-blue-500">UPACHARA</span> Account
        </h1>
        <p className="text-gray-600 max-w-3xl text-center">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo
          impedit perspiciatis provident recusandae vero, aspernatur,
          repellendus nostrum sit tenetur sequi laudantium.
        </p>
      </div>

      <div className="w-full max-w-3xl bg-blue-50 shadow-xl rounded-lg p-6">
        <h3 className="text-lg font-medium font-mono text-gray-900 mb-10 text-center">
          -- Please Enter Your Login Credentials Here --
        </h3>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="userType"
                value="patient"
                checked={userType === "patient"}
                onChange={() => setUserType("patient")}
              />
              Patient
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="userType"
                value="doctor"
                checked={userType === "doctor"}
                onChange={() => setUserType("doctor")}
              />
              Doctor
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {["email", "password"].map((field, index) => (
              <div key={index} className="relative">
                <input
                  type={
                    field === "password" && !passwordVisible
                      ? "password"
                      : "text"
                  }
                  name={field.toLowerCase()}
                  placeholder={field.replace(/\b\w/g, (char) =>
                    char.toUpperCase()
                  )}
                  required
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans text-sm"
                />
                {/* Password Visibility Toggle */}
                {field === "password" && (
                  <button
                    type="button"
                    className="absolute right-3 top-[10px] text-blue-500 hover:text-blue-800"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                  >
                    {passwordVisible ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCaptcha(generateCaptcha())}
                className="text-blue-950 rounded-md hover:text-blue-500 transition"
              >
                <SlRefresh className="w-5 h-5" />
              </button>
              <span className="bg-blue-700 text-white font-medium font-mono px-4 py-1 rounded-md cursor-not-allowed">
                {captcha}
              </span>
            </div>
            <input
              type="text"
              placeholder="Enter Captcha"
              value={captchaInput}
              onChange={(e) => setCaptchaInput(e.target.value)}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans text-sm"
              required
            />
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="w-fit py-2 px-4 text-white bg-blue-500 rounded-md shadow-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 font-ubuntu focus:ring-blue-500 disabled:opacity-50 transition-all duration-500 transform hover:scale-110 uppercase"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
