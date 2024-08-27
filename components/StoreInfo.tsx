import { StarIcon } from "@radix-ui/react-icons";
import React from "react";

import {
  Box,
  Typography,
  Rating,
  Skeleton,
} from '@mui/material';

const LoadingSkeleton = () => (
  <div>
    <Skeleton variant="text" width="60%" height={40} />
      <Skeleton variant="rectangular" width="100%" height={40} />
      <Box display="flex" alignItems="center" gap={2}>
        <Skeleton variant="text" width={40} height={40} />
        <Skeleton variant="text" width="30%" height={20} />
      </Box>
      <Skeleton variant="text" width="40%" height={20} />
      <Skeleton variant="text" width="20%" height={20} />
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
      return "Currently Closed"; // Business is closed on this day
    }

    const { openingTime, closingTime } = currentDayBusinessHours;
    const openingHour = parseInt(openingTime.replace(":", ""));
    const closingHour = parseInt(closingTime.replace(":", ""));

    if (currentTime >= openingHour && currentTime <= closingHour) {
      return `Open until ${closingTime}`;
    } else if (currentTime < openingHour) {
      return `Currently Closed, open from ${openingTime}`;
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
    return <LoadingSkeleton />;
  }

  const stars = Array.from({ length: 5 }, (_, index) => (
    <StarIcon key={index} />
  ));

  return (
    <div >
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {storeConfig?.storeName}
      </Typography>

      <Box display="flex" alignItems="center" gap={2}>
        <Typography variant="h2" fontWeight="black">
          4.5
        </Typography>
        <Rating value={4.5} readOnly />
      </Box>

      <Typography variant="body1" color="textSecondary" gutterBottom>
        {storeConfig?.storeAddress}
      </Typography>

      <Typography variant="body2" color="textSecondary" gutterBottom>
        {checkBusinessStatus()}
      </Typography>
    </div>
  );
};
