"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import TokenBox from "@/components/tokenFramer/TokenBox";
import { useRefContext } from "@/hooks/RefContext";

const Pip = () => {
  const pipRef = useRef(null);
  const snapRef = useRefContext();
  const modifyTarget = (target) => {
    if (pipRef.current && snapRef.current) {
      var constraintsRect = snapRef.current.getBoundingClientRect();
      const pipRect = pipRef.current.getBoundingClientRect();
      const pipMiddleX = pipRect.width / 2;
      const pipMiddleY = pipRect.height / 2;

      if (target + pipMiddleX > constraintsRect.width / 2) {
        return constraintsRect.width;
      } else if (target + pipMiddleY > constraintsRect.height / 2) {
        return constraintsRect.height;
      }

      return 0;
    }
  };

  const transition = {
    power: 0,
    min: 0,
    max: 0,
    timeConstant: 250,
    modifyTarget,
  };

  return (
    <motion.div
      className="pip"
      ref={pipRef}
      drag
      dragConstraints={snapRef}
      dragElastic={0.1}
      dragTransition={transition}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "auto",
        height: "auto",
      }}
      whileTap={{ cursor: "grabbing" }}
    >
      <TokenBox />
    </motion.div>
  );
};

export default Pip;
