"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppSelector } from "@/redux/store";

const Home = () => {
  const user = useAppSelector((state) => state.auth.user);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/dashboard/home");
    }
  }, [router, user]);

  return (
    <view
      style={{
        minWidth: "100vw",
        minHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "white",
        zIndex: 100000,
      }}
    >
      <span className="loading loading-spinner loading-md"></span>
    </view>
  );
};

export default Home;
