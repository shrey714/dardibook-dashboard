/* eslint-disable @next/next/no-img-element */
import React from "react";

interface authProps {
  header: {
    title: string;
    desc: string;
  };
  children: React.ReactNode;
}

const AuthHeaderWrapper: React.FC<authProps> = ({ header, children }) => {
  return (
    <section className="bg-white">
      <div className="lg:grid h-screen overflow-hidden lg:grid-cols-12">
        <section className="relative flex h-10 items-end bg-white lg:col-span-4 lg:h-screen xl:col-span-3">
          <div className="hidden lg:relative lg:block lg:p-12">
            <a className="block text-gray-800" href="#">
              <span className="sr-only">Home</span>
              <img
                alt=""
                src="/Logo.svg"
                className="h-10 sm:h-14 aspect-square"
              />
            </a>

            <h2 className="mt-6 text-xl font-bold text-gray-800 sm:text-2xl md:text-3xl">
              {header.title}
            </h2>

            <p className="mt-4 leading-relaxed text-gray-800/90">
              {header.desc}
            </p>
          </div>
        </section>

        <main className="h-[calc(100vh-40px)] lg:h-screen grid justify-center overflow-y-auto bg-gray-300 px-8 sm:px-12 lg:col-span-8 lg:px-16 xl:col-span-9">
          <div className="my-8 flex flex-col lg:my-12 max-w-xl lg:max-w-3xl">
            <div className="relative -mt-16 block lg:hidden">
              <a
                className="fixed top-2 sm:top-0 inline-flex size-16 items-center justify-center rounded-full bg-white text-blue-600 sm:size-20"
                href="#"
              >
                <span className="sr-only">Home</span>
                <img
                  alt=""
                  src="/Logo.svg"
                  className="h-10 sm:h-14 aspect-square z-20"
                />
              </a>

              <h1 className="mt-16 sm:mt-20 text-2xl font-bold text-gray-800 sm:text-2xl md:text-4xl">
                {header.title}
              </h1>

              <p className="mt-1 leading-relaxed text-gray-800/90">
                {header.desc}
              </p>
            </div>
            {children}
          </div>
        </main>
      </div>
    </section>
  );
};

export default AuthHeaderWrapper;
