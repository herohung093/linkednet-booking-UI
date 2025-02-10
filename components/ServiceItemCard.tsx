import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Clock, DollarSign, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import {
  addServiceItemToGuest,
  removeServiceItemFromGuest,
} from "@/redux toolkit/cartSlice";

interface ServiceItemCardProps {
  service: ServiceItem;
}

const ServiceItemCard = ({ service }: ServiceItemCardProps) => {
  const {
    id,
    serviceName,
    estimatedTime,
    servicePrice,
    serviceDescription,
  } = service;

  const dispatch = useDispatch();
  const guests = useSelector((state: any) => state.cart.guests);
  const currentGuestName = useSelector((state: any) => state.cart.currentGuestName);
  const [isExpanded, setIsExpanded] = useState(false);

  const guest = guests.find((guest: any) => guest.name === currentGuestName);
  const isServiceInCart: boolean = guest?.guestServices.some(
    (guestService: any) => guestService.serviceItem.id === id
  );

  const handleClickAdd = () => {
    dispatch(
      addServiceItemToGuest({
        guestName: currentGuestName,
        serviceItem: service,
      })
    );
  };

  const handleClickRemove = () => {
    dispatch(
      removeServiceItemFromGuest({
        guestName: currentGuestName,
        serviceItemId: id,
      })
    );
  };

  // Only show description section if there is a description
  const showDescription = serviceDescription && serviceDescription.trim().length > 0;
  
  // Determine if the description needs to be truncated
  const shouldTruncate = showDescription && serviceDescription.length > 100;
  
  // Get the display text based on expansion state
  const getDisplayText = () => {
    if (!shouldTruncate || isExpanded) return serviceDescription;
    return serviceDescription.slice(0, 100) + '...';
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-4">
        {/* Service Info */}
        <div className="flex-1">
          {/* Service Name */}
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{serviceName}</h3>
          
          {/* Price and Duration Row */}
          <div className="flex items-center gap-4 text-gray-600">
            {/* Price */}
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              <span className="font-medium">{servicePrice.toFixed(2)}</span>
            </div>
            
            {/* Separator Dot */}
            <span className="text-gray-300">•</span>
            
            {/* Duration */}
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{estimatedTime} mins</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {!isServiceInCart ? (
          <button
            onClick={handleClickAdd}
            className="flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800 transition-colors
              md:px-4 md:py-2 md:gap-2
              px-3 py-1.5"
          >
            <Plus className="w-4 h-4 md:mr-1" />
            <span className="font-medium hidden md:inline">Add</span>
          </button>
        ) : (
          <button
            onClick={handleClickRemove}
            className="flex items-center justify-center bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors
              md:px-4 md:py-2 md:gap-2
              px-3 py-1.5"
          >
            <Trash2 className="w-4 h-4 md:mr-1" />
            <span className="font-medium hidden md:inline">Remove</span>
          </button>
        )}
      </div>

      {/* Description Section */}
      {showDescription && (
        <div className="text-sm text-gray-600">
          <p className="leading-relaxed">{getDisplayText()}</p>
          {shouldTruncate && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 text-gray-500 hover:text-gray-700 mt-1 transition-colors"
            >
              <span className="text-sm">
                {isExpanded ? 'Show less' : 'Show more'}
              </span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceItemCard;