"use client";
import React, { useEffect, useState } from "react";
import PrescribeForm from "@/components/forms/PrescribeForm";
import uniqid from "uniqid";
import { useSearchParams } from "next/navigation";
import AttendedModal from "@/components/Prescribe/AttendedModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth, useOrganization, useUser } from "@clerk/nextjs";
import { useTodayPatientStore } from "@/lib/providers/todayPatientsProvider";
import Loader from "@/components/common/Loader";
import { useBedsStore } from "@/lib/stores/useBedsStore";
import {
  orgUserType,
  PrescriptionFormTypes,
  ReceiptDetails,
} from "@/types/FormTypes";
import { getTime } from "date-fns";
import Link from "next/link";
import {
  BedSingleIcon,
  BriefcaseMedicalIcon,
  Link2,
  PencilLineIcon,
  Phone,
  TriangleAlertIcon,
  User,
} from "lucide-react";
import { usePatientHistoryModalStore } from "@/lib/stores/patientHistoryModalStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import toast, { ToastOptions } from "react-hot-toast";
import { arrayUnion, collection, doc, writeBatch } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

export interface patientBarDataTypes {
  patient_id: string;
  name: string;
  mobile: string;
  gender: "Male" | "Female" | "Other";
  registerd_by: orgUserType;
  registerd_for: orgUserType;
  inBed: boolean;
}

const toastConfig: ToastOptions = {
  id: "prescription-warning",
  icon: (
    <TriangleAlertIcon size={40} className="ml-3 aspect-square text-white" />
  ),
  position: "top-center",
  style: {
    padding: "10px",
    background: "#7f1d1d",
    color: "#FFFFFF",
    fontSize: "14px",
  },
  iconTheme: {
    primary: "#FFFFFF",
    secondary: "#FFFFFF",
  },
};

