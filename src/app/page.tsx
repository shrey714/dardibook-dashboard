"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppSelector } from "@/redux/store";
import Loader from "@/components/common/Loader";

const Home = () => {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (user && user?.verified) {
      router.replace("/dashboard/home");
    }
  }, [router, user]);

  return (
    <div
      style={{
        minWidth: "100vw",
        minHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
        zIndex: 100000,
      }}
    >
      <Loader size="large" color="text-primary" secondaryColor="text-gray-300" />
    </div>
  );
};

export default Home;
