"use client";

import { CookieIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  const accept = () => {
    setIsOpen(false);
    document.cookie =
      "cookieConsent=true; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT; Secure; SameSite=Strict";
  };

  const decline = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (document.cookie.includes("cookieConsent=true")) {
      setIsOpen(false);
      setShouldRender(false);
    } else {
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      const timeout = setTimeout(() => {
        setShouldRender(false);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      className={cn(
        "fixed z-[200] bottom-2 left-2 right-2 sm:left-auto sm:right-3 sm:bottom-3 sm:max-w-md px-4 sm:px-0 transition-[opacity,transform] ease-in-out transform duration-500 backdrop-blur-[20px] bg-white/20 dark:bg-black/25 rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.2)]",
        isOpen
          ? "translate-y-0 opacity-100"
          : "translate-y-6 opacity-0 pointer-events-none"
      )}
    >
      <div className="flex items-center justify-between p-3 border-b">
        <h1 className="text-lg font-medium leading-none">
          We value your privacy
        </h1>
        <CookieIcon className="h-[1.2rem] w-[1.2rem]" />
      </div>
      <div className="px-3 py-2">
        <p className="text-xs text-left text-muted-foreground">
          DardiBook uses cookies to enhance your experience.
          <br />
          <span className="text-xs">
            By clicking <span className="font-semibold">Accept</span>, you
            consent to the use of cookies as described in our policy.
          </span>
          <br />
          <a
            target="_blank"
            href="https://dardibook.in/documents/privacy-policy"
            className="text-xs underline"
          >
            View our Privacy Policy.
          </a>
        </p>
      </div>
      <div className="p-2 flex items-center gap-2 border-t">
        <Button onClick={accept} className="w-full h-9">
          accept
        </Button>
        <Button onClick={decline} className="w-full h-9" variant="secondary">
          decline
        </Button>
      </div>
    </div>
  );
}
