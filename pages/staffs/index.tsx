"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useSelector } from "react-redux";
import StaffDialog from "@/components/StaffDialog";

const StaffsPage: React.FC = () => {
  const router = useRouter();
  const staffData: Staff[] = [
    {
      firstName: "Trong",
      lastName: "Thai",
      nickname: "Alex",
      phone: "0401070808",
      skillLevel: 2,
      dateOfBirth: "15/05/2024",
      rate: 200,
      workingDays: "1,2,3,4,5",
    },
    {
      firstName: "John",
      lastName: "Doe",
      nickname: "JD",
      phone: "0401070809",
      skillLevel: 1,
      dateOfBirth: "10/12/2000",
      rate: 150,
      workingDays: "1,3,5",
    },
    {
      firstName: "Jane",
      lastName: "Smith",
      nickname: "JS",
      phone: "0401070810",
      skillLevel: 3,
      dateOfBirth: "05/03/1995",
      rate: 250,
      workingDays: "2,4",
    },
    {
      firstName: "Alice",
      lastName: "Johnson",
      nickname: "AJ",
      phone: "0401070811",
      skillLevel: 2,
      dateOfBirth: "20/08/1988",
      rate: 180,
      workingDays: "1,2,4",
    },
    {
      firstName: "Bob",
      lastName: "Brown",
      nickname: "BB",
      phone: "0401070812",
      skillLevel: 1,
      dateOfBirth: "25/01/1990",
      rate: 160,
      workingDays: "3,5",
    },
  ];

  const bookingInfo = useSelector((state: any) => state.cart);
  console.log(bookingInfo);

  return (
    <div className="grid grid-rows-3 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
      {staffData.map((staff, index) => (
        <div key={index} className="bg-white rounded-lg shadow-md p-4 mx-5">
          <div>
            <div className="text-lg font-semibold mb-2 flex items-center gap-2">
              <AccountCircleIcon />
              {staff.firstName} {staff.lastName}
            </div>
            <p className="text-gray-600 mb-4">Nickname: {staff.nickname}</p>
            <p className="text-gray-600 mb-4">
              Skill Level: {staff.skillLevel}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-600 mb-4">
              Working Days: {staff.workingDays}
            </p>
            <StaffDialog staff={staff} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default StaffsPage;
