"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard/home");
  }, [router]);

  return (
    <div className="w-screen h-svh overflow-hidden flex items-center justify-center bg-background">
      <Image
        src="/Logo.svg"
        height={208}
        width={208}
        alt="Flowbite Logo"
        className="h-52"
        priority={true}
      />
    </div>
  );
};

export default Page;
