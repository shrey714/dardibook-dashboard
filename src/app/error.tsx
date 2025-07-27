"use client";
/* eslint-disable @next/next/no-img-element */
import Header from "@/components/HeaderDocument";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import React from "react";

const ServerError = () => {
  return (
    <div className="pt-24 min-h-screen">
      <Header />

      <section className="bg-whit">
        <div className="container flex-1 flex-col px-6 py-12 mx-auto flex items-center gap-12">
          <div className="flex justify-center relative w-full mt-12 lg:w-1/2">
            <img
              className="w-full max-w-lg lg:mx-auto"
              src="/error.svg"
              alt=""
            />
          </div>
          <div className="wf-ull lg:w-1/2">
            <p className="text-sm font-medium text-blue-400">Server Error !</p>
            <h1 className="mt-3 text-2xl font-semibold text-gray-600 md:text-3xl">
              Something went wrong !
            </h1>
            <p className="mt-4 text-gray-500">
              Sorry, please try again or report this error at the link provided
              below :
            </p>
            <div className="flex items-center justify-center mt-6 gap-x-3">
              <Button variant={"secondary"} asChild>
                <Link href="/">Take me home</Link>
              </Button>
              <Button variant={"destructive"} asChild>
                <Link href="https://dardibook.in/documents/contact-us">
                  Report
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServerError;
