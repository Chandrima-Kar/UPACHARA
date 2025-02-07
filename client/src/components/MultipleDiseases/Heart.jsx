import React from "react";

const Heart = () => {
  return (
    <section className="flex flex-col my-16 gap-12 items-center justify-center ">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-4xl text-center uppercase font-extrabold text-gray-900 font-montserrat">
          Take Control of Your
          <br /> <span className=" text-red-500"> Heart:</span> Get Checked
        </h1>
        <p className="text-gray-600 max-w-3xl text-center">
          Fill in your details and check your heart health status.
        </p>
      </div>
      <div className="w-full max-w-2xl bg-red-50 shadow-xl rounded-lg p-6">
        <h3 className="text-lg font-medium font-mono text-gray-900 mb-4 text-center">
          -- Fill Your Information Here --
        </h3>
        <form className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["age", "restbp", "chol", "maxhr", "oldpeak"].map(
              (field, index) => (
                <div key={index}>
                  <input
                    type="text"
                    name={field}
                    placeholder={field
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                    className="w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 font-lato placeholder:font-sans sm:text-sm"
                  />
                </div>
              )
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <select
                name="gender"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 font-lato sm:text-sm"
              >
                <option value="" disabled selected>
                  Gender
                </option>
                <option value="1">Male</option>
                <option value="0">Female</option>
              </select>
            </div>
            <div>
              <select
                name="chestPain"
                className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 font-lato sm:text-sm"
              >
                <option value="" disabled selected>
                  Chest Pain Type
                </option>
                <option value="0">Asymptomatic</option>
                <option value="1">Non-anginal</option>
                <option value="2">Non-typical</option>
                <option value="3">Typical</option>
              </select>
            </div>
          </div>

          <div>
            <textarea
              name="message"
              placeholder="Message (Optional)"
              rows={4}
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 font-lato placeholder:font-sans sm:text-sm"
            ></textarea>
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="w-fit py-2 px-4 text-white bg-red-500 rounded-md shadow-md font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 font-ubuntu focus:ring-red-500 disabled:opacity-50 transition-all duration-500 transform hover:scale-110"
            >
              Predict
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Heart;
