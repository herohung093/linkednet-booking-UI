"use client";
import { CartSide } from "@/components/CartSide";
import Error from "@/components/Error";
import { Logo } from "@/components/Logo";
import { NailServices } from "@/components/NailServices";
import OpeningTime from "@/components/OpeningTime";
import { StoreInfo } from "@/components/StoreInfo";
import { StoreMap } from "@/components/StoreMap";
import { setSelectedStoreInfo } from "@/redux toolkit/storeInfo";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

import useSWR from "swr";

type FetcherFunction = (...args: Parameters<typeof fetch>) => Promise<any>;

const fetcher: FetcherFunction = (...args) =>
  fetch(...args).then((res) => res.json());

export default function Home() {
  const {
    data: serviceData,
    error,
    isLoading,
  } = useSWR(
    "https://big-umbrella-c5c3450b8837.herokuapp.com/service/",
    fetcher
  );
  const { data: storeConfig } = useSWR(
    "https://big-umbrella-c5c3450b8837.herokuapp.com/storeConfig/1",
    fetcher
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSelectedStoreInfo(storeConfig));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeConfig]);

  const sortedData = serviceData?.sort((a: any, b: any) =>
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
      <div>
        <div>
          <Logo isLoading={isLoading} />
        </div>
        <div><StoreInfo storeConfig={storeConfig} /></div>
        <div className="md:flex md:gap-20 md:justify-around">
          <div>
            {groupedData &&
              groupedData.map((item: any, index: number) => (
                <NailServices key={index} data={item} index={index} />
              ))}
          </div>
          <OpeningTime
            key={storeConfig?.id}
            businessHours={storeConfig?.businessHoursList}
          ></OpeningTime>
          <StoreMap storeConfig={storeConfig} />
          <CartSide />
        </div>
      </div>
    </main>
  );
}
