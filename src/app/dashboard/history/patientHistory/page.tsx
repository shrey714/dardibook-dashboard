"use client";
import PatientDataBox from "@/components/Prescribe/PatientDataBox";
import PatientHistoryTabs from "@/components/Prescribe/PatientHistoryTabs";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import { getPatientHistory } from "@/app/services/getPatientHistory";
import NoPatientHistoryFound from "@/components/Prescribe/NoPatientHistoryFound";
import Loader from "@/components/common/Loader";
import PrintModal from "@/components/History/PrintModal";
import { getDocotr } from "@/app/services/getDoctor";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const user = useAppSelector<any>((state) => state.auth.user);
  const patientId = searchParams.get("patientId");
  const [patientData, setPatientData] = useState<any | null>(null);
  const [doctorData, setDoctorData] = useState<any | null>(null);
  const [prescriptionsData, setPrescriptionsData] = useState<any[]>([]);
  const [historyLoader, sethistoryLoader] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doctorLoader, setdoctorLoader] = useState(false);
  useEffect(() => {
    const getPatientData = async () => {
      if (patientId && user.uid) {
        sethistoryLoader(true);
        setdoctorLoader(true);
        const patientData = await getPatientHistory(patientId, user.uid);
        if (patientData) {
          setPatientData(patientData?.patient);
          setPrescriptionsData(patientData?.prescriptions);
          sethistoryLoader(false);
        } else {
          setError("No patient data available for the provided PatientID.");
          sethistoryLoader(false);
        }
        const doctorData = await getDocotr(user.uid);
        if (doctorData.data) {
          setDoctorData(doctorData.data);
          setdoctorLoader(false);
        } else {
          setdoctorLoader(false);
        }
      } else {
        setError("PatientID ot userId is not provided");
        sethistoryLoader(false);
        setdoctorLoader(false);
      }
    };
    getPatientData();
  }, [patientId, user.uid]);

  return (
    <>
      {patientId && historyLoader ? (
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
              {prescriptionsData?.length !== 0 && (
                <Button
                  size={"lg"}
                  disabled={doctorLoader}
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                >
                  {doctorLoader ? (
                    <Loader
                      size="medium"
                    />
                  ) : (
                    "Print"
                  )}
                </Button>
              )}
            </div>
          </div>
          <PatientHistoryTabs prescriptionsData={prescriptionsData} />
        </div>
      )}
    </>
  );
};

export default Page;
