"use client";
import { Button } from "@/components/ui/button";
import { useBedsStore } from "@/lib/stores/useBedsStore";
import React from "react";

const Temp = () => {
  const { beds, bedPatients, loading } = useBedsStore((state) => state);

  const btnClick1 = async () => {
    console.log(beds, bedPatients, loading);
  };

  return (
    <>
      <Button onClick={() => btnClick1()}>Button1</Button>
    </>
  );
};

export default Temp;