const Page = () => {
  const { orgId } = useAuth();
  const { organization, isLoaded } = useOrganization();
  const { user } = useUser();
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId");
  const { openModal } = usePatientHistoryModalStore();
  // Page level states
  const [submissionLoader, setSubmissionLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Stores
  const { todayPatients, loading: todayPatientsLoading } = useTodayPatientStore(
    (state) => state
  );
  const {
    beds,
    bedPatients,
    loading: bedsLoading,
  } = useBedsStore((state) => state);
  // Prescription Details States
  const [formData, setFormData] = useState<PrescriptionFormTypes>({
    prescription_id: uniqid("p-"),
    orgId: "",
    prescription_for_bed: false,
    diseaseId: uniqid(),
    diseaseDetail: "",
    medicines: [
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
        type: "",
        duration: 1,
        durationType: "day",
      },
    ],
    advice: "",
    nextVisit: "",
    refer: {
      hospitalName: "",
      doctorName: "",
      referMessage: "",
    },
    created_at: 0,
    registerd_by: {
      id: "",
      name: "",
      email: "",
    },
    prescribed_by: {
      id: "",
      name: "",
      email: "",
    },
    prescriber_assigned: {
      id: "",
      name: "",
      email: "",
    },
    receipt_details:
      isLoaded && organization && organization.publicMetadata.receipt_types
        ? (organization.publicMetadata.receipt_types as ReceiptDetails[])
        : [],
  });
  const [patientBarData, setpatientBarData] = useState<patientBarDataTypes>({
    patient_id: "",
    name: "",
    mobile: "",
    gender: "Male",
    registerd_by: {
      id: "",
      name: "",
      email: "",
    },
    registerd_for: {
      id: ",",
      name: ",",
      email: ",",
    },
    inBed: false,
  });
  // Submit Function
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (orgId && user && patientId) {
      const prescriptionData = {
        ...formData,
        orgId: orgId,
        prescription_for_bed: patientBarData.inBed,
        created_at: getTime(new Date()),
        registerd_by: patientBarData.registerd_by,
        prescribed_by: {
          id: user.id,
          name: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
        },
        prescriber_assigned: patientBarData.registerd_for,
      } as PrescriptionFormTypes;

      const batch = writeBatch(db);

      const patientDocRef = doc(db, "doctor", orgId, "patients", patientId);
      const prescriptionDocRef = doc(
        collection(patientDocRef, "prescriptions"),
        prescriptionData.prescription_id
      );
      batch.set(prescriptionDocRef, prescriptionData);
      batch.update(patientDocRef, {
        prescribed_date_time: arrayUnion(prescriptionData.created_at),
      });

      const diseaseDocRef = doc(
        db,
        "doctor",
        orgId,
        "diseaseData",
        prescriptionData.diseaseId
      );
      batch.set(
        diseaseDocRef,
        {
          active: true,
          searchableString: prescriptionData.diseaseDetail.toLowerCase().trim(),
          diseaseDetail: prescriptionData.diseaseDetail,
          medicines: prescriptionData.medicines
            ?.filter((medicine) => medicine.medicineName.toLowerCase().trim())
            .map((medicine) => medicine.id),
          diseaseId: prescriptionData.diseaseId,
        },
        { merge: true }
      );

      for (const medicine of prescriptionData.medicines) {
        if (medicine.medicineName || medicine.medicineName.trim() !== "") {
          const medicineDocRef = doc(
            db,
            "doctor",
            orgId,
            "medicinesData",
            medicine.id
          );
          batch.set(
            medicineDocRef,
            {
              searchableString: medicine.medicineName.toLowerCase().trim(),
              id: medicine.id,
              medicineName: medicine.medicineName,
              instruction: medicine.instruction,
              type: medicine.type,
            },
            { merge: true }
          );
        }
      }

      toast.promise(
        async () => {
          setSubmissionLoader(true);
          await batch.commit().then(
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
          success: "Prescribed successfully",
          error: "Failed to prescribe",
        },
        {
          position: "bottom-right",
        }
      );
    }
  };
  // Initiale Validations
  useEffect(() => {
    let errorMessage = "";

    if (!patientId) {
      errorMessage += "Patient Id is not provided. ";
    } else {
      const Bed = beds.find(
        (bed) => bed.patient_id === patientId && !bed.dischargeMarked
      );

      if (!Bed) {
        const patient = todayPatients.find((p) => p.patient_id === patientId);

        if (!patient) {
          errorMessage +=
            "Patient does not exist in today’s registrations list. ";
        } else {
          if (patient.prescribed && !patient.inBed) {
            errorMessage += "Patient already prescribed. ";
          } else {
            setpatientBarData({
              patient_id: patient.patient_id,
              name: patient.name,
              mobile: patient.mobile,
              gender: patient.gender,
              registerd_by: patient.registerd_by,
              registerd_for: patient.registerd_for,
              inBed: false,
            });
            if (patient.registerd_for.id !== user?.id)
              toast(
                `You are prescribing a patient assigned for ${patient.registerd_for.name}`,
                toastConfig
              );
          }
        }
      } else {
        const patientInBed = bedPatients[patientId];
        setpatientBarData({
          patient_id: Bed.patient_id,
          name: patientInBed.name,
          mobile: patientInBed.mobile,
          gender: patientInBed.gender,
          registerd_by: Bed.admission_by,
          registerd_for: Bed.admission_for,
          inBed: true,
        });

        if (Bed.admission_for.id !== user?.id)
          toast(
            `You are prescribing a patient assigned for ${Bed.admission_for.name}`,
            toastConfig
          );
      }
    }

    setError(errorMessage);
  }, [patientId, beds, todayPatients, bedPatients, user?.id]);

  return (
    <>
      {patientId && orgId && (
        <Dialog
          open={isModalOpen}
          onOpenChange={(state) => setIsModalOpen(state)}
        >
          <DialogContent className="md:max-w-screen-md">
            <DialogHeader>
              <DialogTitle hidden>PRINT</DialogTitle>
              <DialogDescription hidden>DESC</DialogDescription>
            </DialogHeader>
            <AttendedModal
              isModalOpen={isModalOpen}
              setCloseModal={setIsModalOpen}
              patientID={patientId}
              PrescriptionAndReferData={formData}
            />
          </DialogContent>
        </Dialog>
      )}

      {todayPatientsLoading && bedsLoading ? (
        <div className="w-full h-full overflow-hidden flex items-center justify-center z-50">
          <Loader size="medium" />
        </div>
      ) : error ? (
        <div className="px-2 text-muted-foreground font-medium text-base justify-self-center max-w-4xl h-full flex flex-1 items-center justify-center z-10 overflow-hidden text-center">
          {error}
        </div>
      ) : (
        <>
          <div className="w-full sticky top-0 z-[1] gap-y-1 bg-slate-50 dark:bg-gray-900 border-b px-4 py-2 flex flex-wrap items-center justify-between ">
            <div className="flex flex-1 items-center space-x-2 dm:space-x-4">
              <User className="size-9 md:size-11 border border-muted-foreground rounded-full p-2 text-muted-foreground" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm md:text-base font-medium line-clamp-1">
                    {patientBarData.name}
                  </h3>
                  <Badge
                    variant={"default"}
                    className="bg-blue-500/10 border-blue-500 text-blue-500 rounded-full line-clamp-1"
                  >
                    {patientBarData.patient_id}
                  </Badge>
                </div>
                <div className="flex items-center mt-1 text-sm text-muted-foreground gap-3">
                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-muted-foreground"></span>
                    <span>{patientBarData.gender}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span className="line-clamp-1">
                      {patientBarData.mobile}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Registered by/for section */}
            <div className="flex items-center divide-x-0 md:divide-x divide-gray-700 gap-x-3">
              <div className="hidden md:flex items-center">
                <PencilLineIcon
                  size={36}
                  className="mr-3 bg-blue-600/10 text-blue-600 border border-blue-600 rounded-full p-2"
                />
                <div className="flex flex-col items-start">
                  <span className="text-xs text-muted-foreground">
                    Registered by
                  </span>
                  <span className="text-base font-medium">
                    {patientBarData.registerd_by.name}
                  </span>
                </div>
              </div>

              <div className="flex items-center pl-3">
                <BriefcaseMedicalIcon
                  size={36}
                  className="hidden md:block mr-3 bg-green-500/10 text-green-600 border border-green-600 rounded-full p-2"
                />
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-xs text-muted-foreground">
                    Registered for
                  </span>
                  <span className="text-base font-medium">
                    {patientBarData.registerd_for.name}
                  </span>
                </div>

                {patientBarData.registerd_for.id !== user?.id && (
                  <TooltipProvider>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger asChild>
                        <TriangleAlertIcon
                          size={30}
                          className="ml-3 bg-red-500/10 text-red-600 border border-red-600 rounded-full p-2"
                        />
                      </TooltipTrigger>
                      <TooltipContent
                        className="bg-red-900 text-white font-medium text-sm max-w-xs"
                        side="bottom"
                        sideOffset={10}
                      >
                        <p>
                          You are prescribing a patient assigned for{" "}
                          {patientBarData.registerd_for.name}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>

              {patientBarData.inBed && (
                <div className="flex items-center pl-0 md:pl-3">
                  <p
                    className={`my-1 border-2 mr-1 py-1 px-4 rounded-full text-center flex items-center justify-center border-muted-foreground`}
                  >
                    <BedSingleIcon className="size-4 animate-pulse sm:size-5" />
                  </p>
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex items-center ml-auto w-auto justify-end pl-3">
              <Button variant="default" asChild>
                <Link
                  href={"#"}
                  role="button"
                  onClick={() =>
                    patientId &&
                    openModal({
                      patientId: patientId,
                    })
                  }
                  className="text-muted-foreground text-base flex flex-row gap-2 items-center"
                >
                  <Link2 size={16} /> History
                </Link>
              </Button>
            </div>
          </div>

          <PrescribeForm
            formData={formData}
            setFormData={setFormData}
            submissionLoader={submissionLoader}
            handleSubmit={handleSubmit}
          />
        </>
      )}
    </>
  );
};

export default Page;
