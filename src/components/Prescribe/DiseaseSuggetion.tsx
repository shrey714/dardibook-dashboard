import React, { useCallback } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import AsyncCreatableSelect from "react-select/async-creatable";
import { db } from "@/firebase/firebaseConfig";
import uniqid from "uniqid";
import { useAuth } from "@clerk/nextjs";
import { MedicinesDetails } from "@/types/FormTypes";
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
//     backgroundColor: "transparent", // Matches your input background color
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
//     color: "hsl(var(--text-primary))",
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
//     // color: "#111827", // Matches text-gray-900
//   }),
//   clearIndicator: (provided: any) => ({
//     ...provided,
//     padding: 0, // Matches text-gray-900
//   }),
// };

interface DiseaseSuggetionProps {
  required: boolean;
  diseaseValue: string;
  diseaseId: string;
  medicines: MedicinesDetails[];
  handleDiseaseComingData: (data: {
    diseaseId: string;
    diseaseDetail: string;
  }) => void;
  handleInputChange: (
    event:
      | React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
      | { target: { name: string; value: MedicinesDetails[] } }
  ) => void;
  setmedicinesLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const DiseaseSuggetion: React.FC<DiseaseSuggetionProps> = ({
  required,
  diseaseValue,
  diseaseId,
  medicines,
  handleDiseaseComingData,
  handleInputChange,
  setmedicinesLoading,
}) => {
  const { orgId } = useAuth();
  // Function to load options based on user input
  const loadOptions = useCallback(
    async (inputValue: string) => {
      if (!inputValue || inputValue.length < 3) {
        return [];
      }

      try {
        // Firestore query to get medicine suggestions
        const diseaseRef = collection(db, "doctor", orgId || "", "diseaseData");
        const q = query(
          diseaseRef,
          where("searchableString", ">=", inputValue.toLowerCase()),
          where("searchableString", "<=", inputValue.toLowerCase() + "\uf8ff")
        );
        const querySnapshot = await getDocs(q);

        const fetchedSuggestions = querySnapshot.docs.map((doc) => ({
          label: doc.data().diseaseDetail, // Setting the label for react-select
          value: doc.data().diseaseDetail, // Setting the value for react-select
          diseaseId: doc.data().diseaseId,
          medicines: doc.data().medicines,
        }));

        return fetchedSuggestions;
      } catch (error) {
        console.error("Search error:", error);
        return [];
      }
    },
    [orgId]
  );

  const handleChange = async (selectedOption: {
    label: string;
    value: string;
    diseaseId: string;
    medicines: MedicinesDetails[];
  }) => {
    handleDiseaseComingData({
      diseaseDetail: selectedOption?.value,
      diseaseId: selectedOption?.diseaseId,
    });

    if (selectedOption?.medicines && selectedOption?.medicines?.length > 0) {
      const tempObject = {
        dosages: {
          morning: "",
          afternoon: "",
          evening: "",
          night: "",
        },
        duration: 1,
        durationType: "day",
      };
      try {
        setmedicinesLoading(true);
        const collectionRef = collection(
          db,
          "doctor",
          orgId || "",
          "medicinesData"
        );
        const q = query(
          collectionRef,
          where("__name__", "in", selectedOption.medicines)
        );

        const querySnapshot = await getDocs(q);
        const documents = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: data.id,
            instruction: data.instruction,
            medicineName: data.medicineName,
            type: data.type,
            ...tempObject,
          };
        });

        handleInputChange({
          target: {
            name: "medicines",
            value: documents,
          },
        });
        setmedicinesLoading(false);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    } else {
      handleInputChange({
        target: {
          name: "medicines",
          value: [
            {
              id: uniqid(),
              medicineName: "",
              instruction: "",
              dosages: {
                morning: "",
                afternoon: "",
                evening: "",
                night: "",
              },
              duration: 1,
              durationType: "day",
              type: "",
            },
          ],
        },
      });
    }
  };

  return (
    <div>
      <AsyncCreatableSelect
        className="w-full"
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
          diseaseValue
            ? {
                label: diseaseValue,
                value: diseaseValue,
                diseaseId: diseaseId,
                medicines: medicines,
              }
            : null
        }
        placeholder="Search.."
        onCreateOption={(selectedOption) => {
          handleDiseaseComingData({
            diseaseDetail: selectedOption,
            diseaseId: uniqid(),
          });
          handleInputChange({
            target: {
              name: "medicines",
              value: [
                {
                  id: uniqid(),
                  medicineName: "",
                  instruction: "",
                  dosages: {
                    morning: "",
                    afternoon: "",
                    evening: "",
                    night: "",
                  },
                  duration: 1,
                  durationType: "day",
                  type: "",
                },
              ],
            },
          });
        }}
        components={customComponents}
        isClearable
        required={required}
        autoFocus={true}
        classNames={{
          control: (state) =>
            `!shadow-sm !transition-all !duration-900 !rounded-md !bg-transparent dark:!bg-input/30 ${
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

export default DiseaseSuggetion;
