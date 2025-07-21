"use client";

import Image from "next/image";
import LoginBox from "@/components/AuthPage/LoginBox";
import Link from "next/link";
import { useState } from "react";

const Page = () => {
  const [iframeLoaded, setIframeLoaded] = useState(false);

  return (
    <section
      className="relative h-svh w-full overflow-hidden flex justify-center items-center"
      style={{
        background:
          "linear-gradient(160deg, #020617 0%, #081C4F 35%, #0B3B7B 70%, #2A7FD0 100%)",
      }}
    >
      <main className="z-[1] flex flex-col justify-center p-4 sm:p-9 box-border flex-[1_1_0%] max-w-[90%] sm:max-w-[500px] bg-black/25 backdrop-blur-[20px] rounded-[20px] md:min-w-[330px]">
        <div>
          <div className="mb-4 sm:mb-7 flex items-center justify-center">
            <Image
              alt="Logo"
              src="/Logo.svg"
              width={60}
              height={60}
              className="h-[60px] aspect-square"
              priority
            />
          </div>
          <div className="flex flex-col gap-2">
            <LoginBox />
          </div>
          <p className="text-slate-400 text-center text-xs mt-1">
            By clicking continue, you agree to our{" "}
            <Link
              href="https://dardibook.in/documents/terms-conditions"
              className="hover:text-white underline underline-offset-4"
              target="_blank"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="https://dardibook.in/documents/privacy-policy"
              className="hover:text-white underline underline-offset-4"
              target="_blank"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </main>

      <div className="fixed top-0 left-0 w-full h-svh">
        <iframe
          src="https://db-marquee-frame.vercel.app"
          width="100%"
          height="100%"
          title="visual"
          style={{ opacity: iframeLoaded ? 1 : 0 }}
          onLoad={() => setIframeLoaded(true)}
          className="transition-opacity duration-500"
        ></iframe>
      </div>
    </section>
  );
};

export default Page;
