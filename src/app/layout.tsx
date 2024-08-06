import "@/styles/globals.css";
import { Alegreya_Sans } from "next/font/google";
import Script from "next/script";
import type { Metadata } from "next";
import AppWrapper from "@/components/wrapper/AppWrapper";
import ReduxWrapper from "@/components/wrapper/ReduxWrapper";
import { Toaster } from "react-hot-toast";
const manrope = Alegreya_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "DardiBook | DashBoard",
  description: "App to help doctors to track their patient",
  icons: {
    icon: "/favicon.png", // /public path
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <html
        lang="en"
        className={manrope.className}
        style={{ scrollbarGutter: "auto" }}
      >
        <body style={{ minHeight: "100vh" }} suppressHydrationWarning={true}>
        <Toaster position="top-right" />
          <ReduxWrapper>
            <AppWrapper>{children}</AppWrapper>
          </ReduxWrapper>
        </body>
      </html>
    </>
  );
};

export default RootLayout;
