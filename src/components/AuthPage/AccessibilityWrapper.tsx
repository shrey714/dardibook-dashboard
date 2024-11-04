"use client";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Loader from "../common/Loader";
import Image from "next/image";
import { db } from "@/firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { setUser, useAppDispatch, useAppSelector } from "@/redux/store";

const AccessibilityWrapper = ({ role }: { role: string }) => {
  const userInfo = useAppSelector<any>((state) => state.auth.user);
  const [hospitals, sethospitals] = useState<any>([]);
  const [loading, setloading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  useEffect(() => {
    // Querying for all documents in the "doctor" collection
    async function getDocumentsWithRequiredStaff() {
      setloading(true);
      const q = query(
        collection(db, "doctor"),
        where("staff", "array-contains", {
          email: userInfo.email,
          role: role,
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

      sethospitals(docsData);
      setloading(false);
    }

    // Call the function
    getDocumentsWithRequiredStaff();
  }, []);

  return (
    <dialog open={true} className="modal !absolute">
      <div className={`absolute inset-0 bg-black opacity-50`}></div>
      <div className="modal-box py-3">
        <h3 className="font-bold text-lg text-center">
          Select Hospital({role})
        </h3>
        <div className="flex flex-col gap-1 py-3 min-h-36">
          {loading ? (
            <div className="flex w-full flex-1 items-center justify-center">
              <Loader
                size={"medium"}
                color="text-primary"
                secondaryColor="text-gray-400/50"
              />
            </div>
          ) : hospitals.length === 0 ? (
            <p className="text-center py-3 text-base font-semibold text-gray-800">
              You are not authorised to use any {role} services!
            </p>
          ) : (
            <>
              {hospitals?.map((hospital: any, index: React.Key) => {
                return (
                  <button
                    key={index}
                    onClick={() => {
                      dispatch(
                        setUser({
                          ...userInfo,
                          uid: hospital.id,
                          role: role,
                          verified: true,
                        })
                      );
                      router.push("/");
                    }}
                    className={`btn animate-none flex flex-row items-center bg-[#d1d5db] min-h-min h-auto py-2 ${
                      false ? "justify-center" : "justify-between"
                    }`}
                  >
                    {/* {false ? (
                  <Loader
                    size={"small"}
                    color="text-primary"
                    secondaryColor="text-gray-400/50"
                  />
                ) : (
                  <> */}
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
                    <svg
                      className="size-8"
                      focusable="false"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      data-testid="ArrowRightRoundedIcon"
                    >
                      <path d="m11.71 15.29 2.59-2.59c.39-.39.39-1.02 0-1.41L11.71 8.7c-.63-.62-1.71-.18-1.71.71v5.17c0 .9 1.08 1.34 1.71.71"></path>
                    </svg>
                    {/* </>
                )} */}
                  </button>
                );
              })}
            </>
          )}
        </div>
        <div className="flex flex-col items-center justify-center gap-y-7">
          <button
            type="button"
            onClick={() => {
              router.back();
            }}
            className="btn animate-none border-2 btn-outline rounded-full min-h-min h-min py-2 px-7 text-xs leading-none"
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default AccessibilityWrapper;
