// import Image from "next/image";
import React from "react";
import Loading from "./Loading";

interface PropsInterface {
  isLoading: boolean;
}

const Skeleton = () => (
  <div className="animate-pulse flex justify-center items-center h-[360px] w-[450px] bg-gray-300 mb-5 lg:mb-10 mx-auto lg:hidden">
    <div className="h-full w-full bg-gray-400"></div>
  </div>
);

export const Logo: React.FC<PropsInterface> = ({ isLoading }) => {
  return (
    <div>
      {isLoading ? (
        <Skeleton />
      ) : (
        <img
          src="https://media.istockphoto.com/id/165781365/photo/perfect-fingernails.jpg?s=1024x1024&w=is&k=20&c=1Nq9gwZGyABdvn9-SEsOty2u-80Y5nDkJi0YUDd8_Ro="
          alt="logo"
          width={500}
          height={500}
          className="mb-5 lg:mb-10 mx-auto lg:hidden"
        />
      )}
    </div>
  );
};
