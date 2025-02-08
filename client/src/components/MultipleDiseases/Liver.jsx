import React from "react";

const Liver = () => {
  return (
    <section className="flex flex-col my-16 gap-12 items-center justify-center ">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl text-center uppercase font-extrabold text-gray-900 font-montserrat">
          Protect Your
          <br /> <span className=" text-blue-500"> Liver:</span> Get Checked
        </h1>
        <p className="text-gray-600 max-w-3xl text-center">
          Fill in your details and check your liver health status.
        </p>
      </div>
      <div className="w-full max-w-2xl bg-blue-50 shadow-xl rounded-lg p-6">
        <h3 className="text-lg font-medium font-mono text-gray-900 mb-4 text-center">
          -- Fill Your Information Here --
        </h3>
        <form className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              "Age",
              "tot_bilirubin",
              "direct_bilirubin",
              "ag_ratio",
              "sgpt",
              "sgot",
              "tot_proteins",
              "albumin",
              "alkphos",
            ].map((field, index) => (
              <div key={index}>
                <input
                  type={field === "Age" ? "number" : "text"}
                  name={field}
                  placeholder={field
                    .replace(/_/g, " ")
                    .replace("alkphos", "Alkaline Phosphatase")
                    .replace(/\w/g, (char) => char.toUpperCase())}
                  className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm"
                />
              </div>
            ))}
          </div>

          {/* <div>
            <select
              name="gender"
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato sm:text-sm"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Gay">Others</option>
            </select>
          </div> */}

          <div className="flex items-center justify-center  gap-x-5 font-lato">
            <label className="text-gray-700 font-medium">Select Gender:</label>
            <div className="flex gap-4">
              {["Male", "Female", "Others"].map((gender) => (
                <label
                  key={gender}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="gender"
                    value={gender}
                    className="w-3 h-3 text-blue-500 focus:ring-blue-700 border-gray-300"
                  />
                  <span className="text-gray-700 ">{gender}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="w-fit py-2 px-4 text-white bg-blue-500 rounded-md shadow-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 font-ubuntu focus:ring-blue-500 disabled:opacity-50 transition-all duration-500 transform hover:scale-110"
            >
              Predict
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Liver;
