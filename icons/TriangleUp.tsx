import React from "react";

export const TriangleUp = () => {
  return (
    <div className="border bg-white rounded-md hover:bg-gray-100  shadow-md">
      <svg
        width={25}
        height={25}
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="bg-blue-800 rounded-md hover:bg-gray-100 shadow-md"
      >
        <path d="M4 9H11L7.5 4.5L4 9Z" fill="gray" />
      </svg>
    </div>
  );
};
