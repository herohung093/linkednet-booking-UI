// import Image from "next/image";
import React from "react";
import Loading from "./Loading";

interface PropsInterface {
  isLoading: boolean;
}

export const Logo: React.FC<PropsInterface> = ({ isLoading }) => {
  return (
    <div>
      {isLoading ? (
        <Loading />
      ) : (
        <img
          src="https://media.istockphoto.com/id/165781365/photo/perfect-fingernails.jpg?s=1024x1024&w=is&k=20&c=1Nq9gwZGyABdvn9-SEsOty2u-80Y5nDkJi0YUDd8_Ro="
          alt="logo"
          width={1200}
          height={1000}
          className="mb-5 lg:mb-10 mx-auto"
        />
      )}
    </div>
  );
};
