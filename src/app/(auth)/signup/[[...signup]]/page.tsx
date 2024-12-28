import FlickeringGrid from "@/components/AuthPage/FlickeringGrid";
import Image from "next/image";
import { Typewriter } from "@/components/common/Text-Typing";
import { SignUp } from "@clerk/nextjs";

const Page = () => {
  return (
    <>
      <section className="relative bg-gray-300 h-svh w-full overflow-hidden flex justify-center">
        <FlickeringGrid
          className="z-0 absolute inset-0 size-full"
          squareSize={4}
          gridGap={6}
          color="#60A5FA"
          maxOpacity={0.5}
          flickerChance={0.1}
        />
        <div className="h-svh flex flex-col items-center justify-center w-full sm:w-4/5">
          <div className="z-50 flex flex-1 items-center justify-center">
            <div className="w-full flex-col flex items-center justify-center">
              <Typewriter
                list={[
                  "Welcome to DardiBook",
                  "Access your DardiBook account to manage appointments, prescriptions and more.",
                  "Stay connected and streamline your healthcare management.",
                ]}
              />
            </div>
          </div>

          <div className="z-50 py-8 h-52 px-[12.5%] bg-gray-900 w-full flex flex-1 flex-col items-center justify-between rounded-t-3xl overflow-y-auto pt-12 shadow-[0_0_20px_2px_rgba(8,_112,_184,_0.7)] transition-all">
            <SignUp
              appearance={{
                elements: {
                  header: "hidden",
                },
              }}
            />
            <Image
              alt="Logo"
              src="/Logo.svg"
              width={56}
              height={56}
              className="h-12 sm:h-14 aspect-square mt-5"
              priority
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;