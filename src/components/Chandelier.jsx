import React from 'react';
import { motion } from 'framer-motion';

export default function Chandelier() {
  return (
    <motion.div 
      className="relative w-40 h-40 sm:w-48 sm:h-48 mx-auto flex justify-center items-start origin-top"
      animate={{ rotate: [-1, 1, -1] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_8px_16px_rgba(201,160,96,0.35)]"
      >
        <defs>
          {/* Gold gradients for frame */}
          <linearGradient id="goldFrame" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8c6239" />
            <stop offset="35%" stopColor="#dfba7a" />
            <stop offset="70%" stopColor="#c9a060" />
            <stop offset="100%" stopColor="#5c3f21" />
          </linearGradient>

          {/* Crystal Highlight Gradient */}
          <linearGradient id="crystalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="20%" stopColor="#f7f3ee" />
            <stop offset="50%" stopColor="#eedebe" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>

          {/* Candle Flame Radial Glow */}
          <radialGradient id="flameGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="25%" stopColor="#ffeed1" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#c9a060" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#c9a060" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Chain Link and Loop */}
        <path d="M100 0 V35" stroke="url(#goldFrame)" strokeWidth="2.5" />
        <ellipse cx="100" cy="12" rx="3" ry="5" stroke="url(#goldFrame)" strokeWidth="1.5" fill="none" />
        <ellipse cx="100" cy="24" rx="3" ry="5" stroke="url(#goldFrame)" strokeWidth="1.5" fill="none" />
        
        {/* Top Canopy Dome */}
        <path d="M85 35 C85 25, 115 25, 115 35 L108 40 H92 Z" fill="url(#goldFrame)" />
        {/* Crystal bead strings from canopy */}
        <path d="M88 40 L70 70 M112 40 L130 70" stroke="#fff" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.8" />

        {/* Central Stem column */}
        <rect x="97" y="38" width="6" height="75" fill="url(#goldFrame)" rx="1.5" />
        
        {/* --- TIER 1 ARMS (Small Upper Tier) --- */}
        <path d="M78 65 Q65 65 65 80 Q65 95 100 95 Q135 95 135 80 Q135 65 122 65" stroke="url(#goldFrame)" strokeWidth="2" fill="none" />
        
        {/* --- TIER 2 ARMS (Large Lower Tier) --- */}
        <path d="M55 85 C35 85, 30 115, 65 125 C100 135, 100 135, 135 125 C170 115, 165 85, 145 85" stroke="url(#goldFrame)" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M40 95 C15 95, 10 135, 60 150 C100 160, 100 160, 140 150 C190 135, 185 95, 160 95" stroke="url(#goldFrame)" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* Ornate Gold S-scroll decorative details */}
        <path d="M80 75 Q100 60 120 75" stroke="url(#goldFrame)" strokeWidth="1.5" fill="none" />
        <path d="M90 95 Q100 112 110 95" stroke="url(#goldFrame)" strokeWidth="1.5" fill="none" />

        {/* --- CANDLE HOLDERS & FLAMES --- */}
        
        {/* Tier 1 Candles */}
        {/* Left 1 */}
        <g>
          <rect x="62" y="72" width="6" height="10" fill="url(#goldFrame)" />
          <circle cx="65" cy="67" r="5" fill="url(#flameGlow)" className="animate-ping" style={{ animationDuration: '3s' }} />
          <path d="M65 72 C65 64, 68 64, 65 58 C62 64, 65 64, 65 72 Z" fill="#fff" className="animate-pulse" style={{ animationDuration: '1.2s' }} />
        </g>
        {/* Right 1 */}
        <g>
          <rect x="132" y="72" width="6" height="10" fill="url(#goldFrame)" />
          <circle cx="135" cy="67" r="5" fill="url(#flameGlow)" className="animate-ping" style={{ animationDuration: '2.5s' }} />
          <path d="M135 72 C135 64, 138 64, 135 58 C132 64, 135 64, 135 72 Z" fill="#fff" className="animate-pulse" style={{ animationDuration: '1.5s' }} />
        </g>

        {/* Tier 2 Candles */}
        {/* Far Left */}
        <g>
          <rect x="37" y="87" width="6" height="12" fill="url(#goldFrame)" />
          <circle cx="40" cy="80" r="7" fill="url(#flameGlow)" className="animate-pulse" style={{ animationDuration: '2s' }} />
          <path d="M40 87 C40 77, 43 77, 40 70 C37 77, 40 77, 40 87 Z" fill="#fff" className="animate-pulse" style={{ animationDuration: '0.8s' }} />
        </g>
        {/* Mid Left */}
        <g>
          <rect x="52" y="77" width="6" height="12" fill="url(#goldFrame)" />
          <circle cx="55" cy="70" r="7" fill="url(#flameGlow)" className="animate-pulse" style={{ animationDuration: '2.8s' }} />
          <path d="M55 77 C55 67, 58 67, 55 60 C52 67, 55 67, 55 77 Z" fill="#fff" className="animate-pulse" style={{ animationDuration: '1.1s' }} />
        </g>
        {/* Mid Right */}
        <g>
          <rect x="142" y="77" width="6" height="12" fill="url(#goldFrame)" />
          <circle cx="145" cy="70" r="7" fill="url(#flameGlow)" className="animate-pulse" style={{ animationDuration: '2.4s' }} />
          <path d="M145 77 C145 67, 148 67, 145 60 C142 67, 145 67, 145 77 Z" fill="#fff" className="animate-pulse" style={{ animationDuration: '0.9s' }} />
        </g>
        {/* Far Right */}
        <g>
          <rect x="157" y="87" width="6" height="12" fill="url(#goldFrame)" />
          <circle cx="160" cy="80" r="7" fill="url(#flameGlow)" className="animate-pulse" style={{ animationDuration: '3.2s' }} />
          <path d="M160 87 C160 77, 163 77, 160 70 C157 77, 160 77, 160 87 Z" fill="#fff" className="animate-pulse" style={{ animationDuration: '1.3s' }} />
        </g>

        {/* --- CRYSTAL DRAPES (Hanging Beads) --- */}
        {/* Outer Tier 2 draped beads */}
        <path d="M40 92 Q100 145 160 92" stroke="#fff" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.8" />
        <path d="M55 82 Q100 125 145 82" stroke="#fff" strokeWidth="1.2" strokeDasharray="2.5 2.5" opacity="0.75" />
        {/* Tier 1 draped beads */}
        <path d="M65 77 Q100 102 135 77" stroke="#fff" strokeWidth="1.0" strokeDasharray="2 2" opacity="0.7" />

        {/* --- CRYSTAL PENDANTS (Teardrop Shapes) --- */}
        {/* Center Main Pendant */}
        <g className="animate-pulse" style={{ animationDuration: '2.5s' }}>
          <line x1="100" y1="113" x2="100" y2="128" stroke="url(#goldFrame)" strokeWidth="1" />
          {/* Main big crystal */}
          <polygon points="100,128 94,142 100,154 106,142" fill="url(#crystalGrad)" stroke="#c9a060" strokeWidth="0.5" />
          <polygon points="100,128 97,142 100,154" fill="#fff" opacity="0.7" />
        </g>

        {/* Left Arm Pendant 1 */}
        <g className="animate-pulse" style={{ animationDuration: '3.5s', animationDelay: '0.3s' }}>
          <line x1="55" y1="120" x2="55" y2="132" stroke="url(#goldFrame)" strokeWidth="0.75" />
          <polygon points="55,132 50,143 55,152 60,143" fill="url(#crystalGrad)" stroke="#c9a060" strokeWidth="0.4" />
        </g>
        {/* Right Arm Pendant 1 */}
        <g className="animate-pulse" style={{ animationDuration: '3.2s', animationDelay: '0.6s' }}>
          <line x1="145" y1="120" x2="145" y2="132" stroke="url(#goldFrame)" strokeWidth="0.75" />
          <polygon points="145,132 140,143 145,152 150,143" fill="url(#crystalGrad)" stroke="#c9a060" strokeWidth="0.4" />
        </g>

        {/* Left Arm Pendant 2 (Mid-Left) */}
        <g className="animate-pulse" style={{ animationDuration: '4s', animationDelay: '0.1s' }}>
          <line x1="78" y1="124" x2="78" y2="136" stroke="url(#goldFrame)" strokeWidth="0.75" />
          <polygon points="78,136 74,145 78,153 82,145" fill="url(#crystalGrad)" stroke="#c9a060" strokeWidth="0.4" />
        </g>
        {/* Right Arm Pendant 2 (Mid-Right) */}
        <g className="animate-pulse" style={{ animationDuration: '3.8s', animationDelay: '0.8s' }}>
          <line x1="122" y1="124" x2="122" y2="136" stroke="url(#goldFrame)" strokeWidth="0.75" />
          <polygon points="122,136 118,145 122,153 126,145" fill="url(#crystalGrad)" stroke="#c9a060" strokeWidth="0.4" />
        </g>

        {/* Small hanging beads from every candle node */}
        <g fill="url(#crystalGrad)" stroke="#c9a060" strokeWidth="0.3">
          <polygon points="40,99 37,105 40,110 43,105" />
          <polygon points="55,89 52,95 55,100 58,95" />
          <polygon points="145,89 142,95 145,100 148,95" />
          <polygon points="160,99 157,105 160,110 163,105" />
        </g>

        {/* --- SPARKLE FLASHES (Star highlights that light up) --- */}
        {/* Sparkle 1 */}
        <path
          d="M48 105 L50 102 L48 99 L46 102 Z"
          fill="#fff"
          className="animate-pulse"
          style={{ animationDuration: '1.4s', animationDelay: '0.1s' }}
        />
        {/* Sparkle 2 */}
        <path
          d="M152 105 L154 102 L152 99 L150 102 Z"
          fill="#fff"
          className="animate-pulse"
          style={{ animationDuration: '1.8s', animationDelay: '0.5s' }}
        />
        {/* Sparkle 3 (Big centerpiece flash) */}
        <path
          d="M100 142 L103 139 L100 136 L97 139 Z"
          fill="#fff"
          className="animate-pulse"
          style={{ animationDuration: '2.2s', animationDelay: '1s' }}
        />
        {/* Sparkle 4 */}
        <path
          d="M100 50 L101.5 48 L100 46 L98.5 48 Z"
          fill="#fff"
          className="animate-pulse"
          style={{ animationDuration: '1.2s', animationDelay: '0.8s' }}
        />
      </svg>
    </motion.div>
  );
}
