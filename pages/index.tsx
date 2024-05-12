"use client";
import Cart from "@/components/Cart";
import { CartSide } from "@/components/CartSide";
import Error from "@/components/Error";
import { Logo } from "@/components/Logo";
import { NailServices } from "@/components/NailServices";


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
    <main>
      <div>
        <div>
          <Logo isLoading={isLoading} />
        </div>
        <div className="md:flex md:gap-20 md:justify-around">
          <div>
            {groupedData &&
              groupedData.map((item: any, index: number) => (
                <NailServices key={index} data={item} index={index} />
              ))}
          </div>
          <CartSide />
        </div>
      </div>
      <div></div>
    </main>
  );
}
