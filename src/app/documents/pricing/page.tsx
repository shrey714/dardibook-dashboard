"use client";
import Head from "next/head";
import DocWrapper from "../page";
import SubscriptionPlans from "@/components/SubscriptionPlans";

export default function Pricing() {
  return (
    <DocWrapper>
      <div>
        <Head>
          <title>Pricing - DardiBook</title>
        </Head>
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-center mb-8">Pricing</h1>
          <div className="bg-white p-1 bg-opacity-70 rounded-lg shadow-lg">
            <SubscriptionPlans />
          </div>
        </div>
      </div>
    </DocWrapper>
  );
}
