import React from 'react';
import { motion } from 'framer-motion';

export default function ArabianMonument({ className = "" }) {
  return (
    <div className={`relative w-full max-w-lg mx-auto pointer-events-none select-none ${className}`}>
      <svg 
        viewBox="0 0 600 220" 
        className="w-full h-auto drop-shadow-[0_2px_8px_rgba(170,124,17,0.08)]"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gold gradients for outlines */}
          <linearGradient id="monumentGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#aa7c11" stopOpacity="1.0" />
            <stop offset="50%" stopColor="#e5c185" stopOpacity="1.0" />
            <stop offset="100%" stopColor="#aa7c11" stopOpacity="1.0" />
          </linearGradient>
          
          {/* Subtle fill gradient */}
          <linearGradient id="monumentFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fdfbf9" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#e5c185" stopOpacity="0.3" />
          </linearGradient>

          {/* Window glow gradient */}
          <radialGradient id="windowGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd700" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#aa7c11" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer Frame Silhouette Lines */}
        <g stroke="url(#monumentGold)" strokeWidth="1.2" fill="url(#monumentFill)">
          
          {/* Base Platform */}
          <path d="M 10 215 H 590 V 218 H 10 Z" />
          <path d="M 40 205 H 560 V 215 H 40 Z" />
          
          {/* Far Left Minaret */}
          <path d="M 60 205 V 80 H 76 V 205 Z" />
          <path d="M 56 80 H 80 V 84 H 56 Z" />
          {/* Balcony 1 */}
          <path d="M 58 120 H 78 V 124 H 58 Z" />
          {/* Balcony 2 */}
          <path d="M 58 160 H 78 V 164 H 58 Z" />
          {/* Top Dome of Minaret */}
          <path d="M 60 80 C 60 68 68 60 68 60 C 68 60 76 68 76 80 Z" />
          <line x1="68" y1="60" x2="68" y2="52" />
          <circle cx="68" cy="52" r="1" fill="#aa7c11" stroke="none" />

          {/* Far Right Minaret */}
          <path d="M 524 205 V 80 H 540 V 205 Z" />
          <path d="M 520 80 H 544 V 84 H 520 Z" />
          {/* Balcony 1 */}
          <path d="M 522 120 H 542 V 124 H 522 Z" />
          {/* Balcony 2 */}
          <path d="M 522 160 H 542 V 164 H 522 Z" />
          {/* Top Dome of Minaret */}
          <path d="M 524 80 C 524 68 532 60 532 60 C 532 60 540 68 540 80 Z" />
          <line x1="532" y1="60" x2="532" y2="52" />
          <circle cx="532" cy="52" r="1" fill="#aa7c11" stroke="none" />

          {/* Left Wing Structure */}
          <path d="M 90 205 V 130 H 220 V 205 Z" />
          {/* Left Wing Domes */}
          <path d="M 110 130 C 110 105 125 95 130 95 C 135 95 150 105 150 130 Z" />
          <path d="M 160 130 C 160 105 175 95 180 95 C 185 95 200 105 200 130 Z" />
          
          {/* Right Wing Structure */}
          <path d="M 380 205 V 130 H 510 V 205 Z" />
          {/* Right Wing Domes */}
          <path d="M 400 130 C 400 105 415 95 420 95 C 425 95 440 105 440 130 Z" />
          <path d="M 450 130 C 450 105 465 95 470 95 C 475 95 490 105 490 130 Z" />

          {/* Main Central Structure */}
          <path d="M 220 205 V 110 H 380 V 205 Z" />
          
          {/* Central Dome Drum */}
          <rect x="250" y="85" width="100" height="25" rx="1" />
          
          {/* Central onion dome */}
          <path d="M 245 85 C 245 35 290 15 300 2 C 310 15 355 35 355 85 Z" />
          
          {/* Spire and Crescent Moon */}
          <line x1="300" y1="2" x2="300" y2="-12" />
          <path d="M 298 -16 C 298 -19 301 -21 301 -21 C 299 -21 296 -19 296 -16 C 296 -13 299 -11 301 -11 C 301 -11 298 -13 298 -16" />

          {/* Arches & Porticos */}
          {/* Central Grand Archway */}
          <path d="M 270 205 V 145 C 270 130 280 120 300 120 C 320 120 330 130 330 145 V 205 Z" strokeWidth="1" />
          <path d="M 280 205 V 155 C 280 145 288 138 300 138 C 312 138 320 145 320 155 V 205 Z" strokeWidth="0.5" />

          {/* Side Arches (Left & Right of center) */}
          <path d="M 235 205 V 160 C 235 152 240 147 245 147 C 250 147 255 152 255 160 V 205 Z" />
          <path d="M 345 205 V 160 C 345 152 350 147 355 147 C 360 147 365 152 365 160 V 205 Z" />

          {/* Wing Arches */}
          <path d="M 120 205 V 165 C 120 158 125 153 130 153 C 135 153 140 158 140 165 V 205 Z" />
          <path d="M 170 205 V 165 C 170 158 175 153 180 153 C 185 153 190 158 190 165 V 205 Z" />
          <path d="M 410 205 V 165 C 410 158 415 153 420 153 C 425 153 430 158 430 165 V 205 Z" />
          <path d="M 460 205 V 165 C 460 158 465 153 470 153 C 475 153 480 158 480 165 V 205 Z" />
        </g>

        {/* --- Animated Glowing Palace Windows --- */}
        <g fill="#aa7c11" fillOpacity="0.8">
          {/* Glow spots */}
          <motion.circle 
            cx="300" 
            cy="165" 
            r="8" 
            fill="url(#windowGlow)" 
            animate={{ opacity: [0.3, 0.8, 0.3] }} 
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} 
          />
          
          {/* Twinkling Windows */}
          {/* Main Central Row */}
          <motion.rect x="242" y="120" width="6" height="12" rx="1.5" animate={{ opacity: [0.2, 0.85, 0.2] }} transition={{ duration: 3.5, repeat: Infinity, delay: 0.2 }} />
          <motion.rect x="352" y="120" width="6" height="12" rx="1.5" animate={{ opacity: [0.2, 0.85, 0.2] }} transition={{ duration: 3.5, repeat: Infinity, delay: 0.9 }} />
          
          {/* Left Wing Windows */}
          <motion.circle cx="130" cy="142" r="2" animate={{ opacity: [0.1, 0.8, 0.1] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0 }} />
          <motion.circle cx="180" cy="142" r="2" animate={{ opacity: [0.1, 0.8, 0.1] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.6 }} />

          {/* Right Wing Windows */}
          <motion.circle cx="420" cy="142" r="2" animate={{ opacity: [0.1, 0.8, 0.1] }} transition={{ duration: 2.8, repeat: Infinity, delay: 0.3 }} />
          <motion.circle cx="470" cy="142" r="2" animate={{ opacity: [0.1, 0.8, 0.1] }} transition={{ duration: 2.8, repeat: Infinity, delay: 0.9 }} />
          
          {/* Minaret Top Lanterns */}
          <motion.circle cx="68" cy="74" r="2" animate={{ opacity: [0.3, 0.9, 0.3] }} transition={{ duration: 2.0, repeat: Infinity, delay: 0.1 }} />
          <motion.circle cx="532" cy="74" r="2" animate={{ opacity: [0.3, 0.9, 0.3] }} transition={{ duration: 2.0, repeat: Infinity, delay: 0.7 }} />
        </g>
      </svg>
    </div>
  );
}
