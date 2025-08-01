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
      <p className="absolute bottom-2 right-2 text-muted-foreground text-xs font-medium">
        Taking you to your dashboard...
      </p>
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
