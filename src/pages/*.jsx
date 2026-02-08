import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faSeedling } from "@fortawesome/free-solid-svg-icons";

import DotGarden from "@components/DotGarden";
import { useTitle } from "@utils/useTitle";

export default function NotFound() {
  useTitle("Page Not Found");

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <DotGarden className="absolute inset-0 w-full h-full opacity-40" />

      <div className="absolute inset-0 bg-gradient-to-t from-surface-50/95 via-surface-50/60 to-surface-50/30 dark:from-surface-950/95 dark:via-surface-950/60 dark:to-surface-950/30" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative text-center px-6"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 mb-6"
        >
          <FontAwesomeIcon
            icon={faSeedling}
            className="w-7 h-7 text-primary-600 dark:text-primary-400"
          />
        </motion.div>

        <h1 className="text-7xl sm:text-8xl font-bold text-surface-200 dark:text-surface-800 mb-2">
          404
        </h1>

        <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 dark:text-white mb-3">
          Nothing planted here
        </h2>

        <p className="text-lg text-surface-600 dark:text-surface-400 max-w-md mx-auto mb-8">
          This page doesn&rsquo;t exist yet. Maybe it was moved, or maybe it&rsquo;s still a seed
          waiting to grow.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-xl bg-primary-600 dark:bg-primary-500 text-white hover:bg-primary-700 dark:hover:bg-primary-400 transition-colors"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" />
          Back to the garden
        </Link>
      </motion.div>
    </div>
  );
}
