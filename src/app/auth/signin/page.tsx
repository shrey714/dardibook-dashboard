"use client";

import { useAppDispatch } from "../../../redux/store";
import { signInWithGoogle } from "../../../firebase/firebaseAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
const SignIn = () => {
  const [loading, setloading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const handleSignIn = async () => {
    setloading(true);
    const data = await signInWithGoogle(dispatch, router);
    setloading(false);
  };

  return (
    <div>
      <view className="full-screen overflow-hidden">
        <Image
          src="/Logo.svg"
          fill={true}
          className="auth-background-image"
          alt="logo"
        />
        <button onClick={handleSignIn} className="btn btn-wide btn-neutral mx-4 min-w-20">
          {loading ? (
            <span className="loading loading-spinner loading-md"></span>
          ) : (
            "Google Login"
          )}
        </button>
      </view>
    </div>
  );
};

export default SignIn;
