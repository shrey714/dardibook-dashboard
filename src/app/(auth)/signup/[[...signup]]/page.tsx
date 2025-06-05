import Image from "next/image";
import SignUpBox from "@/components/AuthPage/SignUpBox";
import Link from "next/link";

const Page = () => {
  return (
    <section
      className="relative h-svh w-full overflow-hidden flex justify-center items-center"
      style={{
        background:
          "linear-gradient(155deg, rgb(0, 0, 0) 0%, rgb(11, 0, 74) 38%, rgb(0, 73, 184) 75%, rgb(48, 131, 236) 100%)",
      }}
    >
      <main className="z-[1] flex flex-col justify-center p-4 sm:p-9 box-border flex-[1_1_0%] max-w-[90%] sm:max-w-[500px] bg-black/25 backdrop-blur-[20px] rounded-[20px] md:min-w-[330px]">
        <div>
          <div className="mb-4 sm:mb-8 flex items-center justify-center">
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
            <SignUpBox />
          </div>
          <p className="text-muted-foreground text-center text-xs mt-1">
            By clicking continue, you agree to our{" "}
            <Link
              href="https://dardibook.in/documents/terms-conditions"
              className="hover:text-primary underline underline-offset-4"
              target="_blank"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="https://dardibook.in/documents/privacy-policy"
              className="hover:text-primary underline underline-offset-4"
              target="_blank"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </main>

      <div className="fixed top-0 left-0 w-full h-svh">
        {/* <iframe
          src="https://signup2.framer.website"
          width="100%"
          height="100%"
          title="visual"
        ></iframe> */}
      </div>
    </section>
  );
};

export default Page;
