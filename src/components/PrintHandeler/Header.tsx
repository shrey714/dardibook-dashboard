import React from "react";
import { useOrganization } from "@clerk/nextjs";
import {
  GraduationCapIcon,
  MapPinIcon,
  PencilLineIcon,
  PhoneIcon,
  UserRoundPlusIcon,
} from "lucide-react";

const Header = () => {
  const { organization } = useOrganization();

  return (
    <header className="w-full border-b border-gray-300 pb-4 mb-4 flex justify-between items-start px-6 print:px-0">
      {/* Logo */}
      <div className="flex-shrink-0">
        {organization?.imageUrl ? (
          <img
            src={organization.imageUrl}
            alt={`${organization?.name || "Clinic"} Logo`}
            className="w-28 h-auto object-contain"
          />
        ) : (
          <div className="w-28 h-16 bg-gray-200 flex items-center justify-center text-gray-400 text-sm"></div>
        )}
      </div>

      {/* Organization details */}
      <div className="text-left max-w-xs leading-relaxed space-y-1">
        <h1 className="text-3xl font-bold text-gray-900">
          {organization?.name || "Clinic Name"}
        </h1>
        <div className="flex items-center justify-start space-x-2 text-gray-600 text-sm">
          <UserRoundPlusIcon className="size-3 text-gray-500" />
          <span>
            {(organization?.publicMetadata?.doctorName as string) || "N/A"}
          </span>
        </div>
        <div className="flex items-center justify-start space-x-2 text-gray-600 text-sm">
          <GraduationCapIcon className="size-3 text-gray-500" />
          <span>
            {(organization?.publicMetadata?.degree as string) || "N/A"}
          </span>
        </div>
        <div className="flex items-center justify-start space-x-2 text-gray-600 text-sm">
          <PhoneIcon className="size-3 text-gray-500" />
          <span>
            {(organization?.publicMetadata?.clinicNumber as string) || "N/A"}
          </span>
        </div>
        <div className="flex items-center justify-start space-x-2 text-gray-600 text-sm">
          <MapPinIcon className="size-3 text-gray-500" />
          <span>
            {(organization?.publicMetadata?.clinicAddress as string) || "N/A"}
          </span>
        </div>
        <div className="flex items-center justify-start space-x-2 text-gray-600 text-sm mt-2 italic">
          <PencilLineIcon className="size-3 text-gray-500" />
          <span>
            {(organization?.publicMetadata?.registrationNumber as string) ||
              "N/A"}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
