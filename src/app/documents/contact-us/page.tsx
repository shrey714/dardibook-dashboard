import Head from "next/head";
import DocWrapper from "../layout";

export default function ContactUs() {
  return (
    <DocWrapper>
      <div className="flex-1 flex items-center justify-center">
        <Head>
          <title>Contact Us - DardiBook</title>
        </Head>
        <div className="max-w-md w-full bg-white bg-opacity-70 p-8 my-10 rounded shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center">Contact Us</h1>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Operating Address</h2>
            <p className="text-gray-700">
              17, Jaladham duplex, Opps Jalaram temple, Karelibaugh, Vadodara -
              390018
            </p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Call Us</h2>
            <p className="text-gray-700">+91 9824335930 , +91 9512095862</p>
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Email Us</h2>
            <p className="text-gray-700">
              <a href="mailto:jeet@dardibook.in">jeet@dardibook.in</a>,{" "}
              <a href="mailto:shrey@dardibook.in">shrey@dardibook.in</a>
            </p>
          </div>
        </div>
      </div>
    </DocWrapper>
  );
}
