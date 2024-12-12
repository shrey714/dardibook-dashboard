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
    <div className="w-screen h-svh overflow-hidden flex items-center justify-center bg-background z-50">
      <Loader
        size="large"
      />
    </div>
  );
};

export default Home;
