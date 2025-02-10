import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Clock, DollarSign, Plus, Trash2 } from "lucide-react";
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

  return (
    <div className="flex items-center justify-between gap-4">
      {/* Service Info */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{serviceName}</h3>
          <div className="flex items-center gap-1 text-gray-600">
            <DollarSign className="w-4 h-4" />
            <span className="font-medium">{servicePrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Service Details */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{estimatedTime} mins</span>
          </div>
          {serviceDescription && (
            <p className="text-sm text-gray-500 hidden md:block">{serviceDescription}</p>
          )}
        </div>
      </div>

      {/* Action Button - Different styles for mobile and desktop */}
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
  );
};

export default ServiceItemCard;