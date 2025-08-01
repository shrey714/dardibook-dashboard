import Image from "next/image";
import LoginBox from "@/components/AuthPage/LoginBox";
import Link from "next/link";
import MarqueBg from "@/components/AuthPage/MarqueBg";

const Page = () => {
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
      <MarqueBg />
    </section>
  );
};

export default Page;
