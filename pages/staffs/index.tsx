"use client";
import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import StaffDialog from "@/components/StaffDialog";
import useSWR from "swr";

type FetcherFunction = (...args: Parameters<typeof fetch>) => Promise<any>;

const fetcher: FetcherFunction = (...args) =>
  fetch(...args).then((res) => res.json());

const StaffsPage: React.FC = () => {
 
  const { data, error, isLoading } = useSWR(
    "https://big-umbrella-c5c3450b8837.herokuapp.com/staff/?isOnlyActive=true",
    fetcher
  );

  return (
    <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
      {data?.map((staff: Staff, index: number) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md p-8 mx-5 flex flex-col justify-center items-center "
        >
          <div className="text-lg font-semibold flex justify-center gap-2 mb-2 items-center">
            <AccountCircleIcon />
            {staff.firstName} {staff.lastName}
          </div>
          <p className="text-gray-600 mb-4">Nickname: {staff.nickName}</p>
          <StaffDialog staff={staff} />
        </div>
      ))}
    </div>
  );
};

export default StaffsPage;
