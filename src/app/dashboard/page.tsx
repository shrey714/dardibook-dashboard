"use client";
import { pages } from "@/components/Home/QuickLinks";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

const Page = () => {
  const { orgRole, isLoaded } = useAuth();

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[calc(100svh-52px)] max-w-5xl mx-auto">
      <div className="text-center space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold">
          Welcome to <span className="text-primary">DardiBook</span>
        </h1>

        <div className="text-sm sm:text-lg text-muted-foreground space-y-4">
          <p>
            Your all-in-one healthcare management solution for streamlined
            clinical workflows
          </p>

          <p>
            DardiBook is your all-in-one healthcare management platform designed
            to simplify and streamline clinical workflows. From scheduling
            appointments to generating prescriptions and maintaining patient
            history, everything is handled in one place—efficiently and
            securely.
          </p>

          <p>
            Whether you&apos;re a doctor, assistant, or part of the medical
            staff, DardiBook empowers you to focus more on patient care and less
            on paperwork.
          </p>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 w-full">
        {isLoaded &&
          orgRole &&
          pages.map((item, index) => {
            const isAccess = item.roles.includes(orgRole);

            if (isAccess) {
              return (
                <Link
                  href={item.url}
                  key={index}
                  className={`${item.color} text-card-foreground col-span-1 flex flex-col items-center justify-center p-4 sm:p-5 hover:bg-accent/20 border dark:border-0 transition-colors cursor-pointer rounded-lg shadow`}
                >
                  <div className="rounded-full p-3 bg-primary/10 mb-2">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium text-center line-clamp-1 text-sm sm:text-base">
                    {item.title}
                  </h3>
                </Link>
              );
            } else {
              return (
                <div
                  key={index}
                  className={`${item.color} opacity-50 text-card-foreground col-span-1 flex flex-col items-center justify-center p-4 sm:p-5 border dark:border-0 cursor-not-allowed rounded-lg shadow`}
                >
                  <div className="rounded-full p-3 bg-primary/10 mb-2">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium text-center line-clamp-1 text-sm sm:text-base">
                    {item.title}
                  </h3>
                </div>
              );
            }
          })}
      </div>

      {/* Help & Links */}
      <div className="mt-6 text-center text-sm text-muted-foreground">
        Need help?{" "}
        <a
          href="https://dardibook.in"
          className="text-primary underline underline-offset-2"
        >
          Read the Docs
        </a>{" "}
        or{" "}
        <a
          href="/onboarding"
          className="text-primary underline underline-offset-2"
        >
          Restart Onboarding
        </a>
      </div>
    </div>
  );
};

export default Page;
