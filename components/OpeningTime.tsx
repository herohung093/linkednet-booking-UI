import React from "react";

interface BusinessHours {
  dayOfWeek: string;
  openingTime: string;
  closingTime: string;
}

const OpeningTime: React.FC<{ businessHours: BusinessHours[] | undefined }> = ({
  businessHours,
}) => {
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const ampm = parseInt(hours) >= 12 ? "pm" : "am";
    const formattedHours = parseInt(hours) % 12 || 12;
    return `${formattedHours}:${minutes.padStart(2, "0")} ${ampm}`;
  };

  const getCurrentDayOfWeek = () => {
    const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    const currentDayIndex = new Date().getDay();
    return days[currentDayIndex];
  };

  const currentDay = getCurrentDayOfWeek();

  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold mt-10 mx-6 mb-5">Opening times</h2>
      {businessHours?.map((day) => (
        <div
          key={day.dayOfWeek}
          className={`flex justify-between py-2 mx-10 ${
            day.dayOfWeek === currentDay ? "text-primary-500" : ""
          }`}
        >
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
