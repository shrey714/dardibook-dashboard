"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  ArrowRight,
  FileSignatureIcon,
  Pill,
  Clock,
  Share2,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "../ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

const STAGGER_CHILD_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, type: "spring" } },
};

const features = [
  {
    title: "Digital Prescriptions",
    description: "Create and manage digital prescriptions with ease",
    icon: FileSignatureIcon,
  },
  {
    title: "Medication Database",
    description: "Access comprehensive medication information",
    icon: Pill,
  },
  {
    title: "Dosage Scheduling",
    description: "Set precise medication schedules and reminders",
    icon: Clock,
  },
  {
    title: "Instant Sharing",
    description: "Share prescriptions directly with patients or pharmacies",
    icon: Share2,
  },
];

const faqs = [
  {
    question: "How secure are digital prescriptions?",
    answer:
      "All prescriptions are encrypted end-to-end and comply with healthcare security standards including HIPAA. Only authorized personnel can access or modify prescription data.",
  },
  {
    question: "Can patients access their prescriptions online?",
    answer:
      "Yes, patients can access their prescriptions through the secure patient portal. They can view medication details, dosage instructions, and set up reminders.",
  },
  {
    question: "Is the medication database regularly updated?",
    answer:
      "Yes, our medication database is updated weekly with the latest medications, dosage guidelines, and potential interactions to ensure you have the most current information.",
  },
];

export default function Prescriptions() {
  return (
    <motion.div
      className="mx-auto w-full max-w-5xl my-14"
      variants={{
        hidden: { opacity: 0, scale: 0.95 },
        show: {
          opacity: 1,
          scale: 1,
          transition: {
            staggerChildren: 0.2,
          },
        },
      }}
      initial="hidden"
      animate="show"
      exit="hidden"
      transition={{ duration: 0.3, type: "spring" }}
    >
      <Card className="w-full relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-green-500/30 rounded-full blur-3xl"></div>
        <CardContent className="px-4 sm:px-8 space-y-3 sm:space-y-6">
          <motion.div
            variants={STAGGER_CHILD_VARIANTS}
            className="flex flex-col items-center space-y-4 sm:space-y-6 text-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-green-500/20 rounded-full blur-lg"></div>
              <FileSignatureIcon className="relative w-12 h-12 sm:w-16 sm:h-16 text-green-500 drop-shadow-md" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-green-600">
              Generate Smart Digital Prescriptions
            </h1>
            <p className="max-w-2xl text-sm sm:text-base md:text-lg text-accent-foreground/80 leading-relaxed">
              Easily create digital prescriptions with dosage schedules,
              medicine instructions, and timing — and share them instantly with
              your patients.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-left">
                Key Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="bg-background/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-border/50 flex flex-col items-center text-center space-y-2"
                  >
                    <div className="p-1.5 sm:p-2 rounded-full bg-green-500/10">
                      <feature.icon className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                    </div>
                    <h4 className="font-medium text-xs sm:text-sm">
                      {feature.title}
                    </h4>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-background/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-border/50 text-left">
                <h3 className="text-xs sm:text-sm font-medium mb-2">
                  Benefits
                </h3>
                <div className="space-y-1.5 sm:space-y-2">
                  {[
                    "Reduce medication errors by up to 70%",
                    "Save time with templates and quick prescribing",
                    "Improve patient adherence to medication",
                    "Track prescription history for better care",
                  ].map((benefit) => (
                    <div key={benefit} className="flex items-start space-x-2">
                      <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-[10px] sm:text-xs">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-left">
                Common Questions
              </h3>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`item-${i}`}
                    className="border-b border-border/50"
                  >
                    <AccordionTrigger className="text-xs sm:text-sm font-medium text-left py-3 sm:py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-[10px] sm:text-xs text-muted-foreground text-left">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="bg-green-500/5 rounded-lg p-3 sm:p-4 border border-green-500/10">
                <p className="text-[10px] sm:text-xs text-green-600 font-medium">
                  DardiBook&apos;s prescription system has reduced our
                  medication errors by 65% and saved our staff hours each week.
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">
                  — Dr. Sarah Johnson, Family Medicine
                </p>
              </div>
            </div>
          </div>

          <motion.div
            variants={STAGGER_CHILD_VARIANTS}
            className="flex justify-center"
          >
            <Button
              asChild
              size="lg"
              className="px-6 sm:px-10 text-xs sm:text-sm"
              effect={"expandIcon"}
              icon={ArrowRight}
              iconPlacement="right"
            >
              <Link scroll={true} href={"/onboarding?type=history"}>
                Next: Patient History
              </Link>
            </Button>
          </motion.div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            Compliant with e-prescription regulations
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
