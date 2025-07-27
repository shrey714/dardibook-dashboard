"use client";

import { motion } from "framer-motion";

import { Button } from "../ui/button";
import Link from "next/link";

const STAGGER_CHILD_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, type: "spring" } },
};

export default function Intro() {
  return (
    <motion.div
      className="z-10"
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, type: "spring" }}
    >
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
        className="mx-5 flex flex-col items-center space-y-10 text-center sm:mx-auto"
      >
        <motion.h1
          className="font-display text-4xl font-bold text-foreground transition-colors sm:text-5xl"
          variants={STAGGER_CHILD_VARIANTS}
        >
          Welcome to{" "}
          <span className="font-bold tracking-tighter">Papermark</span>
        </motion.h1>
        <motion.p
          className="max-w-md text-accent-foreground/80 transition-colors sm:text-lg"
          variants={STAGGER_CHILD_VARIANTS}
        >
          Papermark gives you the power to securely share your documents with an
          impression that lasts.
        </motion.p>
        <motion.div
          variants={STAGGER_CHILD_VARIANTS}
          // className="rounded  px-10 py-2 font-medium transition-colors text-gray-900 bg-gray-100 hover:text-gray-100 hover:bg-gray-500"
        >
          <Button asChild className="px-10 text-base font-medium">
            <Link href={"/onboarding?type=next"}>Get Started</Link>
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
