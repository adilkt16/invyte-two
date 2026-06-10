import React from 'react';
import { motion } from 'framer-motion';

export default function ArabianMonument({ className = "" }) {
  return (
    <div className={`relative w-full max-w-4xl mx-auto pointer-events-none select-none ${className}`}>
      <svg 
        viewBox="0 0 600 220" 
        className="w-full h-auto drop-shadow-[0_4px_16px_rgba(170,124,17,0.12)]"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gold gradients for outlines */}
          <linearGradient id="monumentGold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#aa7c11" stopOpacity="1.0" />
            <stop offset="30%" stopColor="#f7e0a3" stopOpacity="1.0" />
            <stop offset="70%" stopColor="#e5c185" stopOpacity="1.0" />
            <stop offset="100%" stopColor="#8d6648" stopOpacity="1.0" />
          </linearGradient>
          
          {/* Subtle fill gradient */}
          <linearGradient id="monumentFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f8f1e3" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#eedcb7" stopOpacity="0.65" />
          </linearGradient>

          {/* Window glow gradient */}
          <radialGradient id="windowGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffeba8" stopOpacity="1" />
            <stop offset="40%" stopColor="#e5c185" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#aa7c11" stopOpacity="0" />
          </radialGradient>

          {/* Jali (Lattice Mesh) Screen Pattern */}
          <pattern id="jaliPattern" x="0" y="0" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M 0 2.5 L 5 2.5 M 2.5 0 L 2.5 5" stroke="#aa7c11" strokeWidth="0.35" strokeOpacity="0.5" />
            <path d="M 0 0 L 5 5 M 0 5 L 5 0" stroke="#aa7c11" strokeWidth="0.25" strokeOpacity="0.3" />
          </pattern>

          {/* Base Ornamental Arch Border Pattern */}
          <pattern id="baseBorderPattern" x="0" y="0" width="16" height="8" patternUnits="userSpaceOnUse">
            <path d="M 0 8 V 3 C 0 1 4 0 8 0 C 12 0 16 1 16 3 V 8" stroke="url(#monumentGold)" strokeWidth="0.55" fill="none" strokeOpacity="0.85" />
          </pattern>

          {/* Wall Arabesque Carving Pattern */}
          <pattern id="wallArabesque" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M 12 0 C 12 6, 18 12, 12 24 C 6 12, 12 6, 12 0 Z M 0 12 C 6 12, 12 18, 24 12 C 12 6, 6 12, 0 12 Z" stroke="#aa7c11" strokeWidth="0.25" strokeOpacity="0.22" fill="none" />
            <circle cx="12" cy="12" r="0.75" fill="#aa7c11" fillOpacity="0.3" />
          </pattern>
        </defs>

        {/* 1. BACKGROUND GLOW LAYER (Inside Arches) */}
        <g>
          {/* Central Grand Archway Glow */}
          <motion.ellipse 
            cx="300" 
            cy="165" 
            rx="25" 
            ry="35" 
            fill="url(#windowGlow)" 
            animate={{ opacity: [0.4, 0.7, 0.4] }} 
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} 
          />
          {/* Left Wing Glows */}
          <motion.circle cx="130" cy="175" r="10" fill="url(#windowGlow)" animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 4, repeat: Infinity, delay: 0.5 }} />
          <motion.circle cx="180" cy="175" r="10" fill="url(#windowGlow)" animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 4, repeat: Infinity, delay: 1.5 }} />
          {/* Right Wing Glows */}
          <motion.circle cx="420" cy="175" r="10" fill="url(#windowGlow)" animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 4.5, repeat: Infinity, delay: 1.0 }} />
          <motion.circle cx="470" cy="175" r="10" fill="url(#windowGlow)" animate={{ opacity: [0.2, 0.6, 0.2] }} transition={{ duration: 4.5, repeat: Infinity, delay: 2.0 }} />
        </g>

        {/* 2. BASE PLATFORM AND ORNAMENTAL TRIM */}
        <g stroke="url(#monumentGold)" strokeWidth="1.4">
          {/* Stepped Foundations */}
          <path d="M 10 214 H 590 V 218 H 10 Z" fill="url(#monumentFill)" />
          <path d="M 30 206 H 570 V 214 H 30 Z" fill="url(#monumentFill)" />
          {/* Base border ornamental arches */}
          <rect x="30" y="198" width="540" height="8" fill="url(#baseBorderPattern)" stroke="none" />
          <line x1="30" y1="198" x2="570" y2="198" stroke="url(#monumentGold)" strokeWidth="0.8" />
        </g>

        {/* 3. WALLS AND PANEL CARVINGS */}
        <g stroke="url(#monumentGold)" strokeWidth="1.4" fill="url(#monumentFill)">
          {/* Left Wing Main Wall */}
          <path d="M 90 198 V 130 H 220 V 198 Z" />
          <rect x="90" y="130" width="130" height="68" fill="url(#wallArabesque)" stroke="none" />
          
          {/* Right Wing Main Wall */}
          <path d="M 380 198 V 130 H 510 V 198 Z" />
          <rect x="380" y="130" width="130" height="68" fill="url(#wallArabesque)" stroke="none" />
          
          {/* Main Central Portal Block (Pishtaq) */}
          <path d="M 220 198 V 110 H 380 V 198 Z" />
          <rect x="220" y="110" width="160" height="88" fill="url(#wallArabesque)" stroke="none" />
          {/* Central Portal Inner border lines */}
          <path d="M 226 198 V 116 H 374 V 198" strokeWidth="0.5" strokeDasharray="3 2" />
        </g>

        {/* 4. BALCONIES AND MINARETS COLUMN DETAILS */}
        <g stroke="url(#monumentGold)" strokeWidth="1.4" fill="url(#monumentFill)">
          {/* Left Far Minaret Column */}
          <path d="M 60 198 V 80 H 76 V 198 Z" />
          {/* Balcony 1 Detail */}
          <path d="M 56 120 H 80 V 124 H 56 Z" />
          <rect x="58" y="116" width="20" height="4" fill="url(#jaliPattern)" stroke="none" />
          {/* Balcony 2 Detail */}
          <path d="M 56 160 H 80 V 164 H 56 Z" />
          <rect x="58" y="156" width="20" height="4" fill="url(#jaliPattern)" stroke="none" />
          {/* Minaret Column Shaft Lines */}
          <line x1="68" y1="198" x2="68" y2="164" strokeWidth="0.5" strokeDasharray="5 5" />
          <line x1="68" y1="156" x2="68" y2="124" strokeWidth="0.5" strokeDasharray="5 5" />
          <line x1="68" y1="116" x2="68" y2="84" strokeWidth="0.5" strokeDasharray="5 5" />

          {/* Right Far Minaret Column */}
          <path d="M 524 198 V 80 H 540 V 198 Z" />
          {/* Balcony 1 Detail */}
          <path d="M 520 120 H 544 V 124 H 520 Z" />
          <rect x="522" y="116" width="20" height="4" fill="url(#jaliPattern)" stroke="none" />
          {/* Balcony 2 Detail */}
          <path d="M 520 160 H 544 V 164 H 520 Z" />
          <rect x="522" y="156" width="20" height="4" fill="url(#jaliPattern)" stroke="none" />
          {/* Minaret Column Shaft Lines */}
          <line x1="532" y1="198" x2="532" y2="164" strokeWidth="0.5" strokeDasharray="5 5" />
          <line x1="532" y1="156" x2="532" y2="124" strokeWidth="0.5" strokeDasharray="5 5" />
          <line x1="532" y1="116" x2="532" y2="84" strokeWidth="0.5" strokeDasharray="5 5" />
        </g>

        {/* 5. COLOURED SHADING & FLUTED DOME GEOMETRY */}
        <g stroke="url(#monumentGold)" strokeWidth="1.4" fill="url(#monumentFill)">
          {/* CENTRAL ONION DOME */}
          <rect x="250" y="85" width="100" height="25" rx="1.5" />
          <path d="M 250 85 C 240 65 255 45 280 25 C 290 15 298 5 300 0 C 302 5 310 15 320 25 C 345 45 360 65 350 85 Z" />
          
          {/* Ribs (Fluting) on Central Dome */}
          <path d="M 268 85 C 262 67 274 48 290 28 C 296 20 299 10 300 0" strokeWidth="0.5" strokeOpacity="0.65" fill="none" />
          <path d="M 285 85 C 282 69 288 51 296 32 C 299 22 300 12 300 0" strokeWidth="0.5" strokeOpacity="0.65" fill="none" />
          <path d="M 332 85 C 338 67 326 48 310 28 C 304 20 301 10 300 0" strokeWidth="0.5" strokeOpacity="0.65" fill="none" />
          <path d="M 315 85 C 318 69 312 51 304 32 C 301 22 300 12 300 0" strokeWidth="0.5" strokeOpacity="0.65" fill="none" />

          {/* LEFT WING DOMES */}
          {/* Dome 1 */}
          <path d="M 110 130 C 105 118 112 108 122 98 C 126 94 129 90 130 88 C 131 90 134 94 138 98 C 148 108 155 118 150 130 Z" />
          <path d="M 120 130 C 117 120 122 110 130 88" strokeWidth="0.4" strokeOpacity="0.6" fill="none" />
          <path d="M 140 130 C 143 120 138 110 130 88" strokeWidth="0.4" strokeOpacity="0.6" fill="none" />
          {/* Dome 2 */}
          <path d="M 160 130 C 155 118 162 108 172 98 C 176 94 179 90 180 88 C 181 90 184 94 188 98 C 198 108 205 118 200 130 Z" />
          <path d="M 170 130 C 167 120 172 110 180 88" strokeWidth="0.4" strokeOpacity="0.6" fill="none" />
          <path d="M 190 130 C 193 120 188 110 180 88" strokeWidth="0.4" strokeOpacity="0.6" fill="none" />

          {/* RIGHT WING DOMES */}
          {/* Dome 1 */}
          <path d="M 400 130 C 395 118 402 108 412 98 C 416 94 419 90 420 88 C 421 90 424 94 428 98 C 438 108 445 118 440 130 Z" />
          <path d="M 410 130 C 407 120 412 110 420 88" strokeWidth="0.4" strokeOpacity="0.6" fill="none" />
          <path d="M 430 130 C 433 120 428 110 420 88" strokeWidth="0.4" strokeOpacity="0.6" fill="none" />
          {/* Dome 2 */}
          <path d="M 450 130 C 445 118 452 108 462 98 C 466 94 469 90 470 88 C 471 90 474 94 478 98 C 488 108 495 118 490 130 Z" />
          <path d="M 460 130 C 457 120 462 110 470 88" strokeWidth="0.4" strokeOpacity="0.6" fill="none" />
          <path d="M 480 130 C 483 120 478 110 470 88" strokeWidth="0.4" strokeOpacity="0.6" fill="none" />

          {/* FAR MINARET DOME CAPSTAGE */}
          {/* Left minaret dome */}
          <path d="M 60 80 C 60 68 68 60 68 60 C 68 60 76 68 76 80 Z" />
          <line x1="60" y1="80" x2="76" y2="80" />
          {/* Right minaret dome */}
          <path d="M 524 80 C 524 68 532 60 532 60 C 532 60 540 68 540 80 Z" />
          <line x1="524" y1="80" x2="540" y2="80" />
        </g>

        {/* 6. SPIRES AND CRESCENT MOONS */}
        <g stroke="url(#monumentGold)" strokeWidth="1.2" fill="none">
          {/* Central Dome Spire & Moon */}
          <line x1="300" y1="0" x2="300" y2="-12" strokeWidth="1.2" />
          <path d="M 300 -20 A 4 4 0 1 0 300 -12 A 3 3 0 1 1 300 -20" fill="url(#monumentGold)" stroke="none" />

          {/* Left Minaret Spire & Moon */}
          <line x1="68" y1="60" x2="68" y2="48" />
          <path d="M 68 42 A 3 3 0 1 0 68 48 A 2.2 2.2 0 1 1 68 42" fill="url(#monumentGold)" stroke="none" />

          {/* Right Minaret Spire & Moon */}
          <line x1="532" y1="60" x2="532" y2="48" />
          <path d="M 532 42 A 3 3 0 1 0 532 48 A 2.2 2.2 0 1 1 532 42" fill="url(#monumentGold)" stroke="none" />

          {/* Left Wing Spire 1 & Moon */}
          <line x1="130" y1="88" x2="130" y2="76" />
          <path d="M 130 70 A 3 3 0 1 0 130 76 A 2.2 2.2 0 1 1 130 70" fill="url(#monumentGold)" stroke="none" />
          {/* Left Wing Spire 2 & Moon */}
          <line x1="180" y1="88" x2="180" y2="76" />
          <path d="M 180 70 A 3 3 0 1 0 180 76 A 2.2 2.2 0 1 1 180 70" fill="url(#monumentGold)" stroke="none" />

          {/* Right Wing Spire 1 & Moon */}
          <line x1="420" y1="88" x2="420" y2="76" />
          <path d="M 420 70 A 3 3 0 1 0 420 76 A 2.2 2.2 0 1 1 420 70" fill="url(#monumentGold)" stroke="none" />
          {/* Right Wing Spire 2 & Moon */}
          <line x1="470" y1="88" x2="470" y2="76" />
          <path d="M 470 70 A 3 3 0 1 0 470 76 A 2.2 2.2 0 1 1 470 70" fill="url(#monumentGold)" stroke="none" />
        </g>

        {/* 7. ARCHWAYS AND GEOMETRIC WINDOW SCREENS */}
        <g stroke="url(#monumentGold)" strokeWidth="1.25">
          {/* Grand Archway Outer frame (Pishtaq Arch) */}
          <path d="M 270 198 V 145 C 270 130 280 120 300 120 C 320 120 330 130 330 145 V 198 Z" fill="url(#monumentFill)" />
          
          {/* Cusped scallops inside Grand Portal */}
          <path d="M 270 198 V 145 
                   C 270 139, 273 136, 276 136
                   C 278 132, 283 129, 286 129
                   C 289 125, 294 121, 300 121
                   C 306 121, 311 125, 314 129
                   C 317 129, 322 132, 324 136
                   C 327 136, 330 139, 330 145 V 198 Z" strokeWidth="0.4" fill="none" />
          
          {/* Grand Portal Jali Screen Panel */}
          <path d="M 280 198 V 154 C 280 144 288 136 300 136 C 312 136 320 144 320 154 V 198 Z" fill="url(#jaliPattern)" />

          {/* Left Portal side arches */}
          <path d="M 235 198 V 160 C 235 152 240 146 245 146 C 250 146 255 152 255 160 V 198 Z" fill="url(#jaliPattern)" />
          <path d="M 345 198 V 160 C 345 152 350 146 355 146 C 360 146 365 152 365 160 V 198 Z" fill="url(#jaliPattern)" />

          {/* Wing jali arched window niches */}
          <path d="M 120 198 V 165 C 120 158 125 153 130 153 C 135 153 140 158 140 165 V 198 Z" fill="url(#jaliPattern)" />
          <path d="M 170 198 V 165 C 170 158 175 153 180 153 C 185 153 190 158 190 165 V 198 Z" fill="url(#jaliPattern)" />
          <path d="M 410 198 V 165 C 410 158 415 153 420 153 C 425 153 430 158 430 165 V 198 Z" fill="url(#jaliPattern)" />
          <path d="M 460 198 V 165 C 460 158 465 153 470 153 C 475 153 480 158 480 165 V 198 Z" fill="url(#jaliPattern)" />

          {/* Small niches on minarets */}
          {/* Left minaret niches */}
          <path d="M 65 106 V 102 C 65 100.5 67 99.5 68 99.5 C 69 99.5 71 100.5 71 102 V 106 Z" fill="url(#windowGlow)" strokeWidth="0.3" />
          <path d="M 65 146 V 142 C 65 140.5 67 139.5 68 139.5 C 69 139.5 71 140.5 71 142 V 146 Z" fill="url(#windowGlow)" strokeWidth="0.3" />
          <path d="M 65 186 V 182 C 65 180.5 67 179.5 68 179.5 C 69 179.5 71 180.5 71 182 V 186 Z" fill="url(#windowGlow)" strokeWidth="0.3" />
          {/* Right minaret niches */}
          <path d="M 529 106 V 102 C 529 100.5 531 99.5 532 99.5 C 533 99.5 535 100.5 535 102 V 106 Z" fill="url(#windowGlow)" strokeWidth="0.3" />
          <path d="M 529 146 V 142 C 529 140.5 531 139.5 532 139.5 C 533 139.5 535 140.5 535 142 V 146 Z" fill="url(#windowGlow)" strokeWidth="0.3" />
          <path d="M 529 186 V 182 C 529 180.5 531 179.5 532 179.5 C 533 179.5 535 180.5 535 182 V 186 Z" fill="url(#windowGlow)" strokeWidth="0.3" />
        </g>

        {/* 8. SOULFUL LIGHTING, LANTERNS & TWINKLES */}
        <g fill="#aa7c11" fillOpacity="0.8">
          {/* Main Central Portal Hanging Lamp & Glow */}
          <line x1="300" y1="136" x2="300" y2="152" stroke="url(#monumentGold)" strokeWidth="0.6" />
          <motion.polygon 
            points="297,152 303,152 304,157 300,162 296,157" 
            fill="url(#windowGlow)" 
            stroke="url(#monumentGold)" 
            strokeWidth="0.4"
            animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1.0, 0.7] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle 
            cx="300" 
            cy="157" 
            r="8" 
            fill="url(#windowGlow)" 
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.8, 0.4] }} 
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }} 
          />

          {/* Left Wing Hanging Lamps */}
          <g>
            <line x1="130" y1="153" x2="130" y2="164" stroke="url(#monumentGold)" strokeWidth="0.4" />
            <motion.circle cx="130" cy="164" r="1.5" fill="#ffeaa8" animate={{ opacity: [0.3, 1.0, 0.3] }} transition={{ duration: 2.8, repeat: Infinity, delay: 0.2 }} />
            <line x1="180" y1="153" x2="180" y2="164" stroke="url(#monumentGold)" strokeWidth="0.4" />
            <motion.circle cx="180" cy="164" r="1.5" fill="#ffeaa8" animate={{ opacity: [0.3, 1.0, 0.3] }} transition={{ duration: 2.8, repeat: Infinity, delay: 0.9 }} />
          </g>

          {/* Right Wing Hanging Lamps */}
          <g>
            <line x1="420" y1="153" x2="420" y2="164" stroke="url(#monumentGold)" strokeWidth="0.4" />
            <motion.circle cx="420" cy="164" r="1.5" fill="#ffeaa8" animate={{ opacity: [0.3, 1.0, 0.3] }} transition={{ duration: 3.0, repeat: Infinity, delay: 0.5 }} />
            <line x1="470" y1="153" x2="470" y2="164" stroke="url(#monumentGold)" strokeWidth="0.4" />
            <motion.circle cx="470" cy="164" r="1.5" fill="#ffeaa8" animate={{ opacity: [0.3, 1.0, 0.3] }} transition={{ duration: 3.0, repeat: Infinity, delay: 1.2 }} />
          </g>

          {/* Minaret Top Lanterns (Glow inside dome balcony openings) */}
          <motion.circle cx="68" cy="74" r="2.5" fill="#ffeba8" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.2, repeat: Infinity, delay: 0.1 }} />
          <motion.circle cx="532" cy="74" r="2.5" fill="#ffeba8" animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 2.2, repeat: Infinity, delay: 0.8 }} />
        </g>
      </svg>
    </div>
  );
}
