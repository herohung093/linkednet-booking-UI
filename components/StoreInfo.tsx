import React, { useEffect, useState } from "react";
import { MapPin, Phone, Clock, Star, Sparkles } from "lucide-react";
import moment from "moment";

const LoadingSkeleton = () => (
  <div className="animate-pulse p-4">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
      <div className="flex-1">
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-4/5"></div>
    </div>
  </div>
);

export const StoreInfo: React.FC<any> = ({ storeConfig }) => {
  const [directionUrl, setDirectionUrl] = useState<string>("");
  const [businessStatus, setBusinessStatus] = useState<string>("");

  useEffect(() => {
    if (navigator.geolocation && storeConfig?.storeAddress) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${encodeURIComponent(
          storeConfig.storeAddress
        )}`;
        setDirectionUrl(url);
      });
    }

    if (storeConfig?.businessHoursList) {
      const currentDateTime = moment();
      const currentDayOfWeek = currentDateTime.format("dddd").toUpperCase();
      const currentDayBusinessHours = storeConfig.businessHoursList.find(
        (day: any) => day.dayOfWeek === currentDayOfWeek
      );

      if (!currentDayBusinessHours) {
        setBusinessStatus("Currently Closed");
        return;
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

      if (currentDateTime.isBetween(openingHour, closingHour)) {
        setBusinessStatus(`Open until ${moment(closingHour).format("h:mm A")}`);
      } else {
        setBusinessStatus(`Opens ${moment(openingHour).format("h:mm A")} tomorrow`);
      }
    }
  }, [storeConfig]);

  if (!storeConfig) return <LoadingSkeleton />;

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      {/* Main Info Section */}
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          {/* Store Icon */}
          <div className="p-2 bg-black rounded-lg shrink-0">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          
          {/* Store Name */}
          <div className="min-w-0">
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {storeConfig.storeName}
            </h1>
            <p className="text-xs text-gray-500">
              Professional Beauty Services
            </p>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          <div className="inline-flex items-center bg-yellow-50 px-2 py-1 rounded-full">
            <Star className="w-3 h-3 text-yellow-500 mr-1 fill-yellow-500" />
            <span className="text-xs font-medium text-yellow-700">4.5</span>
          </div>
          <div className={`
            inline-flex items-center px-2 py-1 rounded-full gap-1
            ${businessStatus.includes("Open") 
              ? "bg-green-50 text-green-700" 
              : "bg-red-50 text-red-700"}
          `}>
            <Clock className="w-3 h-3" />
            <span className="text-xs font-medium">{businessStatus}</span>
          </div>
        </div>
      </div>

      {/* Contact Links */}
      <div className="border-t border-gray-100">
        <div className="grid grid-cols-2 divide-x divide-gray-100">
          {/* Address */}
          <a
            href={directionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-xs truncate">Get Directions</span>
          </a>

          {/* Phone */}
          <a
            href={`tel:${storeConfig.storePhoneNumber}`}
            className="flex items-center gap-2 p-3 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-xs">{storeConfig.storePhoneNumber}</span>
          </a>
        </div>
      </div>
    </div>
  );
};