import { motion } from "framer-motion";
import React from "react";

export const RegistrationOptions = () => {
  return (
    <motion.div
      key={"registration"}
      className="flex flex-col mx-0 w-full gap-2"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { type: "tween", ease: "easeInOut" },
        },
      }}
    >
      <div className="bg-sidebar/50 rounded-md border h-96 flex items-center justify-center">
        RegistrationOptions
      </div>
    </motion.div>
  );
};
