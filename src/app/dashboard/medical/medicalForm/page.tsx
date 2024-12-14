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
import { query, collection, onSnapshot } from "firebase/firestore";
import { X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Page = () => {
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId");
  const user = useAppSelector<any>((state) => state.auth.user);
  const [loader, setLoader] = useState(false);
  const [patientList, setpatientList] = useState<any>([]);
  const [startIndex, setstartIndex] = useState(0);
  const [drawerState, setdrawerState] = useState(false);

  useEffect(() => {
    console.log("afafafa====");
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
  }, [user]);
  // =============================================

  return (
    <>
      <div className="w-auto static">
        <Sheet
          open={drawerState}
          onOpenChange={(state) => setdrawerState(state)}
        >
          <SheetContent className="w-full md:w-[50vw] p-3">
            <SheetHeader>
              <SheetTitle hidden>Edit profile</SheetTitle>
              <SheetDescription hidden>DESC</SheetDescription>
            </SheetHeader>
            <PatientDataBox
              patientData={patientList.find(
                (patient: { patient_unique_Id: any }) =>
                  patient.patient_unique_Id === patientId
              )}
            />
          </SheetContent>
        </Sheet>

        {loader ? (
          <div className="w-full overflow-hidden h-[calc(100svh-53px)] flex flex-1 items-center justify-center z-40">
            <Loader size="medium" />
          </div>
        ) : patientList.length === 0 ? (
          <div
            style={{
              width: "100%",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="h-[calc(100svh-53px)]"
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
                  className="rounded-md bg-transparent"
                />
              ))}
            </CarouselThumbsContainer>
            <div className="relative basis-3/4 overflow-hidden">
              <CarouselMainContainer className="h-[calc(100svh-106px)] z-[1] relative">
                {patientList.map((patient: any, index: any) => (
                  <SliderMainItem
                    setdrawerState={setdrawerState}
                    key={index}
                    patient={patient}
                    selectedPatientId={patientId}
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
