"use client";
import { FileIcon, ServerIcon } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const STAGGER_CHILD_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, type: "spring" } },
};

export default function Next() {
  return (
    <motion.div
      className="z-10 mx-5 flex flex-col items-center space-y-10 text-center sm:mx-auto"
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
      <motion.div
        variants={STAGGER_CHILD_VARIANTS}
        className="flex flex-col items-center space-y-10 text-center"
      >
        <p className="text-2xl font-bold tracking-tighter text-foreground">
          Papermark
        </p>
        <h1 className="font-display max-w-md text-3xl font-semibold transition-colors sm:text-4xl">
          What do you want to share today?
        </h1>
      </motion.div>
      <motion.div
        variants={STAGGER_CHILD_VARIANTS}
        className="grid w-full grid-cols-1 divide-y divide-border rounded-md border border-border text-foreground md:grid-cols-2 md:divide-x"
      >
        <Link
          href={"/onboarding?type=select"}
          className="flex min-h-[200px] flex-col items-center justify-center space-y-5 overflow-hidden p-5 transition-colors hover:bg-gray-200 hover:dark:bg-gray-800 md:p-10"
        >
          <FileIcon className="pointer-events-none h-auto w-12 sm:w-12" />
          <p>Document</p>
        </Link>
        <Link
          href={"/onboarding?type=dataroom"}
          className="flex min-h-[200px] flex-col items-center justify-center space-y-5 overflow-hidden p-5 transition-colors hover:bg-gray-200 hover:dark:bg-gray-800 md:p-10"
        >
          <ServerIcon className="pointer-events-none h-auto w-12 sm:w-12" />
          <p>Data Room</p>
        </Link>
      </motion.div>

      {/* <motion.div variants={STAGGER_CHILD_VARIANTS} className="text-center">
        <button
          className="text-center text-sm text-muted-foreground underline-offset-4 transition-all hover:text-gray-800 hover:underline hover:dark:text-muted-foreground/80"
          onClick={() =>
            router.push({
              pathname: "/welcome",
              query: {
                type: "dataroom",
              },
            })
          }
        >
          Sharing Data Room is possible in 7 day free trial
        </button>
      </motion.div> */}
    </motion.div>
  );
}
