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
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo
          impedit perspiciatis provident recusandae vero, aspernatur,
          repellendus nostrum sit tenetur sequi laudantium
        </p>
      </div>
      <div className=" w-full max-w-2xl bg-blue-50 shadow-xl rounded-lg p-6">
        <h3 className="text-lg font-medium font-mono text-gray-900 mb-4 text-center">
          -- Fill Your Information Here --
        </h3>
        <form className="space-y-6">
          {/* Name & Contact Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* {["fname", "lname", "phone", "email"].map((field) => ( */}
            <div>
              <input
                // type={
                //   field === "email"
                //     ? "email"
                //     : field === "phone"
                //     ? "tel"
                //     : "text"
                // }
                // name={field}
                // id={field}
                // placeholder={
                //   field.charAt(0).toUpperCase() +
                //   field.slice(1).replace("name", " Name")
                // }
                // value={formData[field]}
                // onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm"
              />
            </div>
            {/* ))} */}
          </div>

          {/* Symptom Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* {[1, 2, 3, 4].map((num) => ( */}
            <div>
              <select
                // name={`symptom_${num}`}
                // id={`symptom_${num}`}
                // value={formData[`symptom_${num}`]}
                // onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato sm:text-sm "
              >
                <option value="">Select a symptom</option>

                {/* Sorting the options alphabetically */}
                {/* {Object.keys(symptoms)
                          .sort((a, b) => a.localeCompare(b)) // Sort in ascending order
                          .map((symptom) => (
                            <option
                              key={symptoms[symptom]}
                              value={symptom}
                              className="overflow-y-auto"
                            >
                              {symptom
                                .split(" ") // Split words
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                ) // Capitalize first letter
                                .join(" ")}{" "}
                            </option>
                          ))} */}
              </select>
            </div>
            {/* ))} */}
          </div>

          {/* Message Field */}
          <div>
            <textarea
              name="message"
              placeholder="Message"
              rows={4}
              // value={formData.message}
              // onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-lato placeholder:font-sans sm:text-sm"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-center">
            <button
              type="submit"
              // disabled={isLoading}
              className="w-fit py-2 px-4 text-white bg-blue-500 rounded-md shadow-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 font-ubuntu focus:ring-blue-500 disabled:opacity-50 transition-all duration-500 transform hover:scale-110"
            >
              Check
              {/* {isLoading ? "Predicting..." : "Predict"} */}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Liver;
