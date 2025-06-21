"use client";

import { auth as firebaseAuth } from "@/firebase/firebaseConfig";
import { useAuth } from "@clerk/nextjs";
import { onAuthStateChanged, signInWithCustomToken } from "firebase/auth";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

export const FirebaseAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { getToken, isSignedIn } = useAuth();
  const [authLoading, setAuthLoading] = useState(true);
  const hasAttempted = useRef(false);

  useEffect(() => {
    const syncFirebaseAuth = async () => {
      if (hasAttempted.current || !isSignedIn || firebaseAuth.currentUser) {
        setAuthLoading(false);
        return;
      }

      hasAttempted.current = true;
      try {
        const token = await getToken({ template: "integration_firebase" });
        if (token) {
          await signInWithCustomToken(firebaseAuth, token);
        }
      } catch (error) {
        console.error("Firebase sign-in failed", error);
        toast.error("Authentication error. Please try again.");
      } finally {
        setAuthLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(firebaseAuth, () => {
      syncFirebaseAuth();
    });

    return () => unsubscribe();
  }, [getToken, isSignedIn]);

  return authLoading ? (
    <div className="w-screen h-svh overflow-hidden flex items-center justify-center bg-background">
      <p className="absolute bottom-2 right-2 text-muted-foreground text-xs font-medium">
        Connecting to Firebase...
      </p>
      <Image
        src="/Logo.svg"
        height={208}
        width={208}
        alt="DardiBook Logo"
        className="h-52"
        priority
      />
    </div>
  ) : (
    children
  );
};
