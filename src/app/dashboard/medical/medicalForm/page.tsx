"use client";
import Loader from "@/components/common/Loader";
import {
  Carousel,
  CarouselMainContainer,
  CarouselThumbsContainer,
  SliderMainItem,
  SliderThumbItem,
} from "@/components/Medical/Carousel";
import PatientDataBox from "@/components/Medical/PatientDataBox";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useTodayPatientStore } from "@/lib/providers/todayPatientsProvider";

const Page = () => {
  const searchParams = useSearchParams();
  const patientId = searchParams.get("patientId");
  const [startIndex] = useState(0);
  const [drawerState, setdrawerState] = useState(false);
  // =============================================

  const { todayPatients, loading } = useTodayPatientStore((state) => state);

  useEffect(() => {
    // const index = todayPatients?.findIndex(
    //   (patient: { patient_unique_Id: string | null }) =>
    //     patient.patient_unique_Id === patientId
    // );
    // setstartIndex(index);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayPatients]);

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
            patientData={[]}
              // patientData={todayPatients?.find(
              //   (patient: { patient_unique_Id: string | null }) =>
              //     patient.patient_unique_Id === patientId
              // )}
            />
          </SheetContent>
        </Sheet>

        {loading ? (
          <div className="w-full overflow-hidden h-[calc(100svh-53px)] flex flex-1 items-center justify-center z-40">
            <Loader size="medium" />
          </div>
        ) : todayPatients?.length === 0 || todayPatients === null ? (
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
              {todayPatients?.map((patient: any, index: number) => (
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
                {todayPatients?.map((patient: any, index: number) => (
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
