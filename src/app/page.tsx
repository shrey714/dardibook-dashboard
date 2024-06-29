"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppSelector } from "@/redux/store";

const Home = () => {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/pages/home");
    }
  }, [router, user]);

  return <></>;
};

export default Home;
