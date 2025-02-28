"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePatientHistoryModalStore } from "@/lib/stores/patientHistoryModalStore";
import PatientDataBox from "@/components/Prescribe/PatientDataBox";
import PatientHistoryTabs from "@/components/Prescribe/PatientHistoryTabs";
import React, { useEffect, useState } from "react";
import { getPatientHistory } from "@/app/services/getPatientHistory";
import NoPatientHistoryFound from "@/components/Prescribe/NoPatientHistoryFound";
import Loader from "@/components/common/Loader";
import PrintModal from "@/components/History/PrintModal";
import { getDocotr } from "@/app/services/getDoctor";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { useTodayPatientStore } from "@/lib/providers/todayPatientsProvider";
import { ClipboardPlus } from "lucide-react";

const PatientHistoryGlobalModal = () => {
  const { isOpen, modalProps, closeModal } = usePatientHistoryModalStore();
  const { patientsData, loading, getTodayPatients } = useTodayPatientStore(
    (state) => state
  );
  const { isLoaded, orgId, orgRole } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [patientData, setPatientData] = useState<any>(null);
  const [doctorData, setDoctorData] = useState(null);
  const [prescriptionsData, setPrescriptionsData] = useState([]);
  const [historyLoader, sethistoryLoader] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doctorLoader, setdoctorLoader] = useState(false);
  useEffect(() => {
    if (orgId && isLoaded) {
      getTodayPatients(orgId);
    }
  }, [getTodayPatients, isLoaded, orgId]);
  useEffect(() => {
    const getPatientData = async () => {
      if (
        modalProps.patientId &&
        modalProps.patientId !== "" &&
        isLoaded &&
        orgId &&
        orgRole
      ) {
        sethistoryLoader(true);
        setdoctorLoader(true);
        const patientData = await getPatientHistory(
          modalProps.patientId,
          orgId
        );
        const doctorData = await getDocotr(orgId);
        if (patientData) {
          setPatientData(patientData?.patient);
          setPrescriptionsData(patientData?.prescriptions);
          sethistoryLoader(false);
          setError(null);
        } else {
          setError("No patient data available for the provided PatientID.");
          sethistoryLoader(false);
        }
        if (doctorData.data) {
          setDoctorData(doctorData.data);
          setdoctorLoader(false);
          setError(null);
        } else {
          setdoctorLoader(false);
        }
      } else {
        setError(`PatientID ot userId is not provided ${modalProps.patientId}`);
        sethistoryLoader(false);
        setdoctorLoader(false);
      }
    };
    getPatientData();
  }, [modalProps, isLoaded, orgId, orgRole]);

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-[95%] h-[95%] sm:max-w-[80%] sm:h-[90%] overflow-y-auto px-0 pt-0 pb-2">
        <DialogHeader style={{ display: "none" }}>
          <DialogTitle style={{ display: "none" }}>
            Patient Information ({modalProps.patientId})
          </DialogTitle>
          <DialogDescription style={{ display: "none" }}></DialogDescription>
        </DialogHeader>

        <>
          {modalProps.patientId &&
          modalProps.patientId !== "" &&
          historyLoader ? (
            <div className="w-full h-full overflow-hidden flex items-center justify-center">
              <Loader size="medium" />
            </div>
          ) : error ? (
            <NoPatientHistoryFound message={error} />
          ) : (
            <div className="relative">
              <Dialog
                open={isModalOpen}
                onOpenChange={(state) => setIsModalOpen(state)}
              >
                <DialogContent className="md:max-w-screen-md">
                  <DialogHeader>
                    <DialogTitle hidden>PRINT</DialogTitle>
                    <DialogDescription hidden>DESC</DialogDescription>
                  </DialogHeader>
                  <PrintModal
                    setIsModalOpen={setIsModalOpen}
                    patientData={patientData}
                    prescriptionsData={prescriptionsData}
                    doctorData={doctorData}
                  />
                </DialogContent>
              </Dialog>

              <div className="p-2 flex gap-0 sm:gap-8 items-center flex-col-reverse sm:flex-row px-4 ">
                <PatientDataBox patientData={patientData} />
                <div className="p-4 gap-6 flex flex-col">
                  {!loading &&
                  patientsData?.some(
                    (patient: any) =>
                      patient?.patient_unique_Id === modalProps.patientId
                  ) &&
                  patientData &&
                  !patientData?.visitedDates?.some(
                    (date: number) =>
                      new Date(date).getDate() === new Date().getDate()
                  ) &&
                  (orgRole === "org:clinic_head" ||
                    orgRole === "org:doctor") ? (
                    <Button
                      asChild
                      size={"lg"}
                      variant="outline"
                      className="border-0 flex items-center justify-center bg-blue-700 hover:bg-blue-900 text-white hover:text-white"
                    >
                      <Link
                        href={{
                          pathname: "prescribe/prescribeForm",
                          query: { patientId: modalProps.patientId },
                        }}
                        onClick={() => {
                          closeModal();
                        }}
                      >
                        <ClipboardPlus />
                        Attend
                      </Link>
                    </Button>
                  ) : (
                    <></>
                  )}

                  {prescriptionsData?.length !== 0 && (
                    <Button
                      size={"lg"}
                      disabled={doctorLoader}
                      onClick={() => {
                        setIsModalOpen(true);
                      }}
                    >
                      {doctorLoader ? <Loader size="medium" /> : "Print"}
                    </Button>
                  )}
                </div>
              </div>
              <PatientHistoryTabs prescriptionsData={prescriptionsData} />
            </div>
          )}
        </>
      </DialogContent>
    </Dialog>
  );
};

export default PatientHistoryGlobalModal;
