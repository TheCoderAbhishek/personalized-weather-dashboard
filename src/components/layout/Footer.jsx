// src/components/layout/Footer.jsx
import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-4 text-center">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        &copy; {new Date().getFullYear()} Weather Dashboard. All rights
        reserved.
      </motion.p>
    </footer>
  );
}

export default Footer;
