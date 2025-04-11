"use client";
import AppointmentForm from "@/components/forms/AppointmentForm";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import uniqid from "uniqid";
import { getPatientById } from "@/app/services/getPatientById";
import RegisteredModal from "@/components/Appointment/RegisteredModal";
import Loader from "@/components/common/Loader";
import { RegisterPatientFormTypes } from "@/types/FormTypes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@clerk/nextjs";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import toast from "react-hot-toast";
import { format, getTime, startOfDay } from "date-fns";
import { useUser } from "@clerk/nextjs";

const Page: React.FC = () => {
  const searchParams = useSearchParams();
  const { isLoaded, orgId } = useAuth();
  const { user } = useUser();
  const patientId = searchParams.get("patientId");
  const [formLoader, setFormLoader] = useState(true);
  const [uniqueId] = useState(patientId ? patientId : uniqid.time());
  const [error, setError] = useState<string | null>(null);
  const [patientFormData, setPatientFormData] =
    useState<RegisterPatientFormTypes>({
      patient_id: uniqueId,
      name: "",
      mobile: "",
      gender: "Male",
      age: "",
      street_address: "",
      city: "",
      state: "",
      zip: "",
      registered_date: [],
      registered_date_time: [],
      prescribed_date_time: [],
      bed_info: [],
      registerd_by: {
        id: "",
        name: "",
        email: "",
      },
      registerd_for: {
        id: "",
        name: "",
        email: "",
      },
    });
  const [registerForDate, setRegisterForDate] = useState<Date>(new Date());
  const [submissionLoader, setSubmissionLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getPatientData = async () => {
      if (isLoaded && orgId && patientId) {
        setFormLoader(true);
        const patientData = await getPatientById(patientId, orgId).catch(() => {
          setError("Something wrong with this patient.");
          setFormLoader(false);
        });
        if (patientData.data.registered_date) {
          (patientData.data as RegisterPatientFormTypes)?.registered_date.map(
            (registered_date) => {
              if (registered_date === getTime(startOfDay(new Date()))) {
                setError(
                  "Patient is already registed today. You can reschedule to other date."
                );
                return;
              } else if (registered_date > getTime(startOfDay(new Date()))) {
                setError(
                  `Patient is already registed for ${format(
                    new Date(registered_date),
                    "dd-MM-yyyy"
                  )}. You can reschedule it to today.`
                );
                return;
              }
            }
          );

          (patientData.data as RegisterPatientFormTypes)?.bed_info.map(
            (bed) => {
              if (
                bed.admission_at <= getTime(new Date()) &&
                bed.discharge_at >= getTime(new Date())
              ) {
                setError(
                  "Patient is already admitted in bed. No need to reigster patient again."
                );
                return;
              }
            }
          );

          setPatientFormData(patientData.data);
        } else {
          setError("No patient data available for the provided PatientID.");
        }
        setFormLoader(false);
      } else {
        setFormLoader(false);
      }
    };
    getPatientData();
  }, [patientId, uniqueId, isLoaded, orgId]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (orgId && user) {
      toast.promise(
        async () => {
          setSubmissionLoader(true);
          await setDoc(
            doc(db, "doctor", orgId, "patients", uniqueId),
            {
              ...patientFormData,
              registered_date: patientFormData.registered_date.concat([
                getTime(startOfDay(registerForDate)),
              ]),
              registered_date_time: patientFormData.registered_date_time.concat(
                getTime(registerForDate)
              ),
              registerd_by: {
                id: user.id,
                name: user.fullName,
                email: user.primaryEmailAddress?.emailAddress,
              },
            },
            {
              merge: true,
            }
          ).then(
            () => {
              setSubmissionLoader(false);
              setIsModalOpen(true);
            },
            () => {
              setSubmissionLoader(false);
            }
          );
        },
        {
          loading: "Loading...",
          success: "Registered successfully",
          error: "Failed to register",
        },
        {
          position: "bottom-right",
        }
      );
    }
  };

  return (
    <>
      <Dialog
        open={isModalOpen}
        onOpenChange={(state) => setIsModalOpen(state)}
      >
        <DialogContent className="md:max-w-screen-md">
          <DialogHeader>
            <DialogTitle hidden>PRINT</DialogTitle>
            <DialogDescription hidden>DESC</DialogDescription>
          </DialogHeader>
          <RegisteredModal
            isModalOpen={isModalOpen}
            setCloseModal={setIsModalOpen}
          />
        </DialogContent>
      </Dialog>

      {patientId && formLoader ? (
        <div className="w-full h-full overflow-hidden flex items-center justify-center z-50">
          <Loader size="medium" />
        </div>
      ) : error ? (
        <div className="px-2 text-muted-foreground font-medium text-base justify-self-center max-w-4xl h-full flex flex-1 items-center justify-center z-10 overflow-hidden text-center">
          {error}
        </div>
      ) : (
        <AppointmentForm
          patientFormData={patientFormData}
          setPatientFormData={setPatientFormData}
          handleSubmit={handleSubmit}
          submissionLoader={submissionLoader}
          registerForDate={registerForDate}
          setRegisterForDate={setRegisterForDate}
        />
      )}
    </>
  );
};

export default Page;
