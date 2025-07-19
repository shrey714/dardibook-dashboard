"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ClipboardListIcon,
  FileTextIcon,
  BookOpenIcon,
  TimerIcon,
  Sparkles,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";

const STAGGER_CHILD_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, type: "spring" } },
};

const features = [
  {
    label: "Manage Appointments",
    href: "/onboarding?type=appointments",
    icon: ClipboardListIcon,
    color: "from-blue-500/20 to-blue-600/20",
    description:
      "Schedule, reschedule, and manage patient appointments with ease.",
    benefits: ["Online booking", "SMS reminders", "Recurring appointments"],
  },
  {
    label: "Create Prescriptions",
    href: "/onboarding?type=prescriptions",
    icon: FileTextIcon,
    color: "from-green-500/20 to-green-600/20",
    description:
      "Generate digital prescriptions with complete medication details.",
    benefits: ["Digital signatures", "Medication history", "Dosage tracking"],
  },
  {
    label: "Track Patient History",
    href: "/onboarding?type=history",
    icon: BookOpenIcon,
    color: "from-amber-500/20 to-amber-600/20",
    description:
      "Access complete patient records and medical history instantly.",
    benefits: [
      "Chronological timeline",
      "Document storage",
      "Search functionality",
    ],
  },
  {
    label: "Use Token System",
    href: "/onboarding?type=token",
    icon: TimerIcon,
    color: "from-purple-500/20 to-purple-600/20",
    description:
      "Streamline patient flow with our advanced token management system.",
    benefits: [
      "Real-time updates",
      "Queue management",
      "Waiting time estimates",
    ],
  },
];

export default function Features() {
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
      <Card className="w-full">
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
              Explore Features
            </Badge>
          </motion.div>
        </CardHeader>

        <CardContent className="px-4 sm:px-8">
          <motion.div
            variants={STAGGER_CHILD_VARIANTS}
            className="flex flex-col items-center space-y-3"
          >
            <p className="text-xl sm:text-2xl font-bold tracking-normal text-card-foreground leading-normal">
              DardiBook
            </p>
            <h1 className="font-display max-w-2xl text-2xl sm:text-3xl md:text-4xl font-semibold">
              What would you like to explore?
            </h1>
            <p className="max-w-lg text-sm sm:text-base text-muted-foreground px-2 text-center">
              DardiBook offers a comprehensive suite of tools designed
              specifically for healthcare providers. Choose a module below to
              see how we can transform your practice workflow.
            </p>
          </motion.div>

          <motion.div
            variants={STAGGER_CHILD_VARIANTS}
            className="grid w-full grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6"
          >
            {features.map(({ label, href, icon: Icon, color, description }) => (
              <Button
                key={label}
                variant={"outline"}
                effect={"ringHover"}
                asChild
                className="min-h-[150px] sm:min-h-[180px] md:min-h-[200px] overflow-hidden group"
              >
                <Link
                  href={href}
                  className="flex flex-col items-center justify-center space-y-3 sm:space-y-4 p-3 sm:p-5 w-full h-full"
                >
                  <div
                    className={`relative p-3 md:p-4 rounded-full bg-gradient-to-br ${color} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon
                      size={24}
                      className="!size-6 md:!size-6 text-foreground"
                    />
                  </div>
                  <div className="space-y-1 w-full">
                    <p className="font-medium text-sm sm:text-base">{label}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2 truncate">
                      {description}
                    </p>
                  </div>
                </Link>
              </Button>
            ))}
          </motion.div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            All features are included in our subscription plans
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
