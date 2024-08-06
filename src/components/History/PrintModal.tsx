import React, { useEffect, useState } from "react";
import PrintHandeler from "../PrintForms/PrintHandeler";

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
        <h3 className="mb-4 font-semibold text-gray-900">
          Please select the Prescription date :
        </h3>
        <ul className="text-sm font-medium text-gray-900 border border-gray-200 rounded-lg bg-gray-300">
          {prescriptionsData?.map((pres: any, key: number) => (
            <li
              key={key}
              className={`w-full ${
                key === prescriptionsData?.length - 1 ? "" : "border-b"
              } border-gray-200 rounded-t-lg`}
            >
              <div className="flex items-center ps-4">
                <input
                  type="radio"
                  id={`key-id-${key}`}
                  name="date-picker"
                  className="radio border-2 radio-[#ADADAD]"
                  defaultChecked={
                    key === prescriptionsData?.length - 1 ? true : false
                  }
                  onChange={() => {
                    setcurrentPrescription(pres);
                  }}
                />
                <label
                  htmlFor={`key-id-${key}`}
                  className="w-full py-3 pl-4 text-sm font-medium text-gray-900"
                >
                  {new Date(pres?.time).toLocaleDateString("en-GB")}
                </label>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 flex sm:items-end gap-y-3 gap-x-4 flex-col-reverse sm:flex-row">
        <button
          type="button"
          onClick={() => setIsModalOpen(false)}
          className="flex animate-none flex-1 btn btn-outline text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </button>
        <div className="join join-vertical flex flex-1">
          <div className="join-item bg-gray-300">
            <div className="join-item flex items-center ps-4 border">
              <input
                id="Prescription"
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
                className="w-full py-2 ms-2 text-xs font-medium text-gray-500"
              >
                Prescription Report
              </label>
            </div>
            <div className="join-item flex items-center ps-4 border border-t-0">
              <input
                id="Refer"
                type="checkbox"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
                className="w-full py-2 ms-2 text-xs font-medium text-gray-500"
              >
                Refer Report
              </label>
            </div>
          </div>
          <PrintHandeler
            styleForBtn={
              "flex flex-1 animate-none border-gray-200 btn border-gray-300 hover:border-gray-300 btn-success join-item text-sm font-semibold leading-6 text-white"
            }
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
