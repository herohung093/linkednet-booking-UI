import React from "react";

const OpeningTime: React.FC<{ businessHours: BusinessHours[] }> = ({
  businessHours,
}) => {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const ampm = parseInt(hours) >= 12 ? "pm" : "am";
    const formattedHours = parseInt(hours) % 12 || 12;
    return `${formattedHours}:${minutes.padStart(2, "0")} ${ampm}`;
  };

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mt-10 mx-5 mb-5">Opening times</h2>
      {businessHours?.map((day) => (
        <div key={day.dayOfWeek} className="flex justify-between py-2 mx-10">
          <h3 className="text-base font-medium">{day.dayOfWeek}</h3>
          {day.openingTime === "Closed" ? (
            <p className="text-base font-medium text-red-500">Closed</p>
          ) : (
            <p className="text-base font-medium">
              {formatTime(day.openingTime)} - {formatTime(day.closingTime)}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default OpeningTime;
