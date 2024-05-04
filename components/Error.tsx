import React from "react";

const Error = () => (
  <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
    <div className="bg-red-500 text-white p-8 rounded-lg text-center">
      <h2 className="text-3xl font-bold mb-4">Error</h2>
      <p className="text-lg">An error occurred. Please try again later.</p>
    </div>
  </div>
);

export default Error;
