// dashboard/terms-and-conditions.js
import Head from "next/head";
import DocWrapper from "../layout";

export default function TermsAndConditions() {
  return (
    <DocWrapper>
      <div>
        <Head>
          <title>Terms and Conditions - DardiBook</title>
        </Head>
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            Terms and Conditions
          </h1>

          <div
            className="bg-white bg-opacity-70 p-6 rounded-lg shadow-lg"
            style={{ overflowY: "auto" }}
          >
            <h2 className="text-xl font-semibold mb-4">Proprietary Rights</h2>
            <p className="text-gray-700 mb-4">
              The content on this website, including text, graphics, logos,
              images, and software, is the property of DardiBook or its
              licensors and is protected by intellectual property laws. You
              agree not to reproduce, distribute, modify, or create derivative
              works of any content without explicit permission from DardiBook.
            </p>

            <h2 className="text-xl font-semibold mb-4">
              Usage of the Website and Use of Services by the User
            </h2>
            <p className="text-gray-700 mb-4">
              By accessing or using this website and its services, you agree to
              comply with these Terms and Conditions and any additional
              guidelines or policies provided by DardiBook. You agree to use the
              Services solely for their intended purposes and refrain from
              engaging in any activities that violate laws or infringe upon the
              rights of others.
            </p>

            <h2 className="text-xl font-semibold mb-4">Payment</h2>
            <p className="text-gray-700 mb-4">
              Certain services offered on this website may require payment. By
              subscribing to or purchasing these services, you agree to pay all
              applicable fees and charges. Payments are processed securely
              through our authorized payment gateway provider. DardiBook
              reserves the right to modify pricing or billing terms at any time,
              upon reasonable notice to users.
            </p>

            <h2 className="text-xl font-semibold mb-4">
              Limitation of Liability
            </h2>
            <p className="text-gray-700 mb-4">
              DardiBook and its affiliates, directors, officers, employees,
              agents, and suppliers shall not be liable for any direct,
              indirect, incidental, special, consequential, or exemplary
              damages, including but not limited to, damages for loss of
              profits, goodwill, use, data, or other intangible losses resulting
              from your use of the website or services.
            </p>
          </div>
        </div>
      </div>
    </DocWrapper>
  );
}
