"use client";
import React, { useState } from "react";
import Link from "next/link";

const AppointmentForm = () => {
  const [formData, setFormData] = useState({
    token: "",
    appointment_date: "",
    first_name: "",
    last_name: "",
    mobile_number: "",
    gender: "Male",
    age: "",
    street_address: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
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
                htmlFor="token"
                className="text-sm font-medium leading-6 text-gray-900 flex items-center"
              >
                Token number
              </label>
              <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                <input
                  type="number"
                  name="token"
                  id="token"
                  autoComplete="token"
                  value={formData.token}
                  onChange={handleInputChange}
                  className="form-input block flex-1 border-0 bg-transparent py-1 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 md:px-8">
              <label
                htmlFor="appointment_date"
                className="text-sm font-medium leading-6 text-gray-900 flex items-center"
              >
                Appointment date
              </label>
              <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                <input
                  type="date"
                  name="appointment_date"
                  id="appointment_date"
                  value={formData.appointment_date}
                  onChange={handleInputChange}
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
                className="text-sm font-medium leading-6 text-gray-900 flex items-center"
              >
                First name
              </label>
              <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  autoComplete="given-name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="form-input block flex-1 border-0 bg-transparent py-1 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 md:px-8">
              <label
                htmlFor="last_name"
                className="text-sm font-medium leading-6 text-gray-900 flex items-center"
              >
                Last name
              </label>
              <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                <input
                  type="text"
                  name="last_name"
                  id="last_name"
                  autoComplete="given-name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="form-input block flex-1 border-0 bg-transparent py-1 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 md:px-8">
              <label
                htmlFor="mobile_number"
                className="text-sm font-medium leading-6 text-gray-900 flex items-center"
              >
                Mobile number
              </label>
              <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                <input
                  type="tel"
                  name="mobile_number"
                  id="mobile_number"
                  autoComplete="given-name"
                  value={formData.mobile_number}
                  onChange={handleInputChange}
                  className="form-input block flex-1 border-0 bg-transparent py-1 pl-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
            <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 md:px-8">
              <label
                htmlFor="gender"
                className="text-sm font-medium leading-6 text-gray-900 flex items-center"
              >
                Gender
              </label>
              <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
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
                className="text-sm font-medium leading-6 text-gray-900 flex items-center"
              >
                Age
              </label>
              <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                <input
                  type="number"
                  name="age"
                  id="age"
                  autoComplete="age"
                  value={formData.age}
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
                  value={formData.street_address}
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
                  value={formData.city}
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
                  value={formData.state}
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
                  value={formData.zip}
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
          Save
        </button>
      </div>
    </form>
  );
};

export default AppointmentForm;
