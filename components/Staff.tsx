import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { StarIcon } from "@radix-ui/react-icons";

const getWorkingDaysString = (workingDays: number[]) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const selectedDays = workingDays.map((day, index) => {
    const dayName = days[day - 1];
    return index === workingDays.length - 1 ? dayName : dayName + "-";
  });
  return selectedDays.join("");
};

export const Staff: React.FC<{ staff: Staff }> = ({ staff }) => {
  const workingDaysArray = staff.workingDays.split(",").map(Number);
  const stars = Array.from({ length: staff.rate }, (_, index) => (
    <StarIcon key={index} />
  ));

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mx-5">
      <div>
        <div className="text-lg font-semibold mb-2 flex items-center gap-2">
          <AccountCircleIcon />
          {staff.firstName} {staff.lastName}
        </div>
        <p className="text-gray-600 mb-4">Nickname: {staff.nickName}</p>
        <p className="text-gray-600 mb-4 flex items-center gap-3">
          Rate:
          {stars}
        </p>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-gray-600 mb-4">
          Working Days: {getWorkingDaysString(workingDaysArray)}
        </p>
      </div>
    </div>
  );
};
