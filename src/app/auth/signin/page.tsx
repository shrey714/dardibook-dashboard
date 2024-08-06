"use client";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../redux/store";
import { signInWithGoogle } from "../../../firebase/firebaseAuth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAppSelector } from "@/redux/store";
import AuthHeaderWrapper from "@/components/wrapper/AuthHeaderWrapper";
import Loader from "@/components/common/Loader";

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

  const header = {
    title: "Welcome to DardiBook",
    desc: "Access your DardiBook account to manage appointments, prescriptions, and patient records with ease. Stay connected and streamline your healthcare management.",
  };
  return (
    <AuthHeaderWrapper header={header}>
      <div className="flex items-center justify-center flex-1">
        <button
          onClick={handleSignIn}
          disabled={loading}
          className="custom-button font-semibold tracking-wide"
        >
          {loading ? (
            <Loader size="medium" color="text-gray-300" secondaryColor="text-primary" />
          ) : (
            "Google Login"
          )}
        </button>
      </div>
    </AuthHeaderWrapper>
  );
};

export default SignIn;

{
  /* <div>
  <div className="w-screen h-screen bg-gray-300 overflow-hidden flex items-center justify-center">
    <Image
      src="/Logo.svg"
      fill={true}
      className="auth-background-image z-1 hidden 0 md:block"
      alt="logo"
    />
  </div>
</div>; */
}
