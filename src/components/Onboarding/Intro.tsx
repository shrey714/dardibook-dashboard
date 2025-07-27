"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { CheckCircle2, Sparkles, ShieldCheck, Clock } from "lucide-react";
import Image from "next/image";

const STAGGER_CHILD_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, type: "spring" } },
};

const benefits = [
  {
    title: "Save Time",
    description: "Reduce administrative work by 40%",
    icon: Clock,
  },
  {
    title: "Improve Care",
    description: "Access complete patient history instantly",
    icon: CheckCircle2,
  },
  {
    title: "Secure Data",
    description: "HIPAA compliant & fully encrypted",
    icon: ShieldCheck,
  },
];

const features = ["Appointments", "Prescriptions", "Patient Records"];

export default function Intro() {
  return (
    <motion.div
      className="w-full max-w-5xl mx-auto my-14"
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, type: "spring" }}
    >
      <Card className="overflow-hidden w-full">
        <CardHeader className="pb-0 px-4 sm:px-8 gap-0">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center"
          >
            <Badge
              variant="outline"
              className="px-3 sm:px-4 bg-primary/10 text-primary border-primary/20 text-xs sm:text-sm"
            >
              <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1" />
              Healthcare Simplified
            </Badge>
          </motion.div>
        </CardHeader>
        <CardContent className="px-4 sm:px-8 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
            <motion.div
              variants={{
                show: {
                  transition: {
                    staggerChildren: 0.2,
                  },
                },
              }}
              initial="hidden"
              animate="show"
              className="flex flex-col items-center md:items-start space-y-4 sm:space-y-6 text-center md:text-left"
            >
              <motion.div
                className="relative w-16 sm:w-20 h-16 sm:h-20 mb-2"
                variants={STAGGER_CHILD_VARIANTS}
              >
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
                <div className="relative w-full h-full flex items-center justify-center">
                  <Image
                    src="/Logo.svg"
                    alt="DardiBook Logo"
                    width={60}
                    height={60}
                    className="drop-shadow-md w-12 h-12 sm:w-14 sm:h-14"
                  />
                </div>
              </motion.div>

              <motion.h1
                className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-foreground bg-clip-text bg-gradient-to-r from-primary to-primary/70"
                variants={STAGGER_CHILD_VARIANTS}
              >
                Welcome to{" "}
                <span className="text-primary font-bold tracking-tight">
                  DardiBook
                </span>
              </motion.h1>

              <motion.p
                className="max-w-md text-sm sm:text-base md:text-lg text-accent-foreground/80 leading-relaxed"
                variants={STAGGER_CHILD_VARIANTS}
              >
                Your all-in-one healthcare platform designed specifically for
                medical professionals. Streamline your practice with our
                comprehensive suite of tools.
              </motion.p>

              <motion.div
                variants={STAGGER_CHILD_VARIANTS}
                className="w-full flex justify-center md:justify-start space-x-4 pt-2"
              >
                <Button
                  asChild
                  effect={"ringHover"}
                  size="lg"
                  className="px-6 sm:px-10 text-sm sm:text-base font-medium"
                >
                  <Link href={"/onboarding?type=features"}>Get Started</Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Benefits section - hidden on mobile, shown on tablet/desktop */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative hidden md:block"
            >
              <div className="absolute inset-0 bg-primary/5 rounded-2xl"></div>
              <div className="relative p-6 bg-background/50 backdrop-blur-sm rounded-2xl border border-border/60 shadow-sm">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">
                    Why doctors choose DardiBook:
                  </h3>
                  <div className="space-y-3">
                    {benefits.map((benefit) => (
                      <div
                        key={benefit.title}
                        className="flex items-start space-x-3"
                      >
                        <div className="p-1.5 rounded-full bg-primary/10">
                          <benefit.icon className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{benefit.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Mobile benefits section - only shown on mobile */}
          <motion.div
            variants={STAGGER_CHILD_VARIANTS}
            initial="hidden"
            animate="show"
            className="md:hidden w-full flex flex-col mt-6 sm:mt-8 divide-y divide-border/50"
          >
            {benefits.map((benefit, index) => {
              const isFirst = index === 0;
              const isLast = index === features.length - 1;
              return (
                <div
                  key={benefit.title}
                  className={`flex items-center space-x-3 bg-background/50 p-3 border-l border-r border-border/50 ${
                    isFirst ? "rounded-t-lg border-t" : ""
                  } ${isLast ? "rounded-b-lg !border-b" : ""}`}
                >
                  <div className="p-1.5 rounded-full bg-primary/10">
                    <benefit.icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{benefit.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </motion.div>

          <motion.div
            variants={STAGGER_CHILD_VARIANTS}
            initial="hidden"
            animate="show"
            className="w-full inline-flex mt-6 sm:mt-8 divide-x divide-border/50"
            role="group"
          >
            {features.map((feature, index) => {
              const isFirst = index === 0;
              const isLast = index === features.length - 1;

              return (
                <div
                  key={feature}
                  className={`bg-background/50 flex flex-1 items-center justify-center border-border/50 border-t border-b backdrop-blur-sm p-2.5 text-center shadow-sm ${
                    isFirst ? "rounded-l-full border-l" : ""
                  } ${isLast ? "rounded-r-full !border-r" : ""}
            `}
                >
                  <p className="text-xs sm:text-sm font-medium text-foreground">
                    {feature}
                  </p>
                </div>
              );
            })}
          </motion.div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-2 px-4 sm:px-8 text-center sm:text-left">
          <p className="text-xs text-muted-foreground">
            Secure & HIPAA Compliant
          </p>
          <p className="text-xs text-muted-foreground">
            Trusted by 1000+ healthcare providers
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
