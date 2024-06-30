import "@/styles/globals.css";
import { Alegreya_Sans } from "next/font/google";
import Script from "next/script";
import type { Metadata } from "next";
import AppWrapper from "@/components/wrapper/AppWrapper";
import ReduxWrapper from "@/components/wrapper/ReduxWrapper";
const alegreya_sans = Alegreya_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "DardiBook",
  description: "App to help doctors to track their patient",
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <html lang="en" className={alegreya_sans.className}>
        <body className="min-h-screen">
          <ReduxWrapper>
            <AppWrapper>{children}</AppWrapper>
          </ReduxWrapper>
        </body>
      </html>
    </>
  );
};

export default RootLayout;
