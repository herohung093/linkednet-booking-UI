// import Image from "next/image";
import React from "react";
import Loading from "./Loading";

interface PropsInterface {
  isLoading: boolean;
}

// const Skeleton = () => (
//   <div className="animate-pulse flex justify-center items-center h-[360px] w-[450px] bg-gray-300 mb-5 lg:mb-10 mx-auto lg:hidden">
//     <div className="h-full w-full bg-gray-400"></div>
//   </div>
// );

export const Logo: React.FC<PropsInterface> = ({ isLoading }) => {
  return (
    <div>
      <img
        src="https://images.unsplash.com/photo-1619607146034-5a05296c8f9a?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="logo"
        className="z-1 mb-5 lg:mb-10 mx-auto lg:hidden w-full h-[300px] object-cover"
      />
    </div>
  );
};
