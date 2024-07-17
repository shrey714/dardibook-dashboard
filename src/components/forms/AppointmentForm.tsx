import React from "react";
import Link from "next/link";
interface PatientFormData {
  last_visited: number;
  patient_unique_Id: string;
  first_name: string;
  last_name: string;
  mobile_number: string;
  gender: string;
  age: string;
  street_address: string;
  city: string;
  state: string;
  zip: string;
}

interface AppointmentFormProps {
  patientFormData: PatientFormData;
  setPatientFormData: React.Dispatch<React.SetStateAction<PatientFormData>>;
  handleSubmit: any;
  submissionLoader: boolean;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  patientFormData,
  setPatientFormData,
  handleSubmit,
  submissionLoader,
}) => {
  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setPatientFormData({
      ...patientFormData,
      [name]: value,
    });
  };

  return (
    <form
      className="px-4 sm:px-6 lg:px-8"
      onSubmit={handleSubmit}
      autoFocus={true}
      autoComplete="off"
    >
      <fieldset disabled={submissionLoader}>
        <div className="mx-auto max-w-4xl bg-white rounded-lg pt-6 pb-3">
          {/* token selection form */}
          <div className="px-4 md:px-8">
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              Appointment
            </h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              Instant appointment or schedule on date
            </p>
          </div>
          <div className="mt-6 border-t border-b border-gray-900/10">
            <dl className="divide-y divide-gray-900/10">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 md:px-8">
                <label
                  htmlFor="patient_unique_Id"
                  className="text-sm font-medium leading-6 text-gray-900 flex items-center gap-1"
                >
                  Patient ID<p className="text-red-500">*</p>
                </label>
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    required
                    disabled
                    type="text"
                    name="patient_unique_Id"
                    id="patient_unique_Id"
                    autoComplete="given-name"
                    value={patientFormData.patient_unique_Id}
                    onChange={handleInputChange}
                    className="form-input block flex-1 border-0 bg-transparent py-1 pl-2 text-gray-500 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 md:px-8">
                <label
                  htmlFor="last_visited"
                  className="text-sm font-medium leading-6 text-gray-900 flex items-center gap-1"
                >
                  Appointment date for <p className="text-red-500">*</p>
                </label>
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    required
                    type="date"
                    name="last_visited"
                    id="last_visited"
                    // min={new Date().toISOString().split("T")[0]}
                    value={
                      new Date(patientFormData.last_visited)
                        .toISOString()
                        .split("T")[0]
                    }
                    onChange={(e) => {
                      let getValue =
                        e.target.value === ""
                          ? new Date().toISOString().split("T")[0]
                          : e.target.value;

                      const currentTime = new Date();
                      const [year, month, day] = getValue
                        .split("-")
                        .map(Number);
                      const dateTime = new Date(
                        year,
                        month - 1,
                        day,
                        currentTime.getHours(),
                        currentTime.getMinutes(),
                        currentTime.getSeconds()
                      );
                      handleInputChange({
                        target: {
                          name: e.target.name,
                          value: dateTime.getTime(),
                        },
                      });
                    }}
                    className="form-input block flex-1 border-0 bg-transparent py-1 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </dl>
          </div>
          {/* personal information form */}
          <div className="px-4 mt-6 md:px-8">
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              Personal Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              Please use WhatsApp number where you get the reports
            </p>
          </div>
          <div className="mt-6 border-t border-b border-gray-900/10">
            <dl className="divide-y divide-gray-900/10">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 md:px-8">
                <label
                  htmlFor="first_name"
                  className="text-sm font-medium leading-6 text-gray-900 flex items-center gap-1"
                >
                  First name<p className="text-red-500">*</p>
                </label>
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                  autoFocus={true}
                    required
                    type="text"
                    name="first_name"
                    id="first_name"
                    autoComplete="given-name"
                    value={patientFormData.first_name}
                    onChange={handleInputChange}
                    className="form-input block flex-1 border-0 bg-transparent py-1 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 md:px-8">
                <label
                  htmlFor="last_name"
                  className="text-sm font-medium leading-6 text-gray-900 flex items-center gap-1"
                >
                  Last name<p className="text-red-500">*</p>
                </label>
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    required
                    type="text"
                    name="last_name"
                    id="last_name"
                    autoComplete="given-name"
                    value={patientFormData.last_name}
                    onChange={handleInputChange}
                    className="form-input block flex-1 border-0 bg-transparent py-1 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 md:px-8">
                <label
                  htmlFor="mobile_number"
                  className="text-sm font-medium leading-6 text-gray-900 flex items-center gap-1"
                >
                  Mobile number<p className="text-red-500">*</p>
                </label>
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    required
                    type="tel"
                    name="mobile_number"
                    id="mobile_number"
                    autoComplete="given-name"
                    value={patientFormData.mobile_number}
                    onChange={handleInputChange}
                    className="form-input block flex-1 border-0 bg-transparent py-1 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 md:px-8">
                <label
                  htmlFor="gender"
                  className="text-sm font-medium leading-6 text-gray-900 flex items-center gap-1"
                >
                  Gender<p className="text-red-500">*</p>
                </label>
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <select
                    required
                    id="gender"
                    name="gender"
                    value={patientFormData.gender}
                    onChange={handleInputChange}
                    autoComplete="gender-name"
                    className="form-input block w-full rounded-md border-0 py-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 md:px-8">
                <label
                  htmlFor="age"
                  className="text-sm font-medium leading-6 text-gray-900 flex items-center gap-1"
                >
                  Age<p className="text-red-500">*</p>
                </label>
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    required
                    type="number"
                    name="age"
                    id="age"
                    autoComplete="age"
                    value={patientFormData.age}
                    onChange={handleInputChange}
                    className="form-input block flex-1 border-0 bg-transparent py-1 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </dl>
          </div>
          {/* Address information form */}
          <div className="px-4 mt-6 md:px-8">
            <h3 className="text-base font-semibold leading-7 text-gray-900">
              Address Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
              Please Specify full patient address
            </p>
          </div>
          <div className="mt-6 border-t border-gray-900/10">
            <dl className="divide-y divide-gray-900/10">
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 md:px-8">
                <label
                  htmlFor="street_address"
                  className="text-sm font-medium leading-6 text-gray-900 flex items-center"
                >
                  Street address
                </label>
                <div className="sm:col-span-2 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="street_address"
                    id="street_address"
                    autoComplete="street-address"
                    value={patientFormData.street_address}
                    onChange={handleInputChange}
                    className="form-input block w-full flex-1 border-0 bg-transparent py-1 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 md:px-8">
                <label
                  htmlFor="city"
                  className="text-sm font-medium leading-6 text-gray-900 flex items-center"
                >
                  City
                </label>
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="city"
                    id="city"
                    autoComplete="city"
                    value={patientFormData.city}
                    onChange={handleInputChange}
                    className="form-input block w-full flex-1 border-0 bg-transparent py-1 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 md:px-8">
                <label
                  htmlFor="state"
                  className="text-sm font-medium leading-6 text-gray-900 flex items-center"
                >
                  State / Province
                </label>
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="state"
                    id="state"
                    autoComplete="state"
                    value={patientFormData.state}
                    onChange={handleInputChange}
                    className="form-input block w-full flex-1 border-0 bg-transparent py-1 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 md:px-8">
                <label
                  htmlFor="zip"
                  className="text-sm font-medium leading-6 text-gray-900 flex items-center"
                >
                  ZIP / Postal code
                </label>
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="zip"
                    id="zip"
                    autoComplete="zip"
                    value={patientFormData.zip}
                    onChange={handleInputChange}
                    className="form-input block w-full flex-1 border-0 bg-transparent py-1 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </dl>
          </div>
        </div>
        {/* submit-cancel buttons */}
        <div className="mt-6 flex items-center justify-center gap-x-6">
          <Link
            href={"./"}
            scroll={true}
            type="button"
            className="btn md:btn-wide text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="btn md:btn-wide rounded-md bg-indigo-600 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {submissionLoader ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Save"
            )}
          </button>
        </div>
      </fieldset>
    </form>
  );
};

export default AppointmentForm;
