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
          src="https://images.unsplash.com/photo-1631214524049-0ebbbe6d81aa?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="logo"
          width={1200}
          height={1000}
          className="mb-5 lg:mb-10 mx-auto"
        />
      )}
    </div>
  );
};
