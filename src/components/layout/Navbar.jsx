// src/components/layout/Navbar.jsx
import React, { useState } from "react";
import { FaCloudSun, FaBars, FaTimes, FaUserCircle } from "react-icons/fa";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center text-white">
          <FaCloudSun className="mr-2 text-3xl animate-pulse" />
          <span className="font-semibold text-xl">Weather Dashboard</span>
        </div>

        <div className="hidden sm:flex space-x-4">
          <motion.a
            href="#"
            whileHover={{ scale: 1.1 }}
            className="text-white hover:text-gray-200"
          >
            Home
          </motion.a>
          <motion.a
            href="#"
            whileHover={{ scale: 1.1 }}
            className="text-white hover:text-gray-200"
          >
            About
          </motion.a>
          <motion.a
            href="#"
            whileHover={{ scale: 1.1 }}
            className="text-white hover:text-gray-200"
          >
            Contact
          </motion.a>
        </div>

        <div className="sm:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-white">
            {isOpen ? (
              <FaTimes className="text-2xl" />
            ) : (
              <FaBars className="text-2xl" />
            )}
          </button>
        </div>

        <div className="hidden sm:block">
          <motion.button whileHover={{ scale: 1.1 }} className="text-white">
            <FaUserCircle className="text-2xl" />
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="sm:hidden mt-2"
          >
            <div className="flex flex-col space-y-2">
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                className="text-white hover:text-gray-200"
              >
                Home
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                className="text-white hover:text-gray-200"
              >
                About
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                className="text-white hover:text-gray-200"
              >
                Contact
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
