import { StarIcon } from "@radix-ui/react-icons";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import LocalPhoneRoundedIcon from "@mui/icons-material/LocalPhoneRounded";
import React, { useEffect, useState } from "react";

import { Box, Typography, Rating, Skeleton } from "@mui/material";
import moment from "moment";

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
  const storeAddress = storeConfig?.storeAddress;
  const [directionUrl, setDirectionUrl] = useState<string>("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${encodeURIComponent(
          storeAddress
        )}`;
        setDirectionUrl(url);
      });
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [storeAddress]);

  const checkBusinessStatus = () => {
    const currentDateTime = moment();
    const currentDayOfWeek = currentDateTime.format("dddd").toUpperCase(); // 0 (Sunday) to 6 (Saturday)
    const currentTime = currentDateTime;

    const currentDayBusinessHours = storeConfig?.businessHoursList.find(
      (day: any) => day.dayOfWeek === currentDayOfWeek
    );
    if (!currentDayBusinessHours) {
      return "Currently Closed"; // Business is closed on this day
    }

    const { openingTime, closingTime } = currentDayBusinessHours;
    const openingHour = moment().set({
      hour: parseInt(openingTime.split(":")[0]),
      minute: parseInt(openingTime.split(":")[1]),
    });
    const closingHour = moment().set({
      hour: parseInt(closingTime.split(":")[0]),
      minute: parseInt(closingTime.split(":")[1]),
    });

    if (currentTime.isAfter(openingHour) && currentTime.isBefore(closingHour)) {
      return `Open until ${closingTime}`;
    } else if (currentTime.isAfter(closingHour)) {
      return `Currently Closed, open from ${openingTime}`;
    } else {
      // Find the next opening day and time
      let nextOpeningDay = currentDateTime.add(1, "days").format("dddd");
      let nextOpeningTime = storeConfig.businessHoursList.find(
        (day: any) => day.dayOfWeek === nextOpeningDay
      );

      return `Closed, open on ${nextOpeningDay} at ${nextOpeningTime}`;
    }
  };

  if (!storeConfig) {
    return <LoadingSkeleton />;
  }

  const stars = Array.from({ length: 5 }, (_, index) => (
    <StarIcon key={index} />
  ));

  return (
    <div>
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
        <a
          href={directionUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500"
          style={{ display: "flex", alignItems: "center" }}
        >
          <LocationOnRoundedIcon
            style={{ verticalAlign: "middle", marginRight: "8px" }}
          />
          {storeConfig?.storeAddress}
        </a>
      </Typography>

      <Typography variant="body1" color="textSecondary" gutterBottom>
        <a
          href={`tel:${storeConfig?.storePhoneNumber}`}
          className="text-blue-500"
          style={{ display: "flex", alignItems: "center" }}
        >
          <LocalPhoneRoundedIcon
            style={{ verticalAlign: "middle", marginRight: "8px" }}
          />
          {storeConfig?.storePhoneNumber}
        </a>
      </Typography>

      {/* <Typography variant="body2" color="textSecondary" gutterBottom>
        {checkBusinessStatus()}
      </Typography> */}
    </div>
  );
};
