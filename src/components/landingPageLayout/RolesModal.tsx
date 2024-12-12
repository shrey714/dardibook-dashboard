import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Loader from "../common/Loader";
import { setUser, useAppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChevronRight } from "lucide-react";

const RolesModal = ({ userInfo }: { userInfo: any }) => {
  const [selectRole, setselectRole] = useState("subDoctor");
  const [loading, setloading] = useState(false);
  const [roles, setroles] = useState<any[]>([]);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    async function getDocumentsWithRequiredStaff() {
      setloading(true);
      const q = query(
        collection(db, "doctor"),
        where("staff", "array-contains", {
          email: userInfo?.email,
          role: selectRole,
        })
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setloading(false);
        setroles([]);
        return;
      }
      const docsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setroles(docsData);
      setloading(false);
    }

    if (userInfo) {
      getDocumentsWithRequiredStaff();
    }
  }, [selectRole, userInfo]);

  return (
    <Tabs
      onValueChange={(value) => {
        setselectRole(value);
      }}
      defaultValue="SubDoctor"
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="subDoctor">SubDoctor</TabsTrigger>
        <TabsTrigger value="medical">Medical</TabsTrigger>
      </TabsList>
      <div className="flex flex-col min-h-40 gap-2 p-2 mt-2 rounded-md">
        {loading ? (
          <div className="flex flex-1 w-full items-center justify-center">
            <Loader
              size={"medium"}
            />
          </div>
        ) : roles.length === 0 ? (
          <p className="text-center py-3 text-base font-medium">
            You are not authorised to use any {selectRole} services!
          </p>
        ) : (
          <>
            {roles?.map((hospital: any, index: React.Key) => {
              const current = hospital.id === userInfo.uid;
              return (
                <button
                  key={index}
                  disabled={current}
                  onClick={() => {
                    dispatch(
                      setUser({
                        ...userInfo,
                        uid: hospital.id,
                        role: selectRole,
                        verified: true,
                      })
                    );
                    router.push("/");
                  }}
                  className={`flex flex-row items-center bg-gradient-to-b from-muted/50 to-muted rounded-md border-2 py-2 px-2 justify-between`}
                >
                  <div className="flex flex-row items-center gap-2">
                    <Avatar className="h-7 w-7 rounded-lg shadow-sm">
                      <AvatarImage
                        src={hospital.clinicLogo}
                        alt={hospital.clinicName}
                      />
                      <AvatarFallback className="rounded-lg">
                        {hospital.clinicName?.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <h1 className="text-sm sm:text-base flex flex-row gap-1 items-center">
                      {hospital.clinicName}
                    </h1>
                  </div>
                  {current ? (
                    <span className="text-[8px] text-green-600 font-medium border-[1.5px] border-green-600 px-2 rounded-full">
                      Current
                    </span>
                  ) : (
                    <ChevronRight />
                  )}
                </button>
              );
            })}
          </>
        )}
      </div>
    </Tabs>
  );
};

export default RolesModal;
