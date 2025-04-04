"use client";
import Bed from "@/components/Admissions/Bed";
import BedAdmissionModal from "@/components/Admissions/BedAdmissionModal";
import { KanbanBoard } from "@/components/Admissions/KanbanBoard";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { db } from "@/firebase/firebaseConfig";
import { BedInfo, OrgBed } from "@/types/FormTypes";
import { useAuth, useUser } from "@clerk/nextjs";
import { collection, getDocs, where, query } from "firebase/firestore";
import React, { useState, useEffect } from "react";

function page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const { isLoaded, user } = useUser();
  // const { orgId } = useAuth();

  // const [bedInfo, setBedInfo] = useState<BedInfo[]>([]);
  // const [admissions, setAdmissions] = useState<OrgBed[]>([]);

  // useEffect(() => {
  //   const fetchBedMetaData = () => {
  //     if (user && user.publicMetadata) {
  //       const bedMetaData: BedInfo[] =
  //         (user.publicMetadata?.bedMetaData as BedInfo[]) || [];
  //       setBedInfo(bedMetaData);
  //     }
  //   };

  //   const fetchAdmissions = async () => {
  //     if (!orgId) return;
  //     try {
  //       console.log(orgId);
  //       const admissionsRef = collection(
  //         db,
  //         "doctor",
  //         "org_2u8hy06577z6Iakfqu70FH3b6Xk",
  //         "beds"
  //       );
  //       const admissionsSnapshot = await getDocs(
  //         query(admissionsRef, where("dischargeMarked", "==", true))
  //       );
  //       let admissionsData: OrgBed[] = [];
  //       admissionsSnapshot.forEach((doc) => {
  //         const data = doc.data() as OrgBed;
  //         admissionsData.push(data);
  //       });
  //       setAdmissions(admissionsData);
  //     } catch (error) {
  //       console.log("Error = ", error);
  //     }
  //   };

  //   if (isLoaded && user) {
  //     fetchBedMetaData();
  //     fetchAdmissions();
  //   }
  // }, [isLoaded, user]);

  return (
    <React.Fragment>
      <Dialog
        open={isModalOpen}
        onOpenChange={(state) => setIsModalOpen(state)}
      >
        <DialogTrigger>Admit Patient</DialogTrigger>
        <DialogContent className="max-w-screen-md ">
          <BedAdmissionModal />
        </DialogContent>
      </Dialog>
      <div className="w-full">
      <KanbanBoard />
      </div>

      {/* <div className="grid grid-cols-3 gap-2">
        {bedInfo.length > 0 ? (
          bedInfo.map((bedInfo, index) => {
            const admissionInfo = admissions.filter(
              (admission) => admission.bedId == bedInfo.id
            );
            console.log(admissionInfo);
            return (
              <div key={index} className="col-span-3 sm:col-span-1">
                <Bed bedInfo={bedInfo} admissionInfo={admissionInfo} />
              </div>
            );
          })
        ) : (
          <>No beds Are added</>
        )}
      </div> */}
    </React.Fragment>
  );
}

export default page;
