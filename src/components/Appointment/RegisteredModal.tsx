import React, { useEffect, useState } from "react";
import * as animationData from "@/lottieFiles/Registered.json";
import Lottie from "react-lottie";
import Link from "next/link";

const RegisteredModal = ({ isModalOpen, setCloseModal }: any) => {
  const [startAnimation, setStartAnimation] = useState(false);
  const defaultOptions = {
    loop: false,
    autoplay: startAnimation,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartAnimation(true);
    }, 500);

    return () => {
      setStartAnimation(false);
      clearTimeout(timer);
    };
  }, [isModalOpen]);

  return (
    <>
      <Lottie
        options={defaultOptions}
        height={100}
        width={100}
        isStopped={!startAnimation}
      />
      <h3 className="text-base md:text-lg font-semibold self-center text-gray-800">
        Patient added to Queue.
      </h3>
      <div className="mt-6 flex items-center gap-x-4">
        <button
          type="button"
          onClick={() => setCloseModal(false)}
          className="flex flex-1 btn btn-outline text-sm font-semibold leading-6 text-gray-900"
        >
          Edit
        </button>
        <Link
          href={"./"}
          className="flex flex-1 btn rounded-md bg-indigo-600 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Add new patient
        </Link>
      </div>
    </>
  );
};

export default RegisteredModal;
