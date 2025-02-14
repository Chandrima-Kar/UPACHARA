"use client";
import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaCalendarAlt } from "react-icons/fa";
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

const countryCodes = ["+91", "+1", "+44", "+61", "+81", "+33", "+49"];

const SignUpPage = () => {
  const router = useRouter();
  const [userType, setUserType] = useState("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [specialization, setSpecialization] = useState(""); // Only for doctors
  const [licenseNumber, setLicenseNumber] = useState(""); // Only for doctors
  const [experienceYears, setExperienceYears] = useState(""); // Only for doctors
  const [bloodGroup, setBloodGroup] = useState(""); // Only for patients
  const [gender, setGender] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("+91");
  const [address, setAddress] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [emergencyContactPerson, setEmergencyContactPerson] = useState(""); // Only for patients
  const [emergencyContactNumber, setEmergencyContactNumber] = useState(""); // Only for patients
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captcha, setCaptcha] = useState(generateCaptcha());

  useEffect(() => {
    setCaptcha(generateCaptcha());
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault(); // Prevent page refresh

    const userData = {
      email,
      password,
      firstName,
      lastName,
      phone: `${selectedCountryCode}${phoneNumber}`,
      address,
      imageURL,
    };

    if (userType === "doctor") {
      userData.specialization = specialization;
      userData.licenseNumber = licenseNumber;
      userData.experienceYears = experienceYears;
    } else {
      userData.dateOfBirth = selectedDate;
      userData.gender = gender;
      userData.bloodGroup = bloodGroup;
      userData.emergencyContact = emergencyContactPerson;
      userData.emergencyPhone = emergencyContactNumber;
      userData.medicalHistory = [];
    }

    // Validate captcha
    if (captchaInput !== captcha) {
      alert("Captcha does not match!");
      return;
    }

    try {
      const response = await api.post(
        `/auth/${userType === "doctor" ? "doctor" : "patient"}/register`,
        userData 
      );

      const { message } = response; 

      if (message === "Patient registered successfully") {
        toast.success(data.message);
        router.push("/login"); // Redirect to login after successful signup
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error("An error occurred. Please try again later.");
    }
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
        <h3 className="text-lg font-medium font-mono text-gray-900 text-center">
          -- Sign Up As A --
        </h3>

        <div className="flex justify-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="userType"
              value="patient"
              checked={userType === "patient"}
              onChange={() => setUserType("patient")}
              className="w-4 h-4 text-blue-500 focus:ring-blue-700 border-gray-300"
            />
            <span className="text-gray-700 capitalize font-montserrat">
              Patient
            </span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="userType"
              value="doctor"
              checked={userType === "doctor"}
              onChange={() => setUserType("doctor")}
              className="w-4 h-4 text-blue-500 focus:ring-blue-700 border-gray-300"
            />
            <span className="text-gray-700 capitalize font-montserrat">
              Doctor
            </span>
          </label>
        </div>

        <form className="space-y-6" onSubmit={handleSignUp}>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans text-sm"
            />
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans text-sm"
              />
              {/* Password Visibility Toggle */}
              <button
                type="button"
                className="absolute right-3 top-[10px] text-blue-500 hover:text-blue-800"
                onClick={() => setPasswordVisible(!passwordVisible)}>
                {passwordVisible ? (
                  <FaEyeSlash size={18} />
                ) : (
                  <FaEye size={18} />
                )}
              </button>
            </div>
            <input
              type="text"
              name="first_name"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans text-sm"
            />
            <input
              type="text"
              name="middle_name"
              placeholder="Middle Name"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans text-sm"
            />
            <input
              type="text"
              name="last_name"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans text-sm"
            />
            {userType === "doctor" ? (
              <>
                <input
                  type="text"
                  name="specialization"
                  placeholder="Specialization"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans text-sm"
                />
                <input
                  type="text"
                  name="license-number"
                  placeholder="License Number"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans text-sm"
                />
                <input
                  type="text"
                  name="experience-years"
                  placeholder="Experience years"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans text-sm"
                />
              </>
            ) : (
              <>
                <input
                  type="text"
                  name="blood-group"
                  placeholder="Blood Group"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans text-sm"
                />
                <div className="relative">
                  <input
                    type="date"
                    name="date_of_birth"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans text-sm"
                  />
                  <FaCalendarAlt className="absolute right-3 top-3 text-gray-500" />
                </div>
                <select
                  name="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans text-sm">
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </>
            )}

            <div className="flex items-center border border-gray-300 rounded-md">
              <select
                className="border-r px-2 py-2 bg-gray-100 text-gray-700 rounded-l-md focus:outline-none"
                value={selectedCountryCode}
                onChange={(e) => setSelectedCountryCode(e.target.value)}>
                {countryCodes.map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="phone_number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone Number"
                required
                className="w-full py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans text-sm"
              />
            </div>
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans text-sm"
            />
            <input
              type="text"
              name="image-url"
              placeholder="Image URL"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans text-sm"
            />
            {userType === "patient" && (
              <>
                <input
                  type="text"
                  name="emergency-contact-person"
                  placeholder="Emergency Contact"
                  value={emergencyContactPerson}
                  onChange={(e) => setEmergencyContactPerson(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans text-sm"
                />
                <input
                  type="text"
                  name="emergency-contact-number"
                  placeholder="Emergency Contact Person Number"
                  value={emergencyContactNumber}
                  onChange={(e) => setEmergencyContactNumber(e.target.value)}
                  required
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans text-sm"
                />
              </>
            )}
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setCaptcha(generateCaptcha())}
                className="text-blue-950 hover:text-blue-500">
                <SlRefresh className="w-5 h-5" />
              </button>
              <span className="bg-blue-700 text-white font-mono px-4 py-1 rounded-md cursor-not-allowed">
                {captcha}
              </span>
              <input
                type="text"
                placeholder="Enter Captcha"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans text-sm"
              />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="w-fit py-2 px-4 text-white bg-blue-500 rounded-md shadow-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 font-ubuntu focus:ring-blue-500 disabled:opacity-50 transition-all duration-500 transform hover:scale-110 uppercase">
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SignUpPage;
