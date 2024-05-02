"use client";
import { NailServices } from "@/components/NailServices";
import Navbar from "@/components/Navbar";

export default function Home() {
  const dummyData: Category = {
    category: "Manicure",
    services: [
      {
        serviceName: "SNS Nails",
        serviceDescription: "Lorem ipsum dolor sit amet.",
        servicePrice: 15,
        estimatedTime: 60,
        serviceType: { id: 1 },
      },
      {
        serviceName: "Manicure",
        serviceDescription: "Lorem ipsum dolor sit amet.",
        servicePrice: 20,
        estimatedTime: 30,
        serviceType: { id: 2 },
      },
      {
        serviceName: "Pedicure",
        serviceDescription: "Lorem ipsum dolor sit amet.",
        servicePrice: 30,
        estimatedTime: 45,
        serviceType: { id: 3 },
      },
      {
        serviceName: "Gel Nails",
        serviceDescription: "Lorem ipsum dolor sit amet.",
        servicePrice: 25,
        estimatedTime: 60,
        serviceType: { id: 4 },
      },
    ],
  };

  const dummyData2: Category = {
    category: "Waxing",
    services: [
      {
        serviceName: "SNS Nails",
        serviceDescription: "Lorem ipsum dolor sit amet.",
        servicePrice: 15,
        estimatedTime: 60,
        serviceType: { id: 5 },
      },
      {
        serviceName: "Manicure",
        serviceDescription: "Lorem ipsum dolor sit amet.",
        servicePrice: 20,
        estimatedTime: 30,
        serviceType: { id: 6 },
      },
      {
        serviceName: "Pedicure",
        serviceDescription: "Lorem ipsum dolor sit amet.",
        servicePrice: 30,
        estimatedTime: 45,
        serviceType: { id: 7 },
      },
      {
        serviceName: "Gel Nails",
        serviceDescription: "Lorem ipsum dolor sit amet.",
        servicePrice: 25,
        estimatedTime: 60,
        serviceType: { id: 8 },
      },
    ],
  };

  return (
    <main>
      <div className="sm:w-[80%] m-auto ">
        <Navbar />
        <NailServices data={dummyData} />
        <NailServices data={dummyData2} />
      </div>
    </main>
  );
}
