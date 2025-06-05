import FlickeringGrid from "@/components/AuthPage/FlickeringGrid";
import Image from "next/image";
import { Typewriter } from "@/components/common/Text-Typing";
import LoginBox from "@/components/AuthPage/LoginBox";
import Link from "next/link";

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

          <div className="z-50 max-h-fit py-8 px-[12.5%] bg-background w-full flex flex-1 flex-col items-center rounded- justify-between rounded-t-3xl overflow-hidden transition-all shadow-[0_0_20px_2px_rgba(8,_112,_184,_0.7)]">
            <div className="flex items-center justify-center md:w-3/5">
              <LoginBox />
            </div>


          <p className='text-muted-foreground px-8 text-center text-sm mt-5'>
            By clicking continue, you agree to our{' '}
            <Link
              href='/terms'
              className='hover:text-primary underline underline-offset-4'
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              href='/privacy'
              className='hover:text-primary underline underline-offset-4'
            >
              Privacy Policy
            </Link>
            .
          </p>


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
