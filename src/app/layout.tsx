import "@/styles/globals.css";
import { DM_Sans } from "next/font/google";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import Image from "next/image";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import { ClerkLoaded, ClerkLoading, ClerkProvider } from "@clerk/nextjs";
import TopBarLoader from "@/components/common/TopBarLoader";
import { FirebaseAuthProvider } from "@/components/wrapper/FirebaseAuthProvider";
import { NuqsAdapter } from "nuqs/adapters/next/app";
const DM_Sans_Font = DM_Sans({
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={DM_Sans_Font.className}
        style={{ scrollbarGutter: "auto" }}
        suppressHydrationWarning
      >
        <body className="min-h-svh" suppressHydrationWarning={true}>
          <NextThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Toaster position="top-right" />
            <ClerkLoading>
              <div className="w-screen h-svh overflow-hidden flex items-center justify-center bg-background">
                <p className="absolute bottom-2 right-2 text-muted-foreground text-xs font-medium">
                  Welcome aboard DardiBook...
                </p>
                <div>
                  <TopBarLoader />
                </div>
                <Image
                  src="/Logo.svg"
                  height={208}
                  priority={true}
                  width={208}
                  alt="Flowbite Logo"
                  className="h-52"
                />
              </div>
            </ClerkLoading>
            <ClerkLoaded>
              <FirebaseAuthProvider>
                <NuqsAdapter> {children} </NuqsAdapter>
              </FirebaseAuthProvider>
            </ClerkLoaded>
          </NextThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
