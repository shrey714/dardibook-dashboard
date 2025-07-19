"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight, PartyPopperIcon, CheckCircle2, Sparkles, Zap, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Badge } from "../ui/badge";
import Image from "next/image";

const STAGGER_CHILD_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, type: "spring" } },
};

const nextSteps = [
  {
    title: "Set Up Your Profile",
    description: "Complete your clinic details and doctor profiles",
    icon: CheckCircle2
  },
  {
    title: "Import Patient Data",
    description: "Transfer existing patient records to DardiBook",
    icon: Zap
  },
  {
    title: "Configure Settings",
    description: "Customize the system to match your workflow",
    icon: ShieldCheck
  }
];

export default function Done() {
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
      <Card className="w-full border-none shadow-lg bg-gradient-to-br from-background to-muted/50 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/80 via-primary to-primary/80"></div>
        <CardContent className="px-4 sm:px-8 space-y-3 sm:space-y-6">
          <motion.div
            variants={STAGGER_CHILD_VARIANTS}
            className="flex flex-col items-center space-y-4 sm:space-y-6 text-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg"></div>
              <PartyPopperIcon className="relative w-12 h-12 sm:w-16 sm:h-16 text-primary drop-shadow-md" />
            </div>
            <Badge variant="outline" className="px-3 sm:px-4 py-0.5 sm:py-1 bg-primary/10 text-primary border-primary/20 text-xs sm:text-sm">
              Congratulations!
            </Badge>
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              You&apos;re all set!
            </h1>
            <p className="max-w-2xl text-sm sm:text-base md:text-lg text-accent-foreground/80 leading-relaxed">
              Welcome to DardiBook — your smart healthcare management platform.
              Start managing your clinic like never before.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full max-w-3xl">
              {nextSteps.map((step, index) => (
                <div 
                  key={step.title}
                  className="bg-background/50 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-border/50 flex flex-col items-center text-center space-y-2 sm:space-y-3"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/10 rounded-full blur-md"></div>
                    <div className="relative h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-medium text-xs sm:text-sm">{index + 1}</span>
                    </div>
                  </div>
                  <h3 className="font-medium text-xs sm:text-base">{step.title}</h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">{step.description}</p>
                  <step.icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-1 sm:mt-2" />
                </div>
              ))}
            </div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                <h3 className="font-medium text-sm sm:text-base">What&apos;s Next?</h3>
              </div>
              <p className="text-[10px] sm:text-sm text-muted-foreground text-left">
                Your DardiBook account is now ready to use. Our dashboard gives you access to all the tools you need to manage your practice efficiently. You can:
              </p>
              <ul className="space-y-1.5 sm:space-y-2 text-left">
                {[
                  "Start scheduling patient appointments",
                  "Create and manage digital prescriptions",
                  "Set up your token system for the waiting room",
                  "Import or add patient records",
                  "Customize your clinic settings"
                ].map((item) => (
                  <li key={item} className="flex items-start space-x-2">
                    <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-[10px] sm:text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-border/50">
              <div className="aspect-video relative overflow-hidden rounded-md shadow-md">
                <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
                  <Image 
                    src="/Hospital.svg" 
                    alt="DardiBook Dashboard Preview" 
                    width={120}
                    height={120}
                    className="opacity-50"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                  <div className="p-3 sm:p-4 text-white text-left">
                    <h4 className="font-medium text-xs sm:text-base">Your Dashboard</h4>
                    <p className="text-[10px] sm:text-xs opacity-90">Everything you need in one place</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-3 sm:mt-4 space-y-2">
                <h4 className="font-medium text-xs sm:text-sm">Need Help Getting Started?</h4>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="text-[10px] sm:text-xs h-7 sm:h-8">
                    Watch Tutorial
                  </Button>
                  <Button variant="outline" size="sm" className="text-[10px] sm:text-xs h-7 sm:h-8">
                    Book Demo
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <motion.div variants={STAGGER_CHILD_VARIANTS} className="flex justify-center">
            <Button
              asChild
              size="lg"
              className="px-6 sm:px-10 text-xs sm:text-sm"
              effect={"expandIcon"}
              icon={ArrowRight}
              iconPlacement="right"
            >
              <Link href={"/dashboard"}>Go to Dashboard</Link>
            </Button>
          </motion.div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-[10px] sm:text-xs text-muted-foreground">Need help? Contact support@dardibook.com</p>
          <Badge variant="outline" className="bg-primary/5">
            <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 text-primary" />
            <span className="text-primary text-[10px] sm:text-xs">Premium Account</span>
          </Badge>
        </CardFooter>
      </Card>
    </motion.div>
  );
}