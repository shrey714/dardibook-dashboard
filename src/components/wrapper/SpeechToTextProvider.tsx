// components/SpeechToTextProvider.tsx
import { Mic } from "lucide-react";
import React, { useEffect, useState } from "react";

const SpeechToTextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [recognition, setRecognition] = useState<any>(null);
  const [micActive, setmicActive] = useState(false);
  const [activeElement, setActiveElement] = useState<
    HTMLInputElement | HTMLTextAreaElement | null
  >(null);

  useEffect(() => {
    // Initialize SpeechRecognition
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = "en-US"; // Set language as needed
      setRecognition(recognitionInstance);
    } else {
      console.warn("SpeechRecognition API is not supported in this browser.");
    }
  }, []);

  useEffect(() => {
    const handleFocus = (event: FocusEvent) => {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
      ) {
        setActiveElement(target);
      }
    };

    const handleBlur = () => {
      setActiveElement(null);
    };

    document.addEventListener("focusin", handleFocus);
    document.addEventListener("focusout", handleBlur);

    return () => {
      document.removeEventListener("focusin", handleFocus);
      document.removeEventListener("focusout", handleBlur);
    };
  }, []);

  useEffect(() => {
    if (recognition && activeElement) {
      setmicActive(true);
      recognition.onresult = (event: any) => {
        const transcript =
          event.results[event.results.length - 1][0].transcript;
        if (activeElement) {
          activeElement.value += transcript; // Append the speech-to-text result
        }
      };

      recognition.start();

      return () => {
        setmicActive(false);
        recognition.stop();
      };
    }
  }, [recognition, activeElement]);

  return (
    <>
      <div
        className={`absolute z-50 top-20 right-20 transition-all duration-500 ${
          micActive
            ? "opacity-100 scale-100 translate-x-0 translate-y-0"
            : "opacity-0 scale-50 translate-x-10 -translate-y-10 pointer-events-none"
        }`}
      >
        <div className="mic">
          <Mic className="mic-icon" />
          <div className="mic-shadow"></div>
        </div>
      </div>
      {children}
    </>
  );
};

export default SpeechToTextProvider;
