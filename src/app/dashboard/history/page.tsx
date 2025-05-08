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
  const orgRole = (await auth()).orgRole;

  if (!orgRole) {
    return <div>User does not exist with an appropriate role..</div>;
  }

  return (
    <BentoGrid className="lg:grid-rows-4 p-4 min-h-full">
      {features
        .filter((page) => page.roles.includes(orgRole))
        .map((feature) => (
          <BentoCard key={feature.name} {...feature} />
        ))}
    </BentoGrid>
  );
};

export default page;

const features = [
  {
    Icon: CalendarClockIcon,
    name: "Registrations",
    description:
      "Streamline patient registration with quick and organized record-keeping.",
    href: "/dashboard/history/registrations",
    cta: "Registrations",
    background: (
      <img
        src="/placeholders/Registrations.jfif"
        className="h-full object-cover w-full absolute right-0 top-0 origin-top rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_80%)] dark:[mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-110"
      />
    ),
    className: "lg:row-span-2 lg:col-span-1",
    roles: ["org:clinic_head", "org:doctor", "org:assistant_doctor"],
  },
  {
    Icon: UserSearchIcon,
    name: "Patients",
    description:
      "Easily manage and access patient information with real-time search capabilities.",
    href: "/dashboard/history/patients",
    cta: "Patients",
    background: (
      <img
        src="/placeholders/Patients.jfif"
        className="h-full object-cover w-full absolute right-0 top-0 origin-top rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_80%)] dark:[mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-110"
      />
    ),
    className: "lg:row-span-4 lg:col-span-1",
    roles: [
      "org:clinic_head",
      "org:doctor",
      "org:assistant_doctor",
      "org:medical_staff",
    ],
  },
  {
    Icon: ClipboardPenIcon,
    name: "Prescriptions",
    description:
      "Generate and manage prescriptions seamlessly with accurate record tracking.",
    href: "/dashboard/history/prescriptions",
    cta: "Prescriptions",
    background: (
      <img
        src="/placeholders/Prescriptions.jfif"
        className="h-full object-cover w-full absolute right-0 top-0 origin-top rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_80%)] dark:[mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-110"
      />
    ),
    className: "lg:row-span-2 lg:col-span-1",
    roles: ["org:clinic_head", "org:doctor", "org:assistant_doctor"],
  },
  {
    Icon: BedDoubleIcon,
    name: "Admissions",
    description:
      "Effortlessly handle patient admissions with detailed status and room assignments.",
    href: "/dashboard/history/admissions",
    cta: "Admissions",
    background: (
      <img
        src="/placeholders/Admissions.jfif"
        className="h-full object-cover w-full absolute right-0 top-0 origin-top rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_80%)] dark:[mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-110"
      />
    ),
    className: "lg:row-span-2 lg:col-span-1",
    roles: [
      "org:clinic_head",
      "org:doctor",
      "org:assistant_doctor",
      "org:medical_staff",
    ],
  },
  {
    Icon: ReceiptTextIcon,
    name: "Bills",
    description:
      "Track and manage billing details with clear and organized documentation.",
    href: "/dashboard/history/bills",
    cta: "Bills",
    background: (
      <img
        src="/placeholders/Bills.jfif"
        className="h-full object-cover w-full absolute right-0 top-0 origin-top rounded-md border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_80%)] dark:[mask-image:linear-gradient(to_top,transparent_10%,#000_100%)] group-hover:scale-110"
      />
    ),
    className: "lg:row-span-2 lg:col-span-1",
    roles: [
      "org:clinic_head",
      "org:doctor",
      "org:assistant_doctor",
      "org:medical_staff",
    ],
  },
];
