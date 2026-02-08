import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateHillPath(baseY, bumps, width, height, rand) {
  const points = [];
  const segW = (width + 40) / (bumps + 1);

  for (let i = 0; i <= bumps + 1; i++) {
    points.push({
      x: -20 + i * segW,
      y: baseY + (rand() - 0.4) * 50,
    });
  }

  let d = `M -20 ${height + 20} L ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;

  // Catmull-Rom spline → cubic beziers for smooth organic curves
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(points.length - 1, i + 2)];
    const t = 0.4;

    const cp1x = p1.x + ((p2.x - p0.x) * t) / 3;
    const cp1y = p1.y + ((p2.y - p0.y) * t) / 3;
    const cp2x = p2.x - ((p3.x - p1.x) * t) / 3;
    const cp2y = p2.y - ((p3.y - p1.y) * t) / 3;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }

  d += ` L ${width + 20} ${height + 20} Z`;
  return d;
}

export default function DotGarden({ className }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const w = 1600;
  const h = 700;

  // Generate deterministic shapes once
  const { hills, particles } = useMemo(() => {
    const rand = seededRandom(42);
    const hillData = [
      { id: 0, d: generateHillPath(300, 6, w, h, rand), delay: 0.3 },
      { id: 1, d: generateHillPath(400, 5, w, h, rand), delay: 0.6 },
      { id: 2, d: generateHillPath(510, 4, w, h, rand), delay: 0.9 },
    ];

    const pRand = seededRandom(55);
    const particleData = [];
    for (let i = 0; i < 14; i++) {
      particleData.push({
        id: i,
        cx: pRand() * w,
        cy: 60 + pRand() * 380,
        r: 1.5 + pRand() * 2.5,
        delay: 1.2 + pRand() * 1.5,
      });
    }

    return { hills: hillData, particles: particleData };
  }, []);

  // Theme-aware colors
  const hillFills = isDark ? ["#1a2e22", "#132118", "#0d1810"] : ["#c4d7b2", "#8cb978", "#5a8a50"];

  const hillOpacities = isDark ? [0.7, 0.8, 0.9] : [0.6, 0.75, 0.9];

  return (
    <svg
      className={className}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="nature-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={isDark ? "#0a1628" : "#dbeafe"} />
          <stop offset="55%" stopColor={isDark ? "#14303d" : "#fef3c7"} />
          <stop offset="100%" stopColor={isDark ? "#1a3a4a" : "#fde8d0"} />
        </linearGradient>
        <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={isDark ? "#94a3b8" : "#fcd34d"} stopOpacity="0.7" />
          <stop offset="50%" stopColor={isDark ? "#64748b" : "#fbbf24"} stopOpacity="0.15" />
          <stop offset="100%" stopColor={isDark ? "#475569" : "#f59e0b"} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="mist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={isDark ? "#0a1628" : "#fef3c7"} stopOpacity="0" />
          <stop offset="100%" stopColor={isDark ? "#0a1628" : "#fef3c7"} stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Sky gradient */}
      <rect x="0" y="0" width={w} height={h} fill="url(#nature-sky)" />

      {/* Sun / Moon with glow */}
      <motion.circle
        cx={w * 0.72}
        cy={160}
        fill="url(#sun-glow)"
        initial={{ r: 0, opacity: 0 }}
        animate={{ r: 140, opacity: 1 }}
        transition={{ duration: 1.8, delay: 0.2, ease: "easeOut" }}
      />
      <motion.circle
        cx={w * 0.72}
        cy={160}
        fill={isDark ? "#cbd5e1" : "#fcd34d"}
        initial={{ r: 0, opacity: 0 }}
        animate={{ r: 32, opacity: isDark ? 0.85 : 0.9 }}
        transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
      />

      {/* Rolling hill layers */}
      {hills.map((hill, i) => (
        <motion.path
          key={hill.id}
          d={hill.d}
          fill={hillFills[i]}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: hillOpacities[i], y: 0 }}
          transition={{ duration: 1.4, delay: hill.delay, ease: "easeOut" }}
        />
      ))}

      {/* Atmospheric mist between layers */}
      <rect x="0" y={h * 0.5} width={w} height={h * 0.5} fill="url(#mist)" />

      {/* Floating particles — fireflies (dark) / pollen (light) */}
      {particles.map((p) => (
        <motion.circle
          key={p.id}
          cx={p.cx}
          cy={p.cy}
          r={p.r}
          fill={isDark ? "#a5f3fc" : "#fbbf24"}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, isDark ? 0.7 : 0.5, 0.2, isDark ? 0.6 : 0.4, 0],
            y: [0, -8, -3, -10, -15],
          }}
          transition={{
            duration: 5 + p.r,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </svg>
  );
}
