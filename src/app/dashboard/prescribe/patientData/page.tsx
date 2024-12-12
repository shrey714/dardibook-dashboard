"use client";
import PatientDataBox from "@/components/Prescribe/PatientDataBox";
import PatientHistoryTabs from "@/components/Prescribe/PatientHistoryTabs";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import { getPatientHistory } from "@/app/services/getPatientHistory";
import NoPatientHistoryFound from "@/components/Prescribe/NoPatientHistoryFound";
import Loader from "@/components/common/Loader";
import { Button } from "@/components/ui/button";

const Page = () => {
  const searchParams = useSearchParams();
  const user = useAppSelector<any>((state) => state.auth.user);
  const patientId = searchParams.get("patientId");
  const [patientData, setPatientData] = useState<any | null>(null);
  const [prescriptionsData, setPrescriptionsData] = useState<any[]>([]);
  const [historyLoader, sethistoryLoader] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPatientData = async () => {
      if (patientId) {
        sethistoryLoader(true);
        const patientData = await getPatientHistory(patientId, user.uid);
        if (patientData) {
          setPatientData(patientData?.patient);
          setPrescriptionsData(patientData?.prescriptions);
        } else {
          setError("No patient data available for the provided PatientID.");
        }
        sethistoryLoader(false);
      } else {
        setError("PatientID is not provided");
        sethistoryLoader(false);
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
          <div className="p-2 flex gap-0 sm:gap-8 items-center flex-col-reverse sm:flex-row px-4 ">
            <PatientDataBox patientData={patientData} />
            <div className="p-4 gap-6 flex flex-col">
              <Button asChild variant={"default"} size={"lg"}>
                <Link
                  href={{
                    pathname: "prescribeForm",
                    query: { patientId: patientId },
                  }}
                >
                  Attend
                </Link>
              </Button>
              <Button asChild variant={"destructive"} size={"lg"}>
                <Link
                  href={"./"}
                  className="btn animate-none md:btn-md lg:btn-wide"
                >
                  Back to queue
                </Link>
              </Button>
            </div>
          </div>
          <PatientHistoryTabs prescriptionsData={prescriptionsData} />
        </div>
      )}
    </>
  );
};

export default Page;
