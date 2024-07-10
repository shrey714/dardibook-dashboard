"use client"; // Mark the component as a Client Component
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation"; // Correct import for app directory
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";
import { setUser, clearUser } from "@/redux/store";
import { useAppDispatch } from "@/redux/store";
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
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  // contains the paths of the pages where authentication is not required
  const publicPaths = ["/documents"];
  const pathRequiresAuth = !publicPaths.some((path) =>
    pathname.startsWith(path)
  );

  useEffect(() => {
    if (pathRequiresAuth) {
      if (!loading) {
        if (user) {
          dispatch(setUser(extractUserData(user)));
        } else {
          router.push("/auth/signin");
          dispatch(clearUser());
        }
      }
    }
  }, [user, loading, dispatch, router, pathRequiresAuth]);

  {
    return loading && pathRequiresAuth ? (
      <view className="full-screen">
        <span className="loading loading-dots loading-lg"></span>
      </view>
    ) : (
      <>{children}</>
    );
  }
};

export default AppWrapper;
