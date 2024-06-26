"use client";

import { useAppDispatch } from "../../../redux/store";
import { signInWithGoogle } from "../../../firebase/firebaseAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
      <view className="full-screen">
        <button onClick={handleSignIn} className="btn btn-wide">
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
