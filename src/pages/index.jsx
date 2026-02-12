import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowRight,
  faBook,
  faChevronLeft,
  faChevronRight,
  faCircleInfo,
  faCode,
  faCodeBranch,
  faLeaf,
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

const projects = [
  {
    name: "Compendus",
    icon: faBook,
    description:
      "A personal digital library \u2014 your own space to collect, organize, and read everything. Self-hosted with a native Swift companion app.",
    tags: ["PDF", "EPUB", "MOBI", "CBR", "CBZ", "TypeScript", "React", "SQLite", "Swift"],
    url: "https://github.com/gabrielcsapo/Compendus",
  },
  {
    name: "deploy.sh",
    icon: faRocket,
    description:
      "Deploy your home-cooked software at home \u2014 a simple way to self-host and run your own apps on your own hardware, no cloud required.",
    tags: ["Self-Hosted", "Docker", "Shell", "Home Server", "Local-First"],
    url: "https://github.com/gabrielcsapo/deploy.sh",
  },
  {
    name: "Groffee",
    icon: faCodeBranch,
    description:
      "The best way to deal with git is with a little bit of coffee \u2014 a lightweight Git interface that makes managing repositories simple and intuitive.",
    tags: ["Git", "TypeScript", "Docker", "pnpm", "Monorepo"],
    url: "https://github.com/gabrielcsapo/groffee",
  },
  {
    name: "Backyard Planner",
    icon: faLeaf,
    description:
      "A personal garden planning app \u2014 design yard layouts, track plantings, and manage growing schedules with an SVG-based drag-and-drop planner.",
    tags: ["React", "TypeScript", "SQLite", "Tailwind", "Local-First"],
    url: "https://github.com/gabrielcsapo/backyard-garden",
  },
];

const CAROUSEL_GAP = 20;
const CAROUSEL_PEEK = 48;

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

const CARDS_PER_PAGE = 2;
const totalPages = Math.ceil(projects.length / CARDS_PER_PAGE);

function ProjectCard({ project }) {
  return (
    <div className="rounded-3xl border border-primary-200 dark:border-surface-700 bg-primary-50/50 dark:bg-surface-800/50 p-6 sm:p-8 flex flex-col flex-1 min-w-0">
      <div className="flex items-center gap-3 mb-3">
        <FontAwesomeIcon
          icon={project.icon}
          className="w-5 h-5 text-primary-600 dark:text-primary-400"
        />
        <h2 className="text-xl font-bold text-surface-900 dark:text-white">{project.name}</h2>
      </div>
      <p className="text-surface-600 dark:text-surface-300 leading-relaxed mb-5 flex-1">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-6">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 text-xs font-medium rounded-full bg-white/80 dark:bg-surface-700 text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-600"
          >
            {tag}
          </span>
        ))}
      </div>

      <a
        href={project.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl bg-primary-600 dark:bg-primary-500 text-white hover:bg-primary-700 dark:hover:bg-primary-400 transition-colors self-start"
      >
        <FontAwesomeIcon icon={faGithub} className="w-4 h-4" />
        View on GitHub
      </a>
    </div>
  );
}

function ProjectCarousel() {
  const [page, setPage] = useState(0);

  const paginate = (dir) => {
    setPage((prev) => (prev + dir + totalPages) % totalPages);
  };

  // Card width: fills half the container minus gaps and peek space
  // 2 cards + 2 gaps + peek = 100%, so card = (100% - 2*gap - peek) / 2
  const cardWidth = `calc((100% - ${2 * CAROUSEL_GAP + CAROUSEL_PEEK}px) / 2)`;

  // Shift per page: 2 cards + 2 gaps = 100% - peek
  const pageOffset = page === 0 ? 0 : `calc(${-page * 100}% + ${page * CAROUSEL_PEEK}px)`;

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <motion.div
          animate={{ x: pageOffset }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex"
          style={{ gap: CAROUSEL_GAP }}
        >
          {projects.map((project) => (
            <div key={project.name} className="flex-shrink-0" style={{ width: cardWidth }}>
              <ProjectCard project={project} />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => paginate(-1)}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-sm flex items-center justify-center text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
        aria-label="Previous projects"
      >
        <FontAwesomeIcon icon={faChevronLeft} className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => paginate(1)}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-10 h-10 rounded-full bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-sm flex items-center justify-center text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
        aria-label="Next projects"
      >
        <FontAwesomeIcon icon={faChevronRight} className="w-3.5 h-3.5" />
      </button>

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mt-5">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`h-2 rounded-full transition-all ${
              i === page
                ? "bg-primary-600 dark:bg-primary-400 w-6"
                : "bg-surface-300 dark:bg-surface-600 hover:bg-surface-400 dark:hover:bg-surface-500 w-2"
            }`}
            aria-label={`Go to page ${i + 1}`}
          />
        ))}
      </div>
    </div>
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

        <ProjectCarousel />
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
