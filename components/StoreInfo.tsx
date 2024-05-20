import { StarIcon } from "@radix-ui/react-icons";
import React from "react";

const Skeleton = () => (
  <div className="animate-pulse mb-10">
    <div className="h-8 bg-gray-300 rounded w-3/4 mx-6 mb-4"></div>
    <div className="flex items-center gap-x-2 mx-6 mb-4">
      <div className="h-6 bg-gray-300 rounded w-6"></div>
      <div className="h-6 bg-gray-300 rounded w-4"></div>
      <div className="h-6 bg-gray-300 rounded w-4"></div>
      <div className="h-6 bg-gray-300 rounded w-4"></div>
      <div className="h-6 bg-gray-300 rounded w-4"></div>
      <div className="h-6 bg-gray-300 rounded w-4"></div>
    </div>
    <div className="h-6 bg-gray-300 rounded w-1/2 mx-6 mb-4"></div>
    <div className="h-6 bg-gray-300 rounded w-1/2 mx-6"></div>
  </div>
);

export const StoreInfo: React.FC<any> = ({ storeConfig }) => {
  const checkBusinessStatus = () => {
    const currentDateTime = new Date();
    const currentDayOfWeek = currentDateTime.getDay(); // 0 (Sunday) to 6 (Saturday)
    const currentTime =
      currentDateTime.getHours() * 100 + currentDateTime.getMinutes();

    const currentDayBusinessHours = storeConfig?.businessHoursList.find(
      (day: any) => day.id === currentDayOfWeek + 1
    );
    if (!currentDayBusinessHours) {
      return "Closed"; // Business is closed on this day
    }

    const { openingTime, closingTime } = currentDayBusinessHours;
    const openingHour = parseInt(openingTime.replace(":", ""));
    const closingHour = parseInt(closingTime.replace(":", ""));

    if (currentTime >= openingHour && currentTime <= closingHour) {
      return `Open until ${closingTime}`;
    } else if (currentTime < openingHour) {
      return `Closed, open from ${openingTime}`;
    } else {
      // Find the next opening day and time
      let nextOpeningDay = currentDayOfWeek + 1;
      let nextOpeningTime = openingTime;
      while (
        !storeConfig.businessHoursList.find(
          (day: any) => day.id === nextOpeningDay
        )
      ) {
        nextOpeningDay = (nextOpeningDay + 1) % 7;
      }
      const nextOpeningDayHours = storeConfig?.businessHoursList.find(
        (day: any) => day.id === nextOpeningDay
      );
      nextOpeningTime = nextOpeningDayHours.openingTime;

      return `Closed, open on ${nextOpeningDayHours.dayOfWeek} at ${nextOpeningTime}`;
    }
  };

  if (!storeConfig) {
    return <Skeleton />;
  }

  const stars = Array.from({ length: 5 }, (_, index) => (
    <StarIcon key={index} />
  ));

  return (
    <div className="mb-10">
      <h1 className="text-3xl font-bold mx-6">{storeConfig?.storeName}</h1>
      <h2 className="flex justify-start items-center gap-x-2 mx-6 font-bold text-lg">
        <p>5.0</p>
        {stars}
      </h2>
      <h3 className="mx-6 text-gray-500 font-medium">
        {storeConfig?.storeAddress}
      </h3>
      <h3 className="mx-6 text-gray-500 font-medium">
        {checkBusinessStatus()}
      </h3>
    </div>
  );
};
