"use client";
import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../redux/store";
import { signInWithGoogle } from "../../../firebase/firebaseAuth";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/store";
import Loader from "@/components/common/Loader";
import FlickeringGrid from "@/components/AuthPage/FlickeringGrid";
import Image from "next/image";

const SignIn = () => {
  const user = useAppSelector((state) => state.auth.user);
  const [loading, setloading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const handleSignIn = async () => {
    setloading(true);
    const data = await signInWithGoogle(dispatch, router);
    setloading(false);
  };
  useEffect(() => {
    setloading(true);
    if (user) {
      router.replace("/");
    } else {
      setloading(false);
    }
  }, [router, user]);

  const header = {
    title: "Welcome to DardiBook",
    desc: "Access your DardiBook account to manage appointments, prescriptions, and patient records with ease. Stay connected and streamline your healthcare management.",
  };
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
            <div className="w-max flex items-center justify-center">
              <h1 className="h-auto font-sans select-none animate-typing overflow-hidden whitespace-nowrap border-r-4 border-r-gray-700 pr-4 sm:pr-8 text-[28px] sm:text-5xl text-gray-800 font-bold">
                {header.title}
              </h1>
            </div>
          </div>

          <div className="z-50 max-h-52 py-8 px-[12.5%] bg-gray-900 w-full flex flex-1 flex-col items-center justify-between rounded-t-3xl overflow-hidden hover:max-h-56 hover:pt-12 hover:px-[calc(12.5%+8px)] hover:w-[calc(100%+16px)] hover:shadow-[0_20px_50px_rgba(8,_112,_184,_0.7)] transition-all">
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="bg-gray-300 border-0 animate-none btn px-5 py-[10px] text-gray-800 outline-none min-w-40 transition-all flex items-center justify-center h-10 text-base sm:text-lg font-bold tracking-wide w-full rounded-full select-none font-sans"
            >
              {loading ? (
                <Loader
                  size="medium"
                  color="text-gray-300"
                  secondaryColor="text-primary"
                />
              ) : (
                <>
                  <Image
                    alt="Google"
                    src="/google.svg"
                    width={20}
                    height={20}
                    priority
                  />
                  <p className="hidden sm:contents" >Continue with Google</p>
                  <p className="sm:hidden" >Google</p>
                </>
              )}
            </button>

            <Image
              alt="Logo"
              src="/Logo.svg"
              width={56}
              height={56}
              className="h-12 sm:h-14 aspect-square mt-3"
              priority
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default SignIn;
