/* eslint-disable @next/next/no-img-element */
"use client";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setUser, useAppDispatch, useAppSelector } from "@/redux/store";
import Link from "next/link";
import RegistrationForm from "@/components/forms/RegistrationForm";
import { createDoctor } from "@/app/services/createDoctor";
import FlickeringGrid from "@/components/AuthPage/FlickeringGrid";
import Image from "next/image";

const SignIn = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [loading, setloading] = useState(false);
  const router = useRouter();
  const [submissionLoader, setSubmissionLoader] = useState(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    setloading(true);
    if (user?.verified) {
      router.replace("/");
      setloading(false);
    } else {
      setloading(false);
    }
  }, [router, user]);

  const [formData, setFormData] = useState({
    clinicName: "",
    doctorName: "",
    degree: "",
    registrationNumber: "",
    clinicNumber: "",
    phoneNumber: "",
    emailId: user?.email,
    clinicAddress: "",
    clinicLogo: null as File | null,
    signaturePhoto: null as File | null,
  });
  // upload form data to docotr's collection============

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (user) {
      setSubmissionLoader(true);
      const data = await createDoctor({
        uid: user.uid,
        formData,
      });
      // open modal on submitting the register patoent form
      if (data?.status === 200) {
        dispatch(setUser({ ...user, verified: true }));
        setTimeout(() => {
          setSubmissionLoader(false);
          router.push("/");
        }, 1000);
      } else {
        setSubmissionLoader(false);
      }
    }
  };

  //======================

  const header = {
    title: "Register yourself",
    desc: "Join DardiBook to experience a seamless healthcare management platform. Register today to start scheduling appointments, managing prescriptions, and more.",
  };

  return (
    <section className="relative bg-gray-300 w-full flex justify-center no-scrollbar">
      <FlickeringGrid
        className="z-0 fixed inset-0 size-full"
        squareSize={4}
        gridGap={6}
        color="#60A5FA"
        maxOpacity={0.5}
        flickerChance={0.1}
      />
      <div className=" flex flex-col items-center w-full sm:w-4/5">
        <div className="z-50 h-52 flex items-center justify-center">
          <div className="w-max">
            <h1 className="h-auto select-none animate-typing overflow-hidden whitespace-nowrap border-r-4 border-r-gray-700 pr-5 sm:pr-8 text-3xl sm:text-5xl text-gray-800 font-bold leading-[normal] sm:leading-[normal]">
              {header.title}
            </h1>
          </div>
        </div>

        <div className="z-50 gap-4 py-4 w-full flex flex-col px-8 sm:px-0 sm:flex-row items-center justify-end">
          <Link
            href={"register/rolesAccessibility"}
            className="bg-gray-900 w-auto flex flex-row border-0 px-5 py-1 text-gray-300 outline-none items-center justify-center text-base sm:text-base font-bold tracking-wide rounded-full transition-all"
          >
            Select your role
            <svg
              className="size-10"
              focusable="false"
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="white"
            >
              <path d="m11.71 15.29 2.59-2.59c.39-.39.39-1.02 0-1.41L11.71 8.7c-.63-.62-1.71-.18-1.71.71v5.17c0 .9 1.08 1.34 1.71.71"></path>
            </svg>
          </Link>
        </div>

        <div className="z-50 py-8 sm:py-12 px-8 md:px-12 lg:px-36 bg-gray-900 w-full flex flex-1 flex-col items-center justify-between rounded-t-3xl overflow-hidden shadow-[0_0_20px_2px_rgba(8,_112,_184,_0.7)]">
          <RegistrationForm
            formData={formData}
            handleSubmit={handleSubmit}
            setFormData={setFormData}
            submissionLoader={submissionLoader}
          />

          <Image
            alt="Logo"
            src="/Logo.svg"
            width={56}
            height={56}
            className="h-12 sm:h-14 aspect-square mt-5"
            priority
          />
        </div>
      </div>
    </section>
  );
};

export default SignIn;
