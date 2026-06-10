import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedPalace() {
  // Twinkling stars in the upper sky
  const stars = [
    { cx: 100, cy: 80, r: 1.2, delay: 0 },
    { cx: 250, cy: 110, r: 1.5, delay: 0.5 },
    { cx: 400, cy: 70, r: 1.0, delay: 1.2 },
    { cx: 600, cy: 90, r: 1.6, delay: 0.2 },
    { cx: 800, cy: 60, r: 1.2, delay: 1.5 },
    { cx: 950, cy: 110, r: 1.8, delay: 0.8 },
    { cx: 1100, cy: 75, r: 1.0, delay: 1.7 },
    { cx: 180, cy: 160, r: 1.2, delay: 2.0 },
    { cx: 1020, cy: 150, r: 1.4, delay: 1.1 },
  ];

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-sunset-gradient">
      {/* Animated Sunset Sky Gradients and Clouds */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none select-none"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          {/* Silhouetted Dunes Gradient - Deep Mahogany / Onyx */}
          <linearGradient id="duneSilhouette" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2d130a" />
            <stop offset="100%" stopColor="#120400" />
          </linearGradient>

          {/* Palace Body Silhouette - Rich Deep Mahogany */}
          <linearGradient id="palaceSilhouette" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#36170d" />
            <stop offset="100%" stopColor="#170601" />
          </linearGradient>

          {/* Luxury Gold Outline for Silhouette Accents */}
          <linearGradient id="goldEdge" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#aa7c11" />
            <stop offset="30%" stopColor="#ffd700" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#c9a060" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#8c6239" stopOpacity="0.5" />
          </linearGradient>

          {/* Soft Golden Sun/Sky Glow */}
          <radialGradient id="skySunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fff2dc" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#ffb085" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#e8738f" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Sun Radial Highlight */}
        <circle cx="600" cy="400" r="500" fill="url(#skySunGlow)" />

        {/* Twinkling Stars */}
        <g>
          {stars.map((star, idx) => (
            <motion.circle
              key={idx}
              cx={star.cx}
              cy={star.cy}
              r={star.r}
              fill="#ffe4b5"
              animate={{ opacity: [0.1, 0.8, 0.1] }}
              transition={{
                duration: 3 + Math.random() * 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: star.delay,
              }}
            />
          ))}
        </g>

        {/* Slow-Drifting Clouds */}
        <g opacity="0.15">
          <motion.path
            d="M100 130 C140 100 200 100 220 130 C250 100 310 100 340 130 L340 145 L100 145 Z"
            stroke="url(#goldEdge)"
            strokeWidth="0.75"
            fill="none"
            animate={{ x: [-50, 80, -50] }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M750 170 C780 150 830 150 850 170 C880 150 940 150 970 170 L970 185 L750 185 Z"
            stroke="url(#goldEdge)"
            strokeWidth="0.75"
            fill="none"
            animate={{ x: [60, -60, 60] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          />
        </g>

        {/* ================= BACKGROUND DUNES SILHOUETTE ================= */}
        <path
          d="M-50 540 Q250 480 600 520 T1250 500 L1250 850 L-50 850 Z"
          fill="url(#duneSilhouette)"
          stroke="url(#goldEdge)"
          strokeWidth="0.5"
          opacity="0.95"
        />

        {/* ================= PALACE ARCHITECTURE SILHOUETTE ================= */}
        <motion.g
          initial={{ y: 2 }}
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        >
          {/* Back Towers (low opacity silhouettes) */}
          <g stroke="url(#goldEdge)" strokeWidth="0.75" fill="url(#palaceSilhouette)" opacity="0.65">
            {/* Back Left Tower */}
            <rect x="440" y="320" width="30" height="200" rx="1" />
            <path d="M440 320 C440 300 455 282 455 282 C455 282 470 300 470 320 Z" />
            {/* Back Right Tower */}
            <rect x="730" y="320" width="30" height="200" rx="1" />
            <path d="M730 320 C730 300 745 282 745 282 C745 282 760 300 760 320 Z" />
          </g>

          {/* Main Palace Body, Domes, Minarets */}
          <g stroke="url(#goldEdge)" strokeWidth="1" fill="url(#palaceSilhouette)">
            {/* Outer Left Minaret */}
            <rect x="360" y="340" width="22" height="180" rx="1" />
            <path d="M358 340 H384 V347 H358 Z" />
            <path d="M360 340 C360 325 371 315 371 315 C371 315 382 325 382 340 Z" />
            {/* Moon Finial */}
            <path d="M371 315 V308" />

            {/* Outer Right Minaret */}
            <rect x="818" y="340" width="22" height="180" rx="1" />
            <path d="M816 340 H842 V347 H816 Z" />
            <path d="M818 340 C818 325 829 315 829 315 C829 315 840 325 840 340 Z" />
            {/* Moon Finial */}
            <path d="M829 315 V308" />

            {/* Central Block */}
            <rect x="400" y="360" width="400" height="160" rx="4" />

            {/* Left Wing Dome */}
            <path d="M420 360 C420 320 445 305 455 305 C465 305 490 320 490 360 Z" />
            {/* Right Wing Dome */}
            <path d="M710 360 C710 320 735 305 745 305 C755 305 780 320 780 360 Z" />

            {/* Central Dome Drum */}
            <rect x="520" y="330" width="160" height="30" rx="1" />

            {/* Central Onion Dome */}
            <path d="M515 330 C515 260 570 235 600 215 C630 235 685 260 685 330 Z" />
            {/* Spire */}
            <path d="M600 215 V195" />
            <circle cx="600" cy="203" r="2.5" />
            <path d="M596 188 C596 184 602 181 602 181 C598 181 594 184 594 188 C594 192 598 195 602 195 C602 195 596 192 596 188" />

            {/* Doorways */}
            {/* Central Grand Arch */}
            <path d="M570 520 V450 C570 430 580 420 600 420 C620 420 630 430 630 450 V520 Z" stroke="url(#goldEdge)" strokeWidth="1.25" fill="#120400" />
            {/* Side Arches */}
            <path d="M440 520 V470 C440 458 447 450 455 450 C463 450 470 458 470 470 V520 Z" />
            <path d="M485 520 V470 C485 458 492 450 500 450 C508 450 515 458 515 470 V520 Z" />
            <path d="M685 520 V470 C685 458 692 450 700 450 C708 450 715 458 715 470 V520 Z" />
            <path d="M730 520 V470 C730 458 737 450 745 450 C753 450 760 458 760 470 V520 Z" />
          </g>

          {/* --- Animated Glowing Palace Windows --- */}
          <g>
            <motion.rect x="450" y="390" width="10" height="20" rx="3" fill="#ffe4b5" animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 4, repeat: Infinity, delay: 0 }} />
            <motion.rect x="470" y="390" width="10" height="20" rx="3" fill="#ffe4b5" animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 4, repeat: Infinity, delay: 0.5 }} />
            <motion.rect x="720" y="390" width="10" height="20" rx="3" fill="#ffe4b5" animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 4, repeat: Infinity, delay: 0.8 }} />
            <motion.rect x="740" y="390" width="10" height="20" rx="3" fill="#ffe4b5" animate={{ opacity: [0.2, 0.8, 0.2] }} transition={{ duration: 4, repeat: Infinity, delay: 1.3 }} />

            <motion.circle cx="580" cy="385" r="3" fill="#ffe4b5" animate={{ opacity: [0.2, 0.9, 0.2] }} transition={{ duration: 3, repeat: Infinity, delay: 0.2 }} />
            <motion.circle cx="600" cy="385" r="3" fill="#ffe4b5" animate={{ opacity: [0.2, 0.9, 0.2] }} transition={{ duration: 3, repeat: Infinity, delay: 0.6 }} />
            <motion.circle cx="620" cy="385" r="3" fill="#ffe4b5" animate={{ opacity: [0.2, 0.9, 0.2] }} transition={{ duration: 3, repeat: Infinity, delay: 1.0 }} />
          </g>
        </motion.g>

        {/* ================= MIDDLEGROUND DUNES SILHOUETTE ================= */}
        <path
          d="M-50 620 Q350 660 700 600 T1250 630 L1250 850 L-50 850 Z"
          fill="url(#duneSilhouette)"
          stroke="url(#goldEdge)"
          strokeWidth="0.75"
        />

        {/* ================= FOREGROUND DUNES SILHOUETTE ================= */}
        <path
          d="M-50 700 Q250 670 600 720 T1250 690 L1250 850 L-50 850 Z"
          fill="url(#duneSilhouette)"
          stroke="url(#goldEdge)"
          strokeWidth="1.25"
        />

        {/* ================= SWAYING PALM TREE SILHOUETTES ================= */}

        {/* Left Palm Tree */}
        <motion.g
          animate={{ rotate: [-1, 1, -1] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "80px 720px" }}
        >
          {/* Trunk */}
          <path
            d="M75 720 Q85 640 100 500 Q90 500 85 515 Q72 630 65 720 Z"
            fill="url(#duneSilhouette)"
            stroke="url(#goldEdge)"
            strokeWidth="0.75"
          />
          {/* Fronds */}
          <g stroke="url(#goldEdge)" strokeWidth="0.75" fill="url(#duneSilhouette)">
            <path d="M100 500 Q60 520 20 540 Q50 490 100 500 Z" />
            <path d="M100 500 Q50 500 10 505 Q45 478 100 500 Z" />
            <path d="M100 500 Q70 450 35 420 Q75 435 100 500 Z" />
            <path d="M100 500 Q105 420 110 370 Q115 420 100 500 Z" />
            <path d="M100 500 Q130 450 165 420 Q125 435 100 500 Z" />
            <path d="M100 500 Q140 520 180 540 Q130 490 100 500 Z" />
          </g>
        </motion.g>

        {/* Right Palm Tree */}
        <motion.g
          animate={{ rotate: [1, -1, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "1120px 720px" }}
        >
          {/* Trunk */}
          <path
            d="M1125 720 Q1115 640 1100 500 Q1110 500 1115 515 Q1128 630 1135 720 Z"
            fill="url(#duneSilhouette)"
            stroke="url(#goldEdge)"
            strokeWidth="0.75"
          />
          {/* Fronds */}
          <g stroke="url(#goldEdge)" strokeWidth="0.75" fill="url(#duneSilhouette)">
            <path d="M1100 500 Q1060 520 1020 540 Q1070 490 1100 500 Z" />
            <path d="M1100 500 Q1070 450 1035 420 Q1075 435 1100 500 Z" />
            <path d="M1100 500 Q1095 420 1090 370 Q1085 420 1100 500 Z" />
            <path d="M1100 500 Q1130 450 1165 420 Q1125 435 1100 500 Z" />
            <path d="M1100 500 Q1140 520 1180 540 Q1130 490 1100 500 Z" />
          </g>
        </motion.g>
      </svg>
    </div>
  );
}
