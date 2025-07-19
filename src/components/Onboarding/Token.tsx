"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  ArrowRight,
  TimerIcon,
  BellRing,
  PauseCircle,
  SkipForward,
  CheckCircle2,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Progress } from "../ui/progress";

const STAGGER_CHILD_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, type: "spring" } },
};

const features = [
  {
    title: "Real-time Queue",
    description: "Live updates for patients and staff",
    icon: TimerIcon,
  },
  {
    title: "Notifications",
    description: "Automated alerts when it's the patient's turn",
    icon: BellRing,
  },
  {
    title: "Queue Management",
    description: "Pause, skip, or rearrange patients as needed",
    icon: PauseCircle,
  },
  {
    title: "Priority Handling",
    description: "Fast-track urgent cases when necessary",
    icon: SkipForward,
  },
];

const queueExample = [
  {
    number: 1,
    name: "John Doe",
    status: "In Progress",
    time: "10:00 AM",
    progress: 80,
  },
  {
    number: 2,
    name: "Jane Smith",
    status: "Waiting",
    time: "10:15 AM",
    progress: 0,
  },
  {
    number: 3,
    name: "Robert Johnson",
    status: "Waiting",
    time: "10:30 AM",
    progress: 0,
  },
];

export default function TokenSystem() {
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
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/30 rounded-full blur-3xl"></div>
        <CardContent className="px-4 sm:px-8 space-y-4 sm:space-y-6">
          <motion.div
            variants={STAGGER_CHILD_VARIANTS}
            className="flex flex-col items-center space-y-4 sm:space-y-6 text-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-lg"></div>
              <TimerIcon className="relative w-12 h-12 sm:w-16 sm:h-16 text-purple-500 drop-shadow-md" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-purple-600">
              Real-Time Token Management
            </h1>
            <p className="max-w-2xl text-sm sm:text-base md:text-lg text-accent-foreground/80 leading-relaxed">
              Eliminate waiting chaos! Use DardiBook&apos;s smart token system
              to call patients, pause queues, and manage your flow — all in real
              time.
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
                    <div className="p-1.5 sm:p-2 rounded-full bg-purple-500/10">
                      <feature.icon className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
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
                    "Reduce perceived waiting time by up to 60%",
                    "Improve patient satisfaction scores",
                    "Optimize staff productivity",
                    "Create a calmer waiting environment",
                  ].map((benefit) => (
                    <div key={benefit} className="flex items-start space-x-2">
                      <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500 mt-0.5 shrink-0" />
                      <span className="text-[10px] sm:text-xs">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-medium text-left">
                Live Queue Example
              </h3>

              <div className="bg-background/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-border/50">
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <div>
                    <h4 className="text-xs sm:text-sm font-medium">
                      Current Queue
                    </h4>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      Monday, 10:05 AM
                    </p>
                  </div>
                  <div className="bg-purple-500/10 text-purple-500 rounded-md px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium">
                    3 Patients Waiting
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {queueExample.map((patient) => (
                    <div
                      key={patient.number}
                      className="bg-background/80 rounded-md p-2 sm:p-3 border border-border/50"
                    >
                      <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500 font-medium">
                            <span className="text-xs sm:text-sm">
                              {patient.number}
                            </span>
                          </div>
                          <div className="text-left">
                            <p className="text-xs sm:text-sm font-medium">
                              {patient.name}
                            </p>
                            <p className="text-[10px] sm:text-xs text-muted-foreground">
                              {patient.time}
                            </p>
                          </div>
                        </div>
                        <div
                          className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${
                            patient.status === "In Progress"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-amber-500/10 text-amber-500"
                          }`}
                        >
                          {patient.status}
                        </div>
                      </div>
                      {patient.progress > 0 && (
                        <div className="w-full">
                          <Progress
                            value={patient.progress}
                            className="h-1 sm:h-1.5"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-center space-x-2 mt-3 sm:mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[10px] sm:text-xs h-7 sm:h-8 px-2 sm:px-3 border-purple-500/20 text-purple-500"
                  >
                    Call Next
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[10px] sm:text-xs h-7 sm:h-8 px-2 sm:px-3 border-purple-500/20 text-purple-500"
                  >
                    Pause Queue
                  </Button>
                </div>
              </div>

              <div className="bg-purple-500/5 rounded-lg p-3 sm:p-4 border border-purple-500/10">
                <p className="text-[10px] sm:text-xs text-purple-600 font-medium">
                  Our waiting room is now much calmer. Patients love being able
                  to track their position in the queue and get notifications
                  when it&apos;s their turn.
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">
                  — Dr. Lisa Williams, Pediatrics
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
              <Link href={"/onboarding?type=subscription"}>
                Next: Subscriptions
              </Link>
            </Button>
          </motion.div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            Includes waiting time estimates and SMS notifications
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
