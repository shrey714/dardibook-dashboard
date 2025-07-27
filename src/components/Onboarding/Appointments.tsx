"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  ArrowRight,
  CalendarClockIcon,
  CheckCircle2,
  BellRing,
  Calendar,
  Users,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const STAGGER_CHILD_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, type: "spring" } },
};

const features = [
  {
    title: "Smart Scheduling",
    description: "AI-powered scheduling that optimizes your clinic's workflow",
    icon: Calendar,
  },
  {
    title: "Automated Reminders",
    description: "Reduce no-shows with SMS and email notifications",
    icon: BellRing,
  },
  {
    title: "Patient Portal",
    description: "Allow patients to book and manage their appointments online",
    icon: Users,
  },
];

export default function Appointments() {
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
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/30 rounded-full blur-3xl"></div>

        <CardContent className="px-4 sm:px-8 space-y-3 sm:space-y-6">
          <motion.div
            variants={STAGGER_CHILD_VARIANTS}
            className="flex flex-col items-center space-y-4 sm:space-y-6 text-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg"></div>
              <CalendarClockIcon className="relative w-12 h-12 sm:w-16 sm:h-16 text-primary drop-shadow-md" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Effortless Appointment Scheduling
            </h1>
            <p className="max-w-2xl text-sm sm:text-base md:text-lg text-accent-foreground/80 leading-relaxed">
              Allow patients to book slots online and manage your clinic&apos;s
              time efficiently with our intuitive appointment system.
            </p>
          </motion.div>

          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full max-w-sm sm:max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="features" className="">
                Key Features
              </TabsTrigger>
              <TabsTrigger value="demo" className="">
                How It Works
              </TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="mt-4 sm:mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {features.map((feature) => (
                  <Card
                    key={feature.title}
                    className="bg-background/50 backdrop-blur-sm border border-border/50"
                  >
                    <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center space-y-3 sm:space-y-4">
                      <div className="p-2 sm:p-3 rounded-full bg-primary/10">
                        <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <h3 className="font-medium text-sm sm:text-base">
                        {feature.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="demo" className="mt-4 sm:mt-6">
              <Card className="border border-border/50 bg-background/50 backdrop-blur-sm">
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="font-medium text-base sm:text-lg">
                      Appointment Workflow
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      {[
                        "Patient books appointment through web portal or mobile app",
                        "System sends confirmation and reminder notifications",
                        "Doctor receives notification and appointment details",
                        "Patient receives waiting token number on arrival",
                        "Post-visit follow-up is automatically scheduled",
                      ].map((step, i) => (
                        <div
                          key={i}
                          className="flex items-start space-x-2 sm:space-x-3"
                        >
                          <div className="bg-primary/10 text-primary rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-[10px] sm:text-xs font-medium">
                              {i + 1}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-left">{step}</p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-border/50">
                      <h4 className="font-medium text-sm sm:text-base mb-2">
                        Benefits
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          "Reduce no-shows by up to 40%",
                          "Save 5+ hours of admin work weekly",
                          "Improve patient satisfaction",
                          "Optimize clinic capacity",
                        ].map((benefit) => (
                          <div
                            key={benefit}
                            className="flex items-center space-x-2"
                          >
                            <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-primary shrink-0" />
                            <span className="text-xs sm:text-sm">
                              {benefit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

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
              <Link href={"/onboarding?type=prescriptions"}>
                Next: Prescriptions
              </Link>
            </Button>
          </motion.div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            Compatible with Google Calendar and other popular scheduling tools
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
