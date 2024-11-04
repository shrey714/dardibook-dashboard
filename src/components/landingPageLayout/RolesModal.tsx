import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Loader from "../common/Loader";
import { setUser, useAppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";
import Image from "next/image";

const RolesModal = ({
  userInfo,
  isOpen,
}: {
  userInfo: any;
  isOpen: boolean;
}) => {
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
        return;
      }
      const docsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setroles(docsData);
      setloading(false);
    }

    if (isOpen && userInfo) {
      getDocumentsWithRequiredStaff();
    }
  }, [selectRole, isOpen]);

  return (
    <>
      <div role="tablist" className="tabs tabs-boxed bg-gray-300 gap-1">
        <button
          onClick={() => setselectRole("subDoctor")}
          role="tab"
          className={`tab font-medium hover:bg-gray-50 ${
            selectRole === "subDoctor" ? "tab-active" : ""
          }`}
        >
          SubDoctor
        </button>
        <button
          onClick={() => setselectRole("medical")}
          role="tab"
          className={`tab font-medium hover:bg-gray-50 ${
            selectRole === "medical" ? "tab-active" : ""
          }`}
        >
          Medical
        </button>
      </div>

      <div className="flex flex-col min-h-36 gap-1 py-3">
        {loading ? (
          <div className="flex flex-1 w-full items-center justify-center">
            <Loader
              size={"medium"}
              color="text-primary"
              secondaryColor="text-gray-400/50"
            />
          </div>
        ) : roles.length === 0 ? (
          <p className="text-center py-3 text-base font-semibold text-gray-800">
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
                  className={`btn animate-none flex flex-row items-center bg-[#d1d5db] min-h-min h-auto py-2 text-gray-800 disabled:text-gray-800 ${
                    false ? "justify-center" : "justify-between"
                  }`}
                >
                  <div className="flex flex-row items-center gap-2">
                    <Image
                      alt="Logo"
                      src={hospital.clinicLogo}
                      width={28}
                      height={28}
                      className="h-7 aspect-square rounded-sm shadow-sm"
                      priority
                    />
                    <h1 className="text-sm sm:text-base flex flex-row gap-1 items-center">
                      {hospital.clinicName}
                    </h1>
                  </div>
                  {current ? (
                    <span className="text-[8px] text-green-600 font-semibold border-[1.5px] border-green-600 px-2 rounded-full">
                      Current
                    </span>
                  ) : (
                    <svg
                      className="size-8"
                      focusable="false"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      data-testid="ArrowRightRoundedIcon"
                    >
                      <path d="m11.71 15.29 2.59-2.59c.39-.39.39-1.02 0-1.41L11.71 8.7c-.63-.62-1.71-.18-1.71.71v5.17c0 .9 1.08 1.34 1.71.71"></path>
                    </svg>
                  )}
                </button>
              );
            })}
          </>
        )}
      </div>
    </>
  );
};

export default RolesModal;
