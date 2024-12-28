import React from "react";

const PatientHistoryData = ({ history }: any) => {
  return (
    <div className="mx-auto max-w-5xl">
      {/* Disease text area */}
      <div className="col-span-full p-4 px-8">
        <label
          htmlFor="diseaseDetail"
          className="block text-lg ext-base font-semibold leading-7 text-gray-900"
        >
          Disease and Diagnosis
        </label>
        <div className="mt-2">
          <textarea
            disabled
            readOnly
            id="diseaseDetail"
            name="diseaseDetail"
            rows={5}
            className="form-textarea resize-none block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={history?.diseaseDetail}
          />
        </div>
      </div>

      {/* Medicine list */}
      <div className="mt-6 col-span-full py-4">
        <label className="block px-8 text-lg ext-base font-semibold leading-7 text-gray-900">
          Medicines
        </label>

        <div className="container mx-auto pt-4 px-1 text-center">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Medicine Name</th>
                <th>Instruction</th>
                <th>Dosages</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {history?.medicines?.map((row: any) => (
                <tr key={row.id} className={`${row.id}`}>
                  <td className="align-top p-1">
                    <input
                      disabled
                      readOnly
                      type="text"
                      name="medicineName"
                      value={row.medicineName}
                      className="form-input w-full block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </td>
                  <td className="align-top p-1">
                    <input
                      disabled
                      readOnly
                      type="text"
                      name="instruction"
                      value={row.instruction}
                      className="form-input w-full block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </td>
                  <td className="align-top p-1 w-1/3">
                    {["morning", "afternoon", "evening", "night"].map(
                      (status) => {
                        const value = row?.dosages[status];
                        if (value) {
                          return (
                            <div
                              key={status}
                              className={`flex items-center mb-1`}
                            >
                              <input
                                disabled
                                readOnly
                                type="text"
                                value={`${
                                  status.charAt(0).toUpperCase() +
                                  status.slice(1)
                                }: ${value} ${row?.type || ""}`}
                                className="form-input w-full block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          );
                        }
                        return null;
                      }
                    )}
                  </td>
                  <td className="align-top p-1 flex flex-row items-center gap-2">
                    <input
                      disabled
                      readOnly
                      type="text"
                      name="duration"
                      value={`${row?.duration || ""}${" "}${
                        row.durationType
                          ? `${row.durationType}${row.duration > 1 ? "s" : ""}`
                          : ""
                      }`}
                      className="form-input w-full block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Advice or special instructions text area */}
      <div className="mt-6 col-span-full p-4 px-8">
        <label
          htmlFor="advice"
          className="block text-lg ext-base font-semibold leading-7 text-gray-900"
        >
          Advice or special instructions
        </label>
        <div className="mt-2">
          <textarea
            disabled
            readOnly
            id="advice"
            name="advice"
            rows={3}
            className="form-textarea resize-none block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            value={history?.advice}
          />
        </div>
        <div className="mt-6 mb-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <label
            htmlFor="nextVisit"
            className="text-lg font-semibold leading-7 text-gray-900 flex items-center"
          >
            Next visit date
          </label>
          <div className="flex mt-2 sm:mt-0 rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
            <input
              disabled
              readOnly
              type="date"
              name="nextVisit"
              id="nextVisit"
              className="form-input block flex-1 border-0 bg-transparent py-1 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              value={history.nextVisit}
            />
          </div>
        </div>
      </div>
      {/* Higher hospital Form */}
      <div className="mt-6 col-span-full px-8">
        <div className="pr-3 pl-0 text-lg font-semibold text-gray-900">
          Refer to higher hospital
        </div>

        <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
          <label
            htmlFor="hospitalName"
            className="text-sm font-medium leading-6 text-gray-900 flex items-center"
          >
            Hospital Name
          </label>
          <div className="sm:col-span-2 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
            <input
              type="text"
              disabled
              readOnly
              name="hospitalName"
              id="hospitalName"
              autoComplete="street-address"
              className="form-input block w-full flex-1 border-0 bg-transparent py-1 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              value={history?.refer?.hospitalName}
            />
          </div>
        </div>
        <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 border-t border-gray-900/10">
          <label
            htmlFor="doctorName"
            className="text-sm font-medium leading-6 text-gray-900 flex items-center"
          >
            Appointed Doctor Name
          </label>
          <div className="sm:col-span-2 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
            <input
              disabled
              readOnly
              type="text"
              name="doctorName"
              id="doctorName"
              autoComplete="street-address"
              className="form-input block w-full flex-1 border-0 bg-transparent py-1 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
              value={history?.refer?.doctorName}
            />
          </div>
        </div>
        <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 border-t border-gray-900/10">
          <label
            htmlFor="referMessage"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Refer message
          </label>
          <div className="sm:col-span-2 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
            <textarea
              disabled
              readOnly
              id="referMessage"
              name="referMessage"
              rows={3}
              className="form-textarea resize-none block w-full rounded-md flex-1 border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              value={history?.refer?.referMessage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientHistoryData;
