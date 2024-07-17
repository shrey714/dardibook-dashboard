"use client";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../redux/store";
import { signInWithGoogle } from "../../../firebase/firebaseAuth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAppSelector } from "@/redux/store";

const SignIn = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [loading, setloading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const handleSignIn = async () => {
    setloading(true);
    const data = await signInWithGoogle(dispatch, router);
    setloading(false);
  };
  useEffect(() => {
    setloading(true);
    if (user) {
      router.replace("/");
    } else {
      setloading(false);
    }
  }, [router, user]);

  return (
    <div>
      <div className="w-screen h-screen overflow-hidden flex items-center justify-center">
        <Image
          src="/Logo.svg"
          fill={true}
          className="auth-background-image"
          alt="logo"
        />
        <button
          onClick={handleSignIn}
          className="btn btn-wide btn-neutral mx-4 min-w-20"
        >
          {loading ? (
            <span className="loading loading-spinner loading-md"></span>
          ) : (
            "Google Login"
          )}
        </button>
      </div>
    </div>
  );
};

export default SignIn;
