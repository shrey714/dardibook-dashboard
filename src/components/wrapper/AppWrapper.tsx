/* eslint-disable @next/next/no-img-element */
"use client"; // Mark the component as a Client Component
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Correct import for app directory
// import { useAuthState } from "react-firebase-hooks/auth";
import { setUser, clearUser, useAppSelector } from "@/redux/store";
import { useAppDispatch } from "@/redux/store";
import TopBarProgress from "react-topbar-progress-indicator";
import { checkVerifiedField } from "@/app/services/verifyDoctor";
import { auth } from "@/firebase/firebaseConfig";
import Image from "next/image";

TopBarProgress.config({
  barColors: {
    "0": "#3DBDEC",
    "1.0": "#4a00ff",
  },
  shadowBlur: 10,
});
const extractUserData = (user: any) => {
  return {
    uid: user?.uid,
    email: user?.email,
    displayName: user?.displayName,
    photoURL: user?.photoURL,
  };
};

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  // console.log("goin through home layout file")
  // const [user, loading, error] = useAuthState(auth);
  const userInfo = useAppSelector<any>((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [firstLoading, setfirstLoading] = useState(true);

  useEffect(() => {
    if (!userInfo?.verified) {
      //remove in production
      setfirstLoading(true);
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          try {
            // if (!userInfo?.verified) {
            checkVerifiedField(user.uid).then((result) => {
              if (result.exists) {
                if (result.verified) {
                  // every thing is fine...go ahead
                  dispatch(
                    setUser({
                      ...extractUserData(user),
                      verified: true,
                      role: "admin",
                    })
                  );
                  console.log("everything is fine...go ahead");
                  // setfirstLoading(false);
                } else {
                  // account is still not verified..redirect to register page
                  // setfirstLoading(false);
                  dispatch(
                    setUser({
                      ...extractUserData(user),
                      verified: false,
                      role: "admin",
                    })
                  );
                  router.push("/auth/register");
                  console.log(
                    "account is still not verified..redirect to register page"
                  );
                }
              } else {
                // redirect to input doctor form
                dispatch(
                  setUser({
                    ...extractUserData(user),
                    verified: false,
                    role: "admin",
                  })
                );
                router.push("/auth/register");
                console.log("redirect to input doctor form");
                // setfirstLoading(false);
              }
            });
            // }
          } catch (error) {
            console.log(error);
          } finally {
            setTimeout(() => {
              setfirstLoading(false);
            }, 1000);
          }
        } else {
          router.push("/auth/signin");
          dispatch(clearUser());
          setTimeout(() => {
            setfirstLoading(false);
          }, 1000);
        }
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    } //remove in production
  }, [dispatch, router, children, userInfo?.verified]);

  {
    return firstLoading ? (
      <div className="w-screen h-svh overflow-hidden flex items-center justify-center bg-white">
        <div>{firstLoading && <TopBarProgress />}</div>
        <Image
          src="/Logo.svg"
          height={208} // This is equivalent to h-52 in Tailwind CSS (52 * 4 = 208)
          width={208} // You might want to set a width as well for better layout control
          alt="Flowbite Logo"
          className="h-52" // Tailwind CSS class
        />
      </div>
    ) : (
      <>{children}</>
    );
  }
  // return <></>;
};
// firstLoading add (must)
export default AppWrapper;
