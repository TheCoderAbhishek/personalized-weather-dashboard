// src/components/common/LoadingSpinner.jsx
import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-20">
      <motion.div
        className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
        animate={{ rotate: 360 }}
        transition={{
          loop: Infinity,
          duration: 1,
          ease: "linear",
        }}
      />
    </div>
  );
}

export default LoadingSpinner;
