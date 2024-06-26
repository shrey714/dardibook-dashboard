import React from "react";
import Layout from "./layout/page";

export default function DummyPage({ title }) {
  return (
    <Layout pageTitle={title}>
      <div className="min-h-screen flex flex-col">
        <div className="m-auto">
          <h1 className="text-4xl">{title}</h1>
        </div>
      </div>
    </Layout>
  );
}
