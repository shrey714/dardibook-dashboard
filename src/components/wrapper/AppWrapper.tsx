/* eslint-disable @next/next/no-img-element */
"use client"; // Mark the component as a Client Component
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation"; // Correct import for app directory
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";
import { setUser, clearUser, useAppSelector } from "@/redux/store";
import { useAppDispatch } from "@/redux/store";
import TopBarProgress from "react-topbar-progress-indicator";
import { checkVerifiedField } from "@/app/services/verifyDoctor";

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
  const [user, loading, error] = useAuthState(auth);
  const userInfo = useAppSelector<any>((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  // contains the paths of the pages where authentication is not required
  const publicPaths = ["/documents"];
  const pathRequiresAuth = !publicPaths.some((path) =>
    pathname.startsWith(path)
  );
  const [firstLoading, setfirstLoading] = useState(false);

  useEffect(() => {
    if (pathRequiresAuth) {
      setfirstLoading(true);
      if (!loading) {
        if (user) {
          try {
            if (!userInfo?.verified) {
              checkVerifiedField(user.uid).then((result) => {
                if (result.exists) {
                  if (result.verified) {
                    // every thing is fine...go ahead
                    dispatch(
                      setUser({ ...extractUserData(user), verified: true })
                    );
                    console.log("everything is fine...go ahead");
                    // setfirstLoading(false);
                  } else {
                    // account is still not verified..redirect to register page
                    // setfirstLoading(false);
                    dispatch(
                      setUser({ ...extractUserData(user), verified: false })
                    );
                    router.push("/auth/register");
                    console.log(
                      "account is still not verified..redirect to register page"
                    );
                  }
                } else {
                  // redirect to input doctor form
                  dispatch(
                    setUser({ ...extractUserData(user), verified: false })
                  );
                  router.push("/auth/register");
                  console.log("redirect to input doctor form");
                  // setfirstLoading(false);
                }
              });
            }
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
      }
    }
  }, [
    user,
    loading,
    dispatch,
    router,
    pathRequiresAuth,
    children,
    userInfo?.verified,
  ]);

  {
    return loading && pathRequiresAuth ? (
      <div className="w-screen h-screen overflow-hidden flex items-center justify-center bg-white">
        <div>{loading && <TopBarProgress />}</div>
        <img src="/logo.svg" className="h-52" alt="Flowbite Logo" />
      </div>
    ) : (
      <>{children}</>
    );
  }
  // return <></>;
};
// firstLoading add (must)
export default AppWrapper;
