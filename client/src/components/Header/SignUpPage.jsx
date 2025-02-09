"use client";
import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaCalendarAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { SlRefresh } from "react-icons/sl";

const generateCaptcha = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(
    { length: 6 },
    () => characters[Math.floor(Math.random() * characters.length)]
  ).join("");
};

const countryCodes = ["+91", "+1", "+44", "+61", "+81", "+33", "+49"];

const SignUpPage = () => {
  const router = useRouter();
  const [userType, setUserType] = useState("patient");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emergencyPhoneNumber, setEmergencyPhoneNumber] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91");
  const [selectedEmergencyCountryCode, setSelectedEmergencyCountryCode] =
    useState("+91");
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");

  // Refresh captcha on page reload
  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (captchaInput !== captcha) {
      alert("Captcha verification failed. Please try again.");
      return;
    }
    alert("Login successful!");
    router.push("/login"); // Redirect after login (change the path as needed)
  };

  return (
    <section className="flex flex-col my-10 gap-12 items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl text-center uppercase font-extrabold text-gray-900 font-montserrat">
          Welcome To Your <br />
          Personalized <span className="text-blue-500">UPACHARA</span> Healthmap
        </h1>
        <p className="text-gray-600 max-w-3xl text-center">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo
          impedit perspiciatis provident recusandae vero, aspernatur,
          repellendus nostrum sit tenetur sequi laudantium.
        </p>
      </div>

      <div className="w-full max-w-3xl flex flex-col gap-7 bg-blue-50 shadow-xl rounded-lg p-6">
        <h3 className="text-lg font-medium font-mono text-gray-900  text-center">
          -- Sign Up As A --
        </h3>

        <div className="flex justify-center gap-6">
          {["patient", "doctor"].map((type) => (
            <label
              key={type}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="userType"
                value={type}
                checked={userType === type}
                onChange={() => setUserType(type)}
                className="w-4 h-4  text-blue-500 focus:ring-blue-700 border-gray-300"
              />
              <span className="text-gray-700 capitalize font-montserrat">
                {type}
              </span>
            </label>
          ))}
        </div>

        {userType === "patient" ? (
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {[
                "email",
                "password",
                "first_name",
                "middle_name",
                "last_name",
                "blood_group",
                "age",
                "date_of_birth",
                "phone_number",
                "address",
                "emergency_contact_person",
                "emergency_phone_number",
              ].map((field, index) => (
                <div key={index} className="relative">
                  {/* Handling Different Input Types */}
                  {field === "date_of_birth" ? (
                    // Date of Birth Input with Calendar Icon
                    <div className="relative">
                      <input
                        type="date"
                        name={field}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        placeholder="Select Date of Birth"
                        required
                        className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans text-sm"
                      />
                      <FaCalendarAlt className="absolute right-3 top-3 text-gray-500 cursor-pointer" />
                    </div>
                  ) : field === "phone_number" ||
                    field === "emergency_phone_number" ? (
                    // Phone Number Input with Country Code Dropdown
                    <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
                      <select
                        className="border-r px-2 py-2 bg-gray-100 text-gray-700 rounded-l-md focus:outline-none"
                        value={
                          field === "phone_number"
                            ? selectedCountryCode
                            : selectedEmergencyCountryCode
                        }
                        onChange={(e) =>
                          field === "phone_number"
                            ? setSelectedCountryCode(e.target.value)
                            : setSelectedEmergencyCountryCode(e.target.value)
                        }
                      >
                        {countryCodes.map((code, i) => (
                          <option key={i} value={code}>
                            {code}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        name={field}
                        value={
                          field === "phone_number"
                            ? phoneNumber
                            : emergencyPhoneNumber
                        }
                        onChange={(e) =>
                          field === "phone_number"
                            ? setPhoneNumber(e.target.value)
                            : setEmergencyPhoneNumber(e.target.value)
                        }
                        placeholder={field
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (char) => char.toUpperCase())}
                        required
                        className="w-full py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans text-sm"
                      />
                    </div>
                  ) : (
                    // Default Inputs (Text, Password, Number)
                    <input
                      type={
                        field === "password"
                          ? passwordVisible
                            ? "text"
                            : "password"
                          : field === "age"
                          ? "number"
                          : "text"
                      }
                      name={field}
                      placeholder={field
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (char) => char.toUpperCase())}
                      required={field === "middle_name" ? false : true}
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans text-sm"
                    />
                  )}

                  {/* Password Visibility Toggle */}
                  {field === "password" && (
                    <button
                      type="button"
                      className="absolute right-3 top-[10px] text-blue-500 hover:text-blue-800"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                    >
                      {passwordVisible ? (
                        <FaEyeSlash size={18} />
                      ) : (
                        <FaEye size={18} />
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Captcha Section */}
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setCaptcha("X9Y8Z7")} // Example: Generate new Captcha
                className="text-blue-950 rounded-md hover:text-blue-500 transition"
              >
                <SlRefresh className="w-5 h-5" />
              </button>
              <span
                onContextMenu={(e) => e.preventDefault()}
                className="bg-blue-700 text-white font-medium font-mono px-4 py-1 rounded-md cursor-not-allowed"
              >
                {captcha}
              </span>
              <input
                type="text"
                placeholder="Enter Captcha"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans text-sm"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="w-fit py-2 px-4 text-white bg-blue-500 rounded-md shadow-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 font-ubuntu focus:ring-blue-500 disabled:opacity-50 transition-all duration-500 transform hover:scale-110 uppercase"
              >
                Sign Up
              </button>
            </div>
          </form>
        ) : (
          // Doctor Form
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {[
                "email",
                "password",
                "first_name",
                "middle_name",
                "last_name",
                "specialization",
                "license_number",
                "experience_years",
                "phone_number",
                "address",
              ].map((field, index) => (
                <div key={index} className="relative">
                  {/* Handling Different Input Types */}
                  {field === "phone_number" ? (
                    <div className="flex items-center border border-gray-300 rounded-md shadow-sm">
                      <select
                        className="border-r px-2 py-2 bg-gray-100 text-gray-700 rounded-l-md focus:outline-none"
                        value={
                          field === "phone_number"
                            ? selectedCountryCode
                            : selectedEmergencyCountryCode
                        }
                        onChange={(e) =>
                          field === "phone_number"
                            ? setSelectedCountryCode(e.target.value)
                            : setSelectedEmergencyCountryCode(e.target.value)
                        }
                      >
                        {countryCodes.map((code, i) => (
                          <option key={i} value={code}>
                            {code}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        name={field}
                        value={
                          field === "phone_number"
                            ? phoneNumber
                            : emergencyPhoneNumber
                        }
                        onChange={(e) =>
                          field === "phone_number"
                            ? setPhoneNumber(e.target.value)
                            : setEmergencyPhoneNumber(e.target.value)
                        }
                        placeholder={field
                          .replace(/_/g, " ")
                          .replace(/\b\w/g, (char) => char.toUpperCase())}
                        required
                        className="w-full py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans text-sm"
                      />
                    </div>
                  ) : (
                    // Default Inputs (Text, Password, Number)
                    <input
                      type={
                        field === "password"
                          ? passwordVisible
                            ? "text"
                            : "password"
                          : field === "experience_years"
                          ? "number"
                          : "text"
                      }
                      name={field}
                      placeholder={field
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (char) => char.toUpperCase())}
                      required={field === "middle_name" ? false : true}
                      className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans text-sm"
                    />
                  )}

                  {/* Password Visibility Toggle */}
                  {field === "password" && (
                    <button
                      type="button"
                      className="absolute right-3 top-[10px] text-blue-500 hover:text-blue-800"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                    >
                      {passwordVisible ? (
                        <FaEyeSlash size={18} />
                      ) : (
                        <FaEye size={18} />
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Captcha Section */}
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setCaptcha("X9Y8Z7")}
                className="text-blue-950 rounded-md hover:text-blue-500 transition"
              >
                <SlRefresh className="w-5 h-5" />
              </button>
              <span
                onContextMenu={(e) => e.preventDefault()}
                className="bg-blue-700 text-white font-medium font-mono px-4 py-1 rounded-md cursor-not-allowed"
              >
                {captcha}
              </span>
              <input
                type="text"
                placeholder="Enter Captcha"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans text-sm"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="w-fit py-2 px-4 text-white bg-blue-500 rounded-md shadow-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 font-ubuntu focus:ring-blue-500 disabled:opacity-50 transition-all duration-500 transform hover:scale-110 uppercase"
              >
                Sign Up
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

export default SignUpPage;
