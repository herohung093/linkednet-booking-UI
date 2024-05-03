import React from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export const Staff: React.FC<{ staff: Staff }> = ({ staff }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mx-5">
      <div>
        <div className="text-lg font-semibold mb-2 flex items-center gap-2">
          <AccountCircleIcon />
          {staff.firstName} {staff.lastName}
        </div>
        <p className="text-gray-600 mb-4">Nickname: {staff.nickname}</p>
        <p className="text-gray-600 mb-4">Skill Level: {staff.skillLevel}</p>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-gray-600 mb-4">Working Days: {staff.workingDays}</p>
      </div>
    </div>
  );
};
