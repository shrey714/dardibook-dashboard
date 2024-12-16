import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import Image from "next/image";
import { Maximize, Minimize, Pause } from "lucide-react";
const BoxContainer = ({
  CurrentToken,
  loading,
  isPaused,
  allowTokenSceenExpand,
}: any) => {
  const [isExpanded, setisExpanded] = useState(false);

  return (
    <>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            key={`dardibook-${CurrentToken}`}
            animate={isExpanded ? "expanded" : "collapsed"}
            variants={{
              collapsed: {
                // opacity: 1
              },
              expanded: {
                // opacity: 0,
              },
            }}
            layoutId={`card-714`}
            onClick={() => {
              allowTokenSceenExpand && setisExpanded(!isExpanded);
            }}
            style={{
              userSelect: "none",
              borderRadius: "0px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#000",
              cursor: "none",
              top: "0px",
              left: "0px",
              right: "0px",
              height: "100svh",
              zIndex: 111999,
            }}
            className="fixed"
          >
            <Image
              src="/Logo.svg"
              fill={true}
              className="document-background-image"
              alt="logo"
            />

            {allowTokenSceenExpand && (
              <Minimize className="size-4 text-white absolute top-4 right-4 opacity-20" />
            )}

            <motion.h3
              layoutId={`h3-714`}
              style={{
                margin: 0,
                marginTop: "10px",
                marginBottom: "10px",
                color: "white",
                fontWeight: "bold",
                fontSize: "18rem",
              }}
            >
              {loading || isPaused ? (
                <Pause className="size-48 text-white" />
              ) : (
                CurrentToken
              )}
            </motion.h3>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        // layout
        key={714}
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={{
          collapsed: {
            // opacity: 1
          },
          expanded: {
            // opacity: 0,
          },
        }}
        layoutId={`card-714`}
        onClick={() => {
          allowTokenSceenExpand && setisExpanded(!isExpanded);
        }}
        style={{
          userSelect: "none",
          borderRadius: "6px",
          cursor: "pointer",
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000",
        }}
      >
        {/* Add image here also */}

        {allowTokenSceenExpand && (
          <Maximize className="size-3 text-white absolute top-2 right-2" />
        )}
        <motion.h3
          layoutId={`h3-714`}
          style={{
            margin: 0,
            marginTop: "10px",
            marginBottom: "10px",
            color: "white",
            fontWeight: "bold",
            fontSize: "3rem",
          }}
        >
          {loading || isPaused ? (
            <Pause className="size-10 text-white" />
          ) : (
            CurrentToken
          )}
        </motion.h3>
      </motion.div>
    </>
  );
};

export default BoxContainer;
