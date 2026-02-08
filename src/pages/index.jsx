import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowRight,
  faBook,
  faCircleInfo,
  faCode,
  faRocket,
  faSeedling,
} from "@fortawesome/free-solid-svg-icons";

import { posts } from "virtual:pages.jsx";
import BlogCard from "@components/BlogCard";
import DotGarden from "@components/DotGarden";
import { useTitle } from "@utils/useTitle";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: "easeOut" },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

function WaveDivider({ className, flip }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      style={flip ? { transform: "scaleY(-1)" } : undefined}
    >
      <path
        d="M0 30 C360 60 720 0 1080 30 C1260 45 1380 25 1440 30 L1440 60 L0 60Z"
        className="fill-surface-50 dark:fill-surface-950"
      />
    </svg>
  );
}

export default function Index() {
  useTitle("Gabriel J. Csapo");

  const recentPosts = posts?.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);

  return (
    <div>
      {/* Hero — immersive nature landscape with overlaid text */}
      <section className="relative min-h-[75vh] flex items-end overflow-hidden">
        <DotGarden className="absolute inset-0 w-full h-full" />

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-50/90 via-surface-50/40 to-transparent dark:from-surface-950/90 dark:via-surface-950/40 dark:to-transparent" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative w-full max-w-4xl mx-auto px-6 pb-16 pt-32"
        >
          <motion.div
            variants={fadeUp}
            custom={0}
            className="flex items-center gap-2 text-primary-700 dark:text-primary-400 mb-5"
          >
            <FontAwesomeIcon icon={faSeedling} className="w-4 h-4" />
            <span className="text-sm font-medium tracking-wide uppercase">
              Home-Cooked Software
            </span>
            <a
              href="https://maggieappleton.com/home-cooked-software"
              target="_blank"
              rel="noopener noreferrer"
              title="Learn about the home-cooked software movement"
              className="inline-flex items-center justify-center w-5 h-5 rounded-full text-primary-500 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
            >
              <FontAwesomeIcon icon={faCircleInfo} className="w-3.5 h-3.5" />
            </a>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-4xl sm:text-6xl font-bold text-surface-900 dark:text-white mb-6 leading-tight"
          >
            Software, just for you.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-xl text-surface-700 dark:text-surface-300 max-w-2xl leading-relaxed mb-3"
          >
            Not everything needs to scale to millions. The best tools are the ones made with care
            for the people who actually use them &mdash; software that&rsquo;s personal, thoughtful,
            and built for a specific need.
          </motion.p>

          <motion.p
            variants={fadeUp}
            custom={3}
            className="text-lg text-surface-600 dark:text-surface-400 max-w-2xl leading-relaxed"
          >
            This is home-cooked software &mdash; apps made for yourself, your family, or your
            community. No venture capital, no growth metrics. Just tools grown with intention and
            tended with care.
          </motion.p>
        </motion.div>

        {/* Organic wave transition into content */}
        <WaveDivider className="absolute bottom-0 left-0 w-full h-12" />
      </section>

      {/* Featured Projects */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={stagger}
        className="max-w-4xl mx-auto px-6 py-16"
      >
        <motion.div
          variants={fadeUp}
          className="flex items-center gap-2 text-sm font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-8"
        >
          <FontAwesomeIcon icon={faCode} className="w-3.5 h-3.5" />
          Featured Projects
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Compendus */}
          <motion.div
            variants={fadeUp}
            custom={0}
            className="rounded-3xl border border-primary-200 dark:border-surface-700 bg-primary-50/50 dark:bg-surface-800/50 p-6 sm:p-8 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-3">
              <FontAwesomeIcon
                icon={faBook}
                className="w-5 h-5 text-primary-600 dark:text-primary-400"
              />
              <h2 className="text-xl font-bold text-surface-900 dark:text-white">Compendus</h2>
            </div>
            <p className="text-surface-600 dark:text-surface-300 leading-relaxed mb-5 flex-1">
              A personal digital library &mdash; your own space to collect, organize, and read
              everything. Self-hosted with a native Swift companion app.
            </p>

            <div className="flex flex-wrap gap-1.5 mb-6">
              {["PDF", "EPUB", "MOBI", "CBR", "CBZ", "TypeScript", "React", "SQLite", "Swift"].map(
                (tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs font-medium rounded-full bg-white/80 dark:bg-surface-700 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-600"
                  >
                    {tag}
                  </span>
                ),
              )}
            </div>

            <a
              href="https://github.com/gabrielcsapo/Compendus"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-primary-600 dark:bg-primary-500 text-white hover:bg-primary-700 dark:hover:bg-primary-400 transition-colors self-start"
            >
              <FontAwesomeIcon icon={faGithub} className="w-4 h-4" />
              View on GitHub
            </a>
          </motion.div>

          {/* deploy.sh */}
          <motion.div
            variants={fadeUp}
            custom={1}
            className="rounded-3xl border border-primary-200 dark:border-surface-700 bg-primary-50/50 dark:bg-surface-800/50 p-6 sm:p-8 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-3">
              <FontAwesomeIcon
                icon={faRocket}
                className="w-5 h-5 text-primary-600 dark:text-primary-400"
              />
              <h2 className="text-xl font-bold text-surface-900 dark:text-white">deploy.sh</h2>
            </div>
            <p className="text-surface-600 dark:text-surface-300 leading-relaxed mb-5 flex-1">
              Deploy your home-cooked software at home &mdash; a simple way to self-host and run
              your own apps on your own hardware, no cloud required.
            </p>

            <div className="flex flex-wrap gap-1.5 mb-6">
              {["Self-Hosted", "Docker", "Shell", "Home Server", "Local-First"].map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs font-medium rounded-full bg-white/80 dark:bg-surface-700 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-600"
                >
                  {tag}
                </span>
              ))}
            </div>

            <a
              href="https://github.com/gabrielcsapo/deploy.sh"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-primary-600 dark:bg-primary-500 text-white hover:bg-primary-700 dark:hover:bg-primary-400 transition-colors self-start"
            >
              <FontAwesomeIcon icon={faGithub} className="w-4 h-4" />
              View on GitHub
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* Recent Writing */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeUp}
        className="max-w-4xl mx-auto px-6 py-16 border-t border-surface-200 dark:border-surface-800"
      >
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-surface-900 dark:text-white">Recent Writing</h2>
          <Link
            to="/posts"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
          >
            View all
            <FontAwesomeIcon icon={faArrowRight} className="w-3 h-3" />
          </Link>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 gap-5"
        >
          {recentPosts?.map((post, i) => (
            <motion.div key={post.slug} variants={fadeUp} custom={i}>
              <BlogCard post={post} />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </div>
  );
}
