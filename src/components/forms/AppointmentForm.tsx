import React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { RegisterPatientFormTypes } from "@/types/FormTypes";
import { DateTimePicker } from "../Appointment/DateTimePicker";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";
import { format, getTime, isSameDay, startOfDay } from "date-fns";
import { CircleCheckBig, RotateCcw, UserPlus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useOrganization } from "@clerk/nextjs";
import { Spinner } from "../ui/spinner";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface AppointmentFormProps {
  patientFormData: RegisterPatientFormTypes;
  setPatientFormData: React.Dispatch<
    React.SetStateAction<RegisterPatientFormTypes>
  >;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  submissionLoader: boolean;
  registerForDate: Date;
  setRegisterForDate: React.Dispatch<React.SetStateAction<Date>>;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  patientFormData,
  setPatientFormData,
  handleSubmit,
  submissionLoader,
  registerForDate,
  setRegisterForDate,
}) => {
  const { memberships } = useOrganization({
    memberships: {
      infinite: true,
      keepPreviousData: true,
      role: ["org:doctor", "org:clinic_head"],
    },
  });

  const handleInputChange = (e: { target: { name: string; value: any } }) => {
    const { name, value } = e.target;
    setPatientFormData({
      ...patientFormData,
      [name]: value,
    });
  };

  return (
    <form
      className="w-full px-2 sm:px-6 lg:px-8 mb-20 mt-2 sm:mt-6 2xl:flex 2xl:flex-row 2xl:gap-5 2xl:justify-center"
      onSubmit={handleSubmit}
      autoFocus={true}
      autoComplete="off"
    >
      {patientFormData.registered_date.length > 0 &&
        patientFormData.prescribed_date_time.length >= 0 && (
          <div className="mx-auto 2xl:mx-0 max-w-4xl 2xl:max-w-2xl border rounded-xl h-min 2xl:sticky top-2 sm:top-6 overflow-x-auto">
            <Timeline
              orientation="horizontal"
              className="pt-6 px-6 pb-6 2xl:pb-0 2xl:flex-col"
            >
              {patientFormData.registered_date
                .concat([getTime(registerForDate)])
                .sort((a, b) => b - a)
                .map((registered_date, index) => {
                  const isSameDate = isSameDay(
                    registered_date,
                    registerForDate
                  );
                  const attendedStatus =
                    patientFormData.prescribed_date_time.some(
                      (prescribed_date_time) =>
                        registered_date ===
                        getTime(startOfDay(prescribed_date_time))
                    ) || false;
                  return (
                    <TimelineItem key={index} className="2xl:flex-row">
                      <TimelineSeparator className="2xl:flex-col">
                        <TimelineDot className="2xl:mt-1">
                          {isSameDate ? (
                            <Spinner size="sm" />
                          ) : attendedStatus ? (
                            <CircleCheckBig className="text-green-500" />
                          ) : (
                            <UserPlus />
                          )}
                        </TimelineDot>
                        <TimelineConnector
                          className="2xl:my-2 2xl:w-0.5"
                          hidden={
                            index + 1 ===
                            patientFormData.registered_date.length + 1
                          }
                        />
                      </TimelineSeparator>
                      <TimelineContent className="2xl:pb-7 2xl:first:text-right 2xl:last:text-left">
                        <TimelineTitle
                          className={`${
                            attendedStatus ? "text-green-500" : ""
                          } whitespace-nowrap`}
                        >
                          {isSameDate
                            ? "Currently viewing"
                            : attendedStatus
                            ? "Attended"
                            : "Registered"}
                        </TimelineTitle>
                        <TimelineDescription className="whitespace-nowrap">
                          {isSameDate
                            ? "Registering for"
                            : attendedStatus
                            ? "Attended on"
                            : "Registered for"}{" "}
                          {format(registered_date, "do MMM yyyy")}
                        </TimelineDescription>
                      </TimelineContent>
                    </TimelineItem>
                  );
                })}
            </Timeline>
          </div>
        )}
      <fieldset
        disabled={submissionLoader}
        className="mx-auto mt-2 sm:mt-5 2xl:mt-0 w-full 2xl:mx-0 max-w-4xl bg-card border rounded-xl pt-3 md:pt-6 "
      >
        {/* token selection form */}
        <div className="px-4 md:px-8">
          <h3 className="text-base font-semibold leading-7 ">Appointment</h3>
          <p className="max-w-2xl text-sm leading-6 text-gray-500">
            Instant appointment or schedule on date
          </p>
        </div>
        <div className="py-2 md:py-0 mt-3 md:mt-6 border-t border-b">
          <div className="px-4 py-2 md:py-6 md:grid md:grid-cols-3 md:gap-2 md:px-8 space-y-2 md:space-y-0">
            <Label htmlFor="patient_id">
              Patient ID<p className="text-red-500">*</p>
            </Label>
            <Input
              required
              disabled
              type="text"
              name="patient_id"
              id="patient_id"
              value={patientFormData.patient_id}
              onChange={handleInputChange}
              className="col-span-2 disabled:cursor-not-allowed w-full md:max-w-md lg:col-span-2"
            />
          </div>
          <div className="px-4 py-2 md:py-6 md:grid md:grid-cols-3 md:gap-4 md:px-8 space-y-2 md:space-y-0">
            <Label htmlFor="last_visited">
              Appointment date
              {/* <p className="text-red-500">*</p> */}
              <Button
                type="button"
                onClick={() => {
                  setRegisterForDate(new Date());
                }}
                variant={"ghost"}
                className="rounded-full p-0 size-3 aspect-square"
              >
                <RotateCcw />
              </Button>
            </Label>
            <DateTimePicker
              registered_date={patientFormData.registered_date}
              date={registerForDate}
              setDate={setRegisterForDate}
            />
          </div>
          <div className="px-4 py-2 md:py-6 md:grid md:grid-cols-3 sm:gap-4 md:px-8 space-y-2 md:space-y-0">
            <Label htmlFor="registerd_for">
              Doctor<p className="text-red-500">*</p>
            </Label>
            <Select
              aria-hidden={false}
              required
              name="registerd_for"
              onValueChange={(val) => {
                const member = memberships?.data?.find(
                  (mem) => mem.publicUserData?.userId === val
                );

                if (member && member.publicUserData?.userId) {
                  const {
                    userId,
                    firstName = "",
                    lastName = "",
                    identifier,
                  } = member.publicUserData;

                  const fullName = [firstName, lastName]
                    .filter(Boolean)
                    .join(" ");
                  const selectedMember = {
                    id: userId,
                    name: fullName,
                    email: identifier,
                  };

                  handleInputChange({
                    target: { name: "registerd_for", value: selectedMember },
                  });
                }
              }}
            >
              <SelectTrigger
                autoFocus={true}
                id="registerd_for"
                className="w-full md:max-w-md lg:col-span-2"
              >
                <SelectValue placeholder="Doctor" />
              </SelectTrigger>
              <SelectContent>
                {memberships &&
                  memberships.data?.map((member, index) =>
                    member.publicUserData?.userId ? (
                      <SelectItem
                        value={member.publicUserData.userId}
                        key={index}
                      >
                        {[
                          member.publicUserData.firstName,
                          member.publicUserData.lastName,
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      </SelectItem>
                    ) : (
                      <></>
                    )
                  )}
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* personal information form */}
        <div className="px-4 mt-3 md:mt-6 md:px-8">
          <h3 className="text-base font-semibold leading-7 ">
            Personal Information
          </h3>
          <p className="max-w-2xl text-sm leading-6 text-gray-500">
            Please use WhatsApp number where you get the reports
          </p>
        </div>
        <div className="py-2 md:py-0 mt-3 md:mt-6 border-t border-b">
          <div className="px-4 py-2 md:py-6 md:grid md:grid-cols-3 sm:gap-4 md:px-8 space-y-2 md:space-y-0">
            <Label htmlFor="name">
              Full name<p className="text-red-500">*</p>
            </Label>
            <Input
              required
              type="text"
              name="name"
              id="name"
              autoComplete="new-off"
              placeholder="patient name"
              value={patientFormData.name.toLowerCase()}
              onChange={handleInputChange}
              className="col-span-2 w-full md:max-w-md lg:col-span-2"
            />
          </div>
          <div className="px-4 py-2 md:py-6 md:grid md:grid-cols-3 sm:gap-4 md:px-8 space-y-2 md:space-y-0">
            <Label htmlFor="mobile">
              Mobile number<p className="text-red-500">*</p>
            </Label>
            <Input
              required
              type="tel"
              name="mobile"
              placeholder="contact number"
              id="mobile"
              autoComplete="new-off"
              value={patientFormData.mobile}
              onChange={handleInputChange}
              pattern="^\d{10}$" // Adjust the pattern to match the format you want
              title="Please enter a valid 10-digit mobile number."
              maxLength={10}
              className="col-span-2 w-full md:max-w-md lg:col-span-2"
            />
          </div>
          <div className="px-4 py-2 md:py-6 md:grid md:grid-cols-3 sm:gap-4 md:px-8 space-y-2 md:space-y-0">
            <Label htmlFor="gender">
              Gender<p className="text-red-500">*</p>
            </Label>
            <Select
              required
              name="gender"
              value={patientFormData.gender}
              onValueChange={(val) => {
                handleInputChange({ target: { name: "gender", value: val } });
              }}
            >
              <SelectTrigger
                id="gender"
                className="col-span-2 w-full md:max-w-md lg:col-span-2"
              >
                <SelectValue placeholder="gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="px-4 py-2 md:py-6 md:grid md:grid-cols-3 sm:gap-4 md:px-8 space-y-2 md:space-y-0">
            <Label htmlFor="age">
              Age<p className="text-red-500">*</p>
            </Label>
            <Input
              required
              type="number"
              name="age"
              placeholder="patient age"
              id="age"
              autoComplete="new-off"
              value={patientFormData.age}
              onChange={handleInputChange}
              className="col-span-2 w-full md:max-w-md lg:col-span-2"
            />
          </div>
        </div>
        {/* Address information form */}
        <div className="px-4 mt-3 md:mt-6 md:px-8">
          <h3 className="text-base font-semibold leading-7 ">
            Address Information
          </h3>
          <p className="max-w-2xl text-sm leading-6 text-gray-500">
            Please Specify full patient address
          </p>
        </div>
        <div className="py-2 md:py-0 mt-3 md:mt-6 border-t">
          <div className="px-4 py-2 md:py-6 md:grid md:grid-cols-3 sm:gap-4 md:px-8 space-y-2 md:space-y-0">
            <Label htmlFor="street_address">Street address</Label>
            <Input
              type="text"
              name="street_address"
              placeholder="street address"
              id="street_address"
              autoComplete="new-off"
              value={patientFormData.street_address}
              onChange={handleInputChange}
              className="col-span-2 w-full md:max-w-md lg:col-span-2"
            />
          </div>
          <div className="px-4 py-2 md:py-6 md:grid md:grid-cols-3 sm:gap-4 md:px-8 space-y-2 md:space-y-0">
            <Label htmlFor="city">City</Label>
            <Input
              type="text"
              name="city"
              placeholder="patient city"
              id="city"
              autoComplete="new-off"
              value={patientFormData.city}
              onChange={handleInputChange}
              className="col-span-2 w-full md:max-w-md lg:col-span-2"
            />
          </div>
          <div className="px-4 py-2 md:py-6 md:grid md:grid-cols-3 sm:gap-4 md:px-8 space-y-2 md:space-y-0">
            <Label htmlFor="state">State / Province</Label>
            <Input
              type="text"
              name="state"
              placeholder="patient state"
              id="state"
              autoComplete="new-off"
              value={patientFormData.state}
              onChange={handleInputChange}
              className="col-span-2 w-full md:max-w-md lg:col-span-2"
            />
          </div>
          <div className="px-4 py-2 md:py-6 md:grid md:grid-cols-3 sm:gap-4 md:px-8 space-y-2 md:space-y-0">
            <Label htmlFor="zip">Pin code</Label>
            <Input
              type="text"
              name="zip"
              placeholder="pincode"
              id="zip"
              value={patientFormData.zip}
              onChange={handleInputChange}
              pattern="^\d{6}$" // Adjust the pattern to match the format you want
              title="Please enter a valid 6-digit PIN code."
              maxLength={6}
              className="col-span-2 w-full md:max-w-md lg:col-span-2"
            />
          </div>
        </div>
      </fieldset>
      {/* submit-cancel buttons */}
      <div
        className="flex items-center justify-center gap-x-4 sm:gap-x-6 absolute 
      bg-clip-padding backdrop-filter backdrop-blur-sm
      bottom-0 py-2 border-t sm:py-3 left-0 right-0"
      >
        <Button variant={"destructive"} className="w-28 sm:w-32" asChild>
          <Link href={"./"} scroll={true} type="button">
            Cancel
          </Link>
        </Button>
        <Button
          className="w-28 sm:w-32"
          type="submit"
          loading={submissionLoader}
          loadingText="Registering"
          effect={"ringHover"}
          variant={"default"}
        >
          Register
        </Button>
      </div>
    </form>
  );
};

export default AppointmentForm;
