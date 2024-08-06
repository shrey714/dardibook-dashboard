/* eslint-disable @next/next/no-img-element */
"use client";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setUser, useAppDispatch, useAppSelector } from "@/redux/store";
import RegistrationForm from "@/components/forms/RegistrationForm";
import { createDoctor } from "@/app/services/createDoctor";
import AuthHeaderWrapper from "@/components/wrapper/AuthHeaderWrapper";
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
    title: "Welcome to DardiBook",
    desc: "Join DardiBook to experience a seamless healthcare management platform. Register today to start scheduling appointments, managing prescriptions, and more.",
  };

  return (
    <AuthHeaderWrapper header={header}>
      <RegistrationForm
        formData={formData}
        handleSubmit={handleSubmit}
        setFormData={setFormData}
        submissionLoader={submissionLoader}
      />
    </AuthHeaderWrapper>
  );
};

export default SignIn;
