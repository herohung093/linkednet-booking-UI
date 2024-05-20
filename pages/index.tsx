"use client";
import { CartSide } from "@/components/CartSide";
import Error from "@/components/Error";
import { Logo } from "@/components/Logo";
import { NailServices } from "@/components/NailServices";
import OpeningTime from "@/components/OpeningTime";
import { StoreInfo } from "@/components/StoreInfo";
import { StoreMap } from "@/components/StoreMap";
import { Horizon } from "@/icons/Horizon";
import {
  setSelectedStoreInfo,
  setServiceData,
} from "@/redux toolkit/storeInfo";
import axios from "@/ulti/axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function Home() {
  const [serviceDataInfo, setServiceDataInfo] = useState<
    NailSalonService[] | null
  >(null);
  const [storeConfig, setStoreConfig] = useState<StoreInfo | null>(null);
  const [error, setError] = useState<unknown | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const serviceResponse = await axios.get("service/");
        setServiceDataInfo(serviceResponse.data);

        const storeConfigResponse = await axios.get("storeConfig/1");
        setStoreConfig(storeConfigResponse.data);

        setIsLoading(false);
      } catch (error: unknown) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    dispatch(setSelectedStoreInfo(storeConfig));
    dispatch(setServiceData(serviceDataInfo));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeConfig]);

  const sortedData = (serviceDataInfo ?? [])
    .slice()
    .sort((a: any, b: any) =>
      a.serviceType.type.localeCompare(b.serviceType.type)
    );

  const groupedData = sortedData?.reduce((acc: any, service: any) => {
    const { serviceType, ...rest } = service;
    const index = acc.findIndex(
      (item: any) => item[0].serviceType.type === serviceType.type
    );
    if (index === -1) {
      acc.push([{ serviceType, ...rest }]);
    } else {
      acc[index].push({ serviceType, ...rest });
    }
    return acc;
  }, []);

  if (error) return <Error />;
  return (
    <main className="mb-20">
      <div className="flex justify-center mx-auto mb-8">
        <Logo isLoading={isLoading} />
      </div>
      <div className="flex justify-around lg:gap-10 mx-auto">
        <div className="mx-auto">
          <div>
            <StoreInfo storeConfig={storeConfig} />
          </div>
          <div className="mx-5 font-bold text-2xl">Services</div>

          <div className="flex flex-col">
            <div>
              {groupedData &&
                groupedData.map((item: any, index: number) => (
                  <NailServices key={index} data={item} index={index} />
                ))}
            </div>
            <OpeningTime
              key={storeConfig?.id}
              businessHours={storeConfig?.businessHoursList}
            />
            <Horizon />
            <StoreMap storeConfig={storeConfig} />
          </div>
        </div>
        <div className="sticky top-20 self-start mx-auto mt-20 ">
          <CartSide />
        </div>
      </div>
    </main>
  );
}
