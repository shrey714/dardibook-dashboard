import React, { useCallback } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import AsyncCreatableSelect from "react-select/async-creatable";
import { db } from "@/firebase/firebaseConfig";
import uniqid from "uniqid";
import { useAuth } from "@clerk/nextjs";

// Custom components to hide the dropdown arrow
const customComponents = {
  DropdownIndicator: () => null,
  IndicatorSeparator: () => null,
};

// const customStyles = {
//   control: (provided: any, state: any) => ({
//     ...provided,
//     padding: "0.375rem 0.75rem", // Matches your form-input padding
//     borderRadius: "0.375rem", // Matches your rounded-md class
//     border: "none",
//     minHeight: "auto",
//     // boxShadow: "none",
//     backgroundColor: "white", // Matches your input background color
//     fontSize: "0.875rem", // Matches sm:text-sm class
//     lineHeight: "1.25rem", // Matches sm:leading-6 class
//     boxShadow: state.isFocused ? "0 0 0 2px #6366f1" : "0 0 0 1px #d1d5db", // Matches ring-1 and ring-gray-300 classes
//     "&:hover": {
//       // boxShadow: "none", // Matches focus:ring-indigo-600 class
//     },
//   }),
//   input: (provided: any) => ({
//     ...provided,
//     margin: 0,
//     padding: 0,
//   }),
//   placeholder: (provided: any) => ({
//     ...provided,
//     color: "#9ca3af", // Matches placeholder:text-gray-400 class
//   }),
//   menu: (provided: any) => ({
//     ...provided,
//     marginTop: "0.25rem", // Matches mt-1 class
//     borderRadius: "0.375rem", // Matches rounded-lg class
//     boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)", // Matches shadow class
//     zIndex: 9999, // Ensures the dropdown stays on top
//   }),
//   option: (provided: any, state: any) => ({
//     ...provided,
//     backgroundColor: state.isFocused ? "#e5e7eb" : "#f3f4f6", // Matches bg-gray-300 and bg-gray-400
//     color: "#1f2937", // Matches text-gray-800
//     padding: "0.5rem 1rem", // Matches py-1 class
//     cursor: "pointer",
//   }),
//   singleValue: (provided: any) => ({
//     ...provided,
//     color: "#111827", // Matches text-gray-900
//   }),
//   clearIndicator: (provided: any) => ({
//     ...provided,
//     padding: 0, // Matches text-gray-900
//   }),
// };

interface MedicineSuggetionProps {
  medicine: string;
  rowId: string;
  handleComingData: (
    rowId: string,
    selectedOption: {
      value: string;
      type: string;
      instruction: string;
      id: string;
    }
  ) => void;
}

const MedicineSuggestion: React.FC<MedicineSuggetionProps> = ({
  medicine,
  rowId,
  handleComingData,
}) => {
  const { orgId } = useAuth();

  const loadOptions = useCallback(
    async (inputValue: string) => {
      if (!inputValue || inputValue.length < 3) {
        return [];
      }

      try {
        // Firestore query to get medicine suggestions
        const medicinesRef = collection(
          db,
          "doctor",
          orgId || "",
          "medicinesData"
        );
        const q = query(
          medicinesRef,
          where("searchableString", ">=", inputValue.toLowerCase()),
          where("searchableString", "<=", inputValue.toLowerCase() + "\uf8ff")
        );
        const querySnapshot = await getDocs(q);

        const fetchedSuggestions = querySnapshot.docs.map((doc) => ({
          label: doc.data().medicineName, // Setting the label for react-select
          value: doc.data().medicineName, // Setting the value for react-select
          instruction: doc.data().instruction,
          type: doc.data().type,
          id: doc.data().id,
        }));

        return fetchedSuggestions;
      } catch (error) {
        console.error("Search error:", error);
        return [];
      }
    },
    [orgId]
  );

  const handleChange = (selectedOption: {
    label: string;
    value: string;
    instruction: string;
    type: string;
    id: string;
  }) => {
    handleComingData(rowId, selectedOption);
  };

  return (
    <div>
      <AsyncCreatableSelect
        required={true}
        className="w-60 text-start bg-transparent"
        backspaceRemovesValue={true}
        cacheOptions
        defaultOptions
        loadOptions={loadOptions}
        onChange={(value) => {
          if (value) {
            handleChange(value);
          }
        }}
        value={
          medicine
            ? {
                label: medicine,
                value: medicine,
                instruction: "",
                type: "",
                id: "",
              }
            : null
        }
        placeholder="Search.."
        components={customComponents}
        onCreateOption={(selectedOption) => {
          handleComingData(rowId, {
            value: selectedOption,
            type: "",
            instruction: "",
            id: uniqid(),
          });
        }}
        // styles={customStyles}
        isClearable
        classNames={{
          control: (state) =>
            `!shadow-sm !transition-all !duration-900 !rounded-md !h-9 !min-h-9 !bg-transparent dark:!bg-input/30 ${
              state.isFocused
                ? "!border-ring !ring-ring/50 !ring-[3px]"
                : "!border-border"
            }   
            `,
          placeholder: () =>
            "!truncate !text-sm sm:!text-base !px-4 !text-muted-foreground",
          singleValue: () => "!text-inherit !px-4",
          input: () => "!text-inherit !px-4",
          menu: () =>
            `!border-border !overflow-hidden !shadow-md !text-black !w-full !bg-popover !border !text-primary`,
          menuList: () => "!py-1 md:!py-2",
          option: (state) =>
            `bg-background p-2 border-0 text-base hover:cursor-pointer ${
              state.isFocused && !state.isSelected ? "!bg-secondary" : ""
            } ${state.isSelected ? "" : "hover:!bg-secondary"}`,
        }}
      />
    </div>
  );
};

export default MedicineSuggestion;
