"use client";
import { getTodayPatients } from "@/app/services/getTodayPatients";
import Loader from "@/components/common/Loader";
import {
  Carousel,
  CarouselMainContainer,
  CarouselThumbsContainer,
  SliderMainItem,
  SliderThumbItem,
} from "@/components/Medical/Carousel";
import PatientDataBox from "@/components/Medical/PatientDataBox";
import { db } from "@/firebase/firebaseConfig";
import { useAppSelector } from "@/redux/store";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { query, collection, onSnapshot } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId");
  const user = useAppSelector<any>((state) => state.auth.user);
  const [loader, setLoader] = useState(false);
  const [patientList, setpatientList] = useState<any>([]);
  const [startIndex, setstartIndex] = useState(0);
  const [selectedPatientId, setselectedPatientId] = useState(patientId);

  useEffect(() => {
    let unsubscribe: () => void;

    const getTodayPatientQueue = () => {
      if (user) {
        const q = query(collection(db, "doctor", user.uid, "patients"));

        setLoader(true); //enable after
        unsubscribe = onSnapshot(q, async (snapshot) => {
          const patientQueueData = await getTodayPatients(user.uid);
          if (patientQueueData.data) {
            setpatientList(patientQueueData.data);
            const index = patientQueueData.data.findIndex(
              (patient: { patient_unique_Id: any }) =>
                patient.patient_unique_Id === patientId
            );
            setstartIndex(index);
          } else {
            setpatientList([]);
          }
          setTimeout(() => {}, 1000);
          setLoader(false);
        });
      } else {
        setLoader(false);
      }
    };

    getTodayPatientQueue();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [patientId, user]);
  // =============================================

  return (
    <>
      <div className="drawer drawer-end w-auto static">
        <input id="my-drawer-shrey" type="checkbox" className="drawer-toggle" />
        <div className="drawer-side z-20">
          <label
            htmlFor="my-drawer-shrey"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="menu bg-base-200 text-base-content h-svh overflow-hidden flex-col w-full md:w-[70vw] lg:w-[60vw] p-4 pt-2 relative">
            {/* Sidebar content here */}

            <div className="w-full mb-2 flex justify-end md:justify-start">
              <label
                htmlFor="my-drawer-shrey"
                className="drawer-button btn animate-none btn-circle btn-sm bg-gray-300"
              >
                <XMarkIcon height={18} width={18} color="red" />
              </label>
            </div>

            {/* diaplay medicine */}
            <div className="w-full flex flex-col flex-1 bg-gray-300 p-2 md:p-3 rounded-lg overflow-y-auto">
              <PatientDataBox
                patientData={patientList.find(
                  (patient: { patient_unique_Id: any }) =>
                    patient.patient_unique_Id === selectedPatientId
                )}
              />
            </div>
          </div>
        </div>

        {loader ? (
          <div className="w-full h-svh overflow-hidden flex items-center justify-center z-40">
            <Loader
              size="medium"
              color="text-primary"
              secondaryColor="text-white"
            />
          </div>
        ) : patientList.length === 0 ? (
          <div
            style={{
              width: "100%",
              height: "100vh",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 100000,
            }}
          >
            empty
          </div>
        ) : (
          <Carousel
            carouselOptions={{
              startIndex: startIndex,
            }}
            orientation="horizontal"
            className="flex flex-col !gap-0 w-full"
          >
            <CarouselThumbsContainer className="h-12 basis-full py-1 select-none">
              {patientList.map((patient: any, index: any) => (
                <SliderThumbItem
                  key={index}
                  index={index}
                  patient={patient}
                  setselectedPatientId={setselectedPatientId}
                  className="rounded-md bg-transparent"
                />
              ))}
            </CarouselThumbsContainer>
            <div className="relative basis-3/4 overflow-hidden">
              <CarouselMainContainer className="h-[calc(100svh-48px)] pb-[6px] z-[1] relative">
                {patientList.map((patient: any, index: any) => (
                  <SliderMainItem
                    key={index}
                    patient={patient}
                    selectedPatientId={selectedPatientId}
                    className="border-0 flex items-center justify-center h-full rounded-md"
                  />
                ))}
              </CarouselMainContainer>
            </div>
          </Carousel>
        )}
      </div>
    </>
  );
};

export default Page;
