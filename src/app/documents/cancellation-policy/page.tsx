// dashboard/cancellation-policy.js
import Head from "next/head";
export default function CancellationPolicy() {
  return (
      <div>
        <Head>
          <title>Cancellation Policy - DardiBook</title>
        </Head>
        <div className="max-w-4xl mx-auto pb-12 px-4 sm:px-6 lg:px-8 text-gray-800">
          <h1 className="text-3xl font-bold text-center mb-8">
            Cancellation Policy
          </h1>

          <div
            className="p-6 bg-white rounded-lg shadow-[0px_0px_0px_1px_#a0aec0]"
            style={{ overflowY: "auto" }}
          >
            <h2 className="text-xl font-semibold mb-4">
              Appointment Cancellation
            </h2>
            <p className="mb-4">
              Patients can cancel appointments with DardiBook up to 24 hours
              before the scheduled time without any cancellation fee.
            </p>

            <h2 className="text-xl font-semibold mb-4">
              Late Cancellation and No-Show
            </h2>
            <p className="mb-4">
              A cancellation fee may apply for appointments canceled less than
              24 hours before the scheduled time or for patients who fail to
              show up for their scheduled appointment (no-show).
            </p>

            <h2 className="text-xl font-semibold mb-4">Refund Policy</h2>
            <p className="mb-4">
              Refunds for canceled appointments are processed within [number]
              business days after the cancellation request is approved. Refunds
              are issued to the original payment method used for the appointment
              booking.
            </p>

            <h2 className="text-xl font-semibold mb-4">Policy Changes</h2>
            <p className="mb-4">
              DardiBook reserves the right to modify this cancellation policy at
              any time. Changes will be effective immediately upon posting on
              the website. It is the responsibility of patients to review this
              policy periodically for updates.
            </p>
          </div>
        </div>
      </div>
  );
}
