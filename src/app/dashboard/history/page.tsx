import React from "react";
import { auth } from "@clerk/nextjs/server";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import {
  UserSearchIcon,
  CalendarClockIcon,
  ClipboardPenIcon,
  BedDoubleIcon,
  ReceiptTextIcon,
} from "lucide-react";

const page = async () => {
  const orgId = (await auth()).orgId;

  if (!orgId) {
    return <div>Orgid not exist</div>;
  }

  return (
    <BentoGrid className="lg:grid-rows-4 p-4">
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
    </BentoGrid>
  );
};

export default page;

const features = [
  {
    Icon: UserSearchIcon,
    name: "Patients",
    description: "We automatically save your files as you type.",
    href: "/dashboard/history/patients",
    cta: "Patients",
    background: (
      <img
        src="/404.svg"
        className="absolute right-0 top-10 origin-top scale-75 rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-90"
      />
    ),
    className: "lg:row-start-1 lg:row-end-5 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: CalendarClockIcon,
    name: "Registrations",
    description: "Search through all your files in one place.",
    href: "/dashboard/history/registrations",
    cta: "Registrations",
    background: (
      <img
        src="/404.svg"
        className="absolute right-0 top-10 origin-top scale-75 rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-90"
      />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-4",
  },
  {
    Icon: ClipboardPenIcon,
    name: "Prescriptions",
    description: "Supports 100+ languages and counting.",
    href: "/dashboard/history/prescriptions",
    cta: "Prescriptions",
    background: (
      <img
        src="/404.svg"
        className="absolute right-0 top-10 origin-top scale-75 rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-90"
      />
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-4 lg:row-end-5",
  },
  {
    Icon: BedDoubleIcon,
    name: "Admissions",
    description: "Use the calendar to filter your files by date.",
    href: "/dashboard/history/admissions",
    cta: "Admissions",
    background: (
      <img
        src="/404.svg"
        className="absolute right-0 top-10 origin-top scale-75 rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-90"
      />
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: ReceiptTextIcon,
    name: "Bills",
    description: "Get notified when someone shares a file.",
    href: "/dashboard/history/bills",
    cta: "Bills",
    background: (
      <img
        src="/404.svg"
        className="absolute right-0 top-10 origin-top scale-75 rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-90"
      />
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-3 lg:row-end-5",
  },
];
