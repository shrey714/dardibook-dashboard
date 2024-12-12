import React, { useEffect, useState } from "react";
import PrintHandeler from "../PrintForms/PrintHandeler";
import { Button } from "../ui/button";

const PrintModal = ({
  setIsModalOpen,
  patientData,
  prescriptionsData,
  doctorData,
}: any) => {
  const [currentPrescription, setcurrentPrescription] = useState(
    prescriptionsData?.slice(-1)[0]
  );
  const [printOptions, setprintOptions] = useState({
    IsPrescription: prescriptionsData?.slice(-1)[0]?.diseaseDetail
      ? true
      : false,
    IsRefer: prescriptionsData?.slice(-1)[0]?.refer?.hospitalName
      ? true
      : false,
  });
  useEffect(() => {
    setprintOptions({
      IsPrescription: currentPrescription?.diseaseDetail ? true : false,
      IsRefer: currentPrescription?.refer?.hospitalName ? true : false,
    });
    // console.log("currentPrescription===", currentPrescription);
  }, [currentPrescription]);

  return (
    <>
      <div className="flex flex-col">
        <h3 className="mb-4 font-semibold">
          Please select the Prescription date :
        </h3>
        <ul className="text-sm font-medium border-2 rounded-lg">
          {prescriptionsData?.map((pres: any, key: number) => (
            <li
              key={key}
              className={`w-full ${
                key === prescriptionsData?.length - 1 ? "" : "border-b"
              } border-border rounded-t-lg`}
            >
              <div className="flex items-center ps-4">
                <input
                  type="radio"
                  id={`key-id-${key}`}
                  name="date-picker"
                  className="border-2"
                  defaultChecked={
                    key === prescriptionsData?.length - 1 ? true : false
                  }
                  onChange={() => {
                    setcurrentPrescription(pres);
                  }}
                />
                <label
                  htmlFor={`key-id-${key}`}
                  className="w-full py-3 pl-4 text-sm font-medium"
                >
                  {new Date(pres?.time).toLocaleDateString("en-GB")}
                </label>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex sm:items-end gap-y-3 gap-x-4 flex-col-reverse sm:flex-row">
        <Button
          type="button"
          onClick={() => setIsModalOpen(false)}
          variant={"outline"}
          className="flex flex-1 text-sm font-semibold leading-6"
        >
          Cancel
        </Button>
        <div className="flex flex-1 flex-col border rounded-md w-full">
          <div className="flex items-center ps-4">
            <input
              id="Prescription"
              type="checkbox"
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              checked={printOptions.IsPrescription}
              onChange={(e) =>
                setprintOptions({
                  IsPrescription: e.target.checked,
                  IsRefer: printOptions.IsRefer,
                })
              }
            />
            <label
              htmlFor="Prescription"
              className="w-full py-2 ms-2 text-xs font-medium"
            >
              Prescription Report
            </label>
          </div>
          <div className="flex items-center ps-4 border-t">
            <input
              id="Refer"
              type="checkbox"
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              checked={printOptions.IsRefer}
              onChange={(e) =>
                setprintOptions({
                  IsPrescription: printOptions.IsPrescription,
                  IsRefer: e.target.checked,
                })
              }
            />
            <label
              htmlFor="Refer"
              className="w-full py-2 ms-2 text-xs font-medium"
            >
              Refer Report
            </label>
          </div>
          <PrintHandeler
            styleForBtn={"bg-primary"}
            printOptions={printOptions}
            PrescriptionAndReferData={currentPrescription}
            patientData={patientData}
            doctorData={doctorData}
          />
        </div>
      </div>
    </>
  );
};

export default PrintModal;
