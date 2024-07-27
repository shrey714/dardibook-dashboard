"use client";
import Head from "next/head";
import SubscriptionPlans from "@/components/SubscriptionPlans";

export default function Pricing() {
  return (
      <div>
        <Head>
          <title>Pricing - DardiBook</title>
        </Head>
        <div className="max-w-4xl mx-auto pb-12 px-4 sm:px-6 lg:px-8 text-gray-800">
        <h1 className="text-3xl font-bold text-center mb-8">Pricing</h1>
          <div className="bg-white p-2 rounded-lg shadow-[0px_0px_0px_1px_#a0aec0]">
            <SubscriptionPlans />
          </div>
        </div>
      </div>
  );
}
