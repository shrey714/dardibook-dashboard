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
    <div className="w-screen h-screen overflow-hidden flex items-center justify-center bg-white z-50">
      <Loader
        size="large"
        color="text-primary"
        secondaryColor="text-gray-300"
      />
    </div>
  );
};

export default Home;
