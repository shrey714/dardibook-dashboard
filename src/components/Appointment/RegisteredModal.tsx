import React, { useEffect, useState } from "react";
import * as animationData from "@/lottieFiles/Registered.json";
import Lottie from "react-lottie";
import Link from "next/link";
import { Button } from "../ui/button";

interface RegisteredModalProps {
  isModalOpen: boolean; // Whether the modal is open
  setCloseModal: (state: boolean) => void; // Function to change the modal state
}

const RegisteredModal: React.FC<RegisteredModalProps> = ({
  isModalOpen,
  setCloseModal,
}) => {
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
      <h3 className="text-base md:text-lg font-semibold self-center w-full text-center">
        Patient added to Queue.
      </h3>
      <div className="mt-6 flex flex-row flex-wrap items-center gap-x-4">
        <Button
          variant="secondary"
          type="button"
          onClick={() => setCloseModal(false)}
          className="flex flex-1"
        >
          Edit
        </Button>
        <Button asChild variant={"ghost"}>
          <Link
            href={"./"}
            className="flex flex-1 btn rounded-md bg-indigo-600 text-sm text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add new patient
          </Link>
        </Button>
      </div>
    </>
  );
};

export default RegisteredModal;
