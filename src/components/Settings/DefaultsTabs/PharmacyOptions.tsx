import { motion } from "framer-motion";
import React from "react";

export const PharmacyOptions = () => {
  return (
    <motion.div
      key={"pharmacy"}
      className="flex flex-col mx-0 w-full gap-2"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{
        hidden: {
          opacity: 0,
          y: 50,
          transition: { type: "tween", ease: "anticipate" },
        },
        visible: {
          opacity: 1,
          y: 0,
          transition: { type: "tween", ease: "anticipate" },
        },
      }}
    >
      <div className="bg-sidebar/50 rounded-md border h-96 flex items-center justify-center">
        PharmacyOptions
      </div>
    </motion.div>
  );
};
