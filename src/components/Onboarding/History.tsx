"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenIcon,
  Search,
  FileText,
  BarChart3,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const STAGGER_CHILD_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, type: "spring" } },
};

const features = [
  {
    title: "Comprehensive Records",
    description: "Store complete patient medical history in one place",
    icon: FileText,
  },
  {
    title: "Powerful Search",
    description: "Find patient information in seconds",
    icon: Search,
  },
  {
    title: "Health Analytics",
    description: "Track trends and generate health insights",
    icon: BarChart3,
  },
];

const timelineEvents = [
  {
    date: "Today",
    title: "Follow-up Appointment",
    type: "appointment",
    description: "Blood pressure check and medication review",
  },
  {
    date: "2 weeks ago",
    title: "Prescription Updated",
    type: "prescription",
    description: "Amlodipine 5mg daily for hypertension",
  },
  {
    date: "1 month ago",
    title: "Lab Results",
    type: "lab",
    description: "Cholesterol panel and blood glucose test",
  },
  {
    date: "3 months ago",
    title: "Initial Consultation",
    type: "appointment",
    description: "First visit for hypertension symptoms",
  },
];

export default function History() {
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
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/30 rounded-full blur-3xl"></div>
        <CardContent className="px-4 sm:px-8 space-y-3 sm:space-y-6">
          <motion.div
            variants={STAGGER_CHILD_VARIANTS}
            className="flex flex-col items-center space-y-4 sm:space-y-6 text-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-lg"></div>
              <BookOpenIcon className="relative w-12 h-12 sm:w-16 sm:h-16 text-amber-500 drop-shadow-md" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-amber-600">
              Complete Patient History at Your Fingertips
            </h1>
            <p className="max-w-2xl text-sm sm:text-base md:text-lg text-accent-foreground/80 leading-relaxed">
              Every visit, prescription, and diagnosis is securely stored.
              Review your patients&apos; medical history instantly — whenever
              needed.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-left">
                Key Features
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="bg-background/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-border/50 flex items-center space-x-3 sm:space-x-4"
                  >
                    <div className="p-1.5 sm:p-2 rounded-full bg-amber-500/10 shrink-0">
                      <feature.icon className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium text-xs sm:text-sm">
                        {feature.title}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-background/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-border/50 text-left">
                <h3 className="text-xs sm:text-sm font-medium mb-2">
                  Benefits
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    "Faster diagnosis",
                    "Reduced duplicate tests",
                    "Better continuity of care",
                    "Improved patient outcomes",
                  ].map((benefit) => (
                    <div key={benefit} className="flex items-start space-x-2">
                      <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-amber-500 mt-0.5 shrink-0" />
                      <span className="text-[10px] sm:text-xs">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base sm:text-lg font-medium text-left">
                  Patient Timeline
                </h3>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
                    <AvatarImage src="Patients.jpg" />
                    <AvatarFallback className="text-[10px] sm:text-xs bg-amber-500/10 text-amber-500">
                      JD
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-[10px] sm:text-xs">John Doe</span>
                </div>
              </div>

              <div className="bg-background/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-border/50">
                <div className="relative pl-4 sm:pl-6 border-l border-amber-500/30">
                  {timelineEvents.map((event, i) => (
                    <div key={i} className="mb-3 sm:mb-4 last:mb-0">
                      <div className="absolute -left-1.5">
                        <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-amber-500"></div>
                      </div>
                      <div className="text-left">
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          {event.date}
                        </p>
                        <p className="text-xs sm:text-sm font-medium">
                          {event.title}
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-500/5 rounded-lg p-3 sm:p-4 border border-amber-500/10">
                <p className="text-[10px] sm:text-xs text-amber-600 font-medium">
                  Having complete patient history available has improved our
                  diagnostic accuracy by 40% and reduced unnecessary tests.
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">
                  — Dr. Michael Chen, Internal Medicine
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
              <Link href={"/onboarding?type=token"}>Next: Token System</Link>
            </Button>
          </motion.div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            HIPAA compliant with end-to-end encryption
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
