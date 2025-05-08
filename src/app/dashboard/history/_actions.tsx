import {
  CalendarClockIcon,
  UserSearchIcon,
  ClipboardPenIcon,
  BedDoubleIcon,
  ReceiptTextIcon,
} from "lucide-react";
import Image from "next/image";

import Registrations from "../../../../public/Registrations.jpg";
import Patients from "../../../../public/Patients.jpg";
import Prescriptions from "../../../../public/Prescriptions.jpg";
import Admissions from "../../../../public/Admissions.jpg";
import Bills from "../../../../public/Bills.jpg";

export const historyPages = [
  {
    Icon: CalendarClockIcon,
    name: "Registrations",
    description:
      "Streamline patient registration with quick and organized record-keeping.",
    href: "/dashboard/history/registrations",
    cta: "Registrations",
    background: (
      <Image
        width={200}
        height={200}
        placeholder="blur"
        loading="lazy"
        alt="Registrations"
        src={Registrations}
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
      <Image
        width={200}
        height={200}
        placeholder="blur"
        loading="lazy"
        alt="Patients"
        src={Patients}
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
      <Image
        width={200}
        height={200}
        placeholder="blur"
        loading="lazy"
        alt="Prescriptions"
        src={Prescriptions}
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
      <Image
        width={200}
        height={200}
        placeholder="blur"
        loading="lazy"
        alt="Admissions"
        src={Admissions}
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
      <Image
        width={200}
        height={200}
        placeholder="blur"
        loading="lazy"
        alt="Bills"
        src={Bills}
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
