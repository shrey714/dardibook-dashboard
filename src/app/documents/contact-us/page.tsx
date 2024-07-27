import Head from "next/head";

export default function ContactUs() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <Head>
        <title>Contact Us - DardiBook</title>
      </Head>
      <div className="max-w-md w-full pb-12 px-4 rounded text-gray-800">
        <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>
        <div
          className="p-6 rounded-lg shadow-[0px_0px_0px_1px_#a0aec0] bg-white"
          style={{ overflowY: "auto" }}
        >
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
    </div>
  );
}
