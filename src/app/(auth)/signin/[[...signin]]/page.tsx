import FlickeringGrid from "@/components/AuthPage/FlickeringGrid";
import Image from "next/image";
import { Typewriter } from "@/components/common/Text-Typing";
import { SignIn } from "@clerk/nextjs";

const Page = () => {
  return (
    <>
      <section className="relative h-svh w-full overflow-hidden flex justify-center">
        <FlickeringGrid
          className="z-0 absolute inset-0 size-full"
          squareSize={4}
          gridGap={6}
          color="rgba(1, 116, 158, 1)"
          maxOpacity={0.5}
          flickerChance={0.1}
        />
        <div className="h-svh flex flex-col items-center justify-center w-full sm:w-4/5">
          <div className="z-50 flex flex-1 items-center justify-center">
            <div className="w-full flex-col flex items-center justify-center">
              <Typewriter
                list={[
                  "Welcome to DardiBook",
                  "Access your DardiBook account to manage appointments, prescriptions, and patient records with ease.",
                  "Stay connected and streamline your healthcare management.",
                ]}
              />
            </div>
          </div>

          <div className="z-50 max-h-min py-8 px-[12.5%] bg-background w-full flex flex-1 flex-col items-center rounded- justify-between rounded-t-3xl overflow-hidden transition-all shadow-[0_0_20px_2px_rgba(8,_112,_184,_0.7)]">
            <div className="h-11 flex items-center justify-center md:w-3/5">
              <SignIn
                appearance={{
                  elements: {
                    header: "hidden",
                    rootBox: "flex justify-center items-center w-full",
                    cardBox: "shadow-none w-full rounded-md",
                    card: "w-full shadow-none p-0",
                    button: "bg-primary text-primary-foreground hover:text-primary hover:bg-secondary h-11 !border border-border rounded-md",
                    footer: {
                      display: "none",
                    },
                  },
                }}
              />
            </div>
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
