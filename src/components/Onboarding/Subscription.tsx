"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheckIcon,
  CheckCircle2,
  Star,
  Shield,
  Clock,
  Users,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "../ui/card";

const STAGGER_CHILD_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, type: "spring" } },
};

const plans = [
  {
    name: "Basic",
    price: "$29",
    period: "per month",
    description: "Perfect for small practices",
    features: [
      "Up to 100 patient records",
      "Basic appointment scheduling",
      "Digital prescriptions",
      "Email support",
    ],
    recommended: false,
  },
  {
    name: "Professional",
    price: "$79",
    period: "per month",
    description: "Ideal for growing clinics",
    features: [
      "Unlimited patient records",
      "Advanced scheduling system",
      "Complete prescription management",
      "Token system",
    ],
    recommended: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "For hospitals and large practices",
    features: [
      "All Professional features",
      "Multiple location support",
      "Custom integrations",
      "Dedicated account manager",
    ],
    recommended: false,
  },
];

const benefits = [
  {
    title: "Premium Support",
    description: "Get priority access to our support team",
    icon: Star,
  },
  {
    title: "Data Security",
    description: "Enterprise-grade security for your data",
    icon: Shield,
  },
  {
    title: "Regular Updates",
    description: "Access to the latest features and improvements",
    icon: Clock,
  },
  {
    title: "Team Access",
    description: "Add unlimited staff members to your account",
    icon: Users,
  },
];

export default function Subscription() {
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
              <BadgeCheckIcon className="relative w-12 h-12 sm:w-16 sm:h-16 text-primary drop-shadow-md" />
            </div>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Choose Your Perfect Plan
            </h1>
            <p className="max-w-2xl text-sm sm:text-base md:text-lg text-accent-foreground/80 leading-relaxed">
              DardiBook offers flexible subscription plans to fit practices of
              all sizes. Select the plan that works best for your needs.
            </p>
          </motion.div>

          <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`border gap-0 py-0 ${
                  plan.recommended
                    ? "border-primary/50 shadow-lg shadow-primary/10"
                    : "border-border/50"
                } overflow-hidden`}
              >
                <div
                  className={`bg-primary text-primary-foreground text-[10px] sm:text-xs py-0.5 sm:py-1 text-center font-medium ${
                    plan.recommended ? "visible" : "invisible"
                  }`}
                >
                  RECOMMENDED
                </div>

                <CardContent className="p-3 sm:p-6 space-y-3 sm:space-y-4">
                  <div>
                    <h3 className="font-medium text-sm sm:text-lg">
                      {plan.name}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                      {plan.description}
                    </p>
                  </div>

                  <div>
                    <span className="text-xl sm:text-3xl font-bold">
                      {plan.price}
                    </span>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      {" "}
                      {plan.period}
                    </span>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2 text-left">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-start space-x-2">
                        <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-primary mt-0.5 shrink-0" />
                        <span className="text-[10px] sm:text-xs">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant={plan.recommended ? "default" : "outline"}
                    className="w-full text-[10px] sm:text-xs h-7 sm:h-9"
                    asChild
                  >
                    <Link href={"/onboarding?type=done"}>
                      {plan.name === "Enterprise"
                        ? "Contact Sales"
                        : "Select Plan"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="bg-background/50 backdrop-blur-sm rounded-lg p-3 sm:p-4 border border-border/50 flex flex-col items-center text-center space-y-1.5 sm:space-y-2"
              >
                <div className="p-1.5 sm:p-2 rounded-full bg-primary/10">
                  <benefit.icon className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-primary" />
                </div>
                <h4 className="font-medium text-xs sm:text-sm">
                  {benefit.title}
                </h4>
                <p className="text-[10px] sm:text-xs text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            ))}
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
              <Link href={"/onboarding?type=done"}>Skip to Finish</Link>
            </Button>
          </motion.div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            30-day money-back guarantee. No contracts, cancel anytime.
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
