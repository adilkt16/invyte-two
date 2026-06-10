import React from 'react';
import { motion } from 'framer-motion';

export default function DrapedCurtains({ stage = 'open', className = '' }) {
  // Animating curtain parting using Framer Motion
  // Closed: curtains meet in the middle. Parting/Open: they pull back to frame the sides.
  const leftCurtainVariants = {
    closed: { width: '50.5%' },
    parting: { width: '12%', transition: { duration: 1.8, ease: [0.77, 0, 0.175, 1] } },
    open: { width: '12%' },
  };

  const rightCurtainVariants = {
    closed: { width: '50.5%' },
    parting: { width: '12%', transition: { duration: 1.8, ease: [0.77, 0, 0.175, 1] } },
    open: { width: '12%' },
  };

  const valanceVariants = {
    closed: { y: 0 },
    parting: { y: 0 },
    open: { y: 0 },
  };

  // Determine current animation state
  const currentState = stage === 'curtains-closing' || stage === 'envelope-closed' || stage === 'envelope-opening'
    ? 'closed'
    : stage === 'curtains-parting'
    ? 'parting'
    : 'open';

  return (
    <div className={`absolute inset-0 w-full h-full pointer-events-none z-30 select-none overflow-hidden ${className}`}>
      {/* LEFT DRAIPED CURTAIN */}
      <motion.div
        className="absolute top-0 bottom-0 left-0 h-full origin-left z-20"
        style={{ filter: 'drop-shadow(8px 0 10px rgba(0,0,0,0.25))' }}
        variants={leftCurtainVariants}
        initial="closed"
        animate={currentState}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 160 800"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Curtain Fabric Gold-Cream Gradient */}
            <linearGradient id="fabricGradLeft" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#80562e" />
              <stop offset="25%" stopColor="#bfa37a" />
              <stop offset="50%" stopColor="#8f6b43" />
              <stop offset="75%" stopColor="#e3cca8" />
              <stop offset="100%" stopColor="#7a5229" />
            </linearGradient>
            
            {/* Gold Shimmer Trim */}
            <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b8860b" />
              <stop offset="50%" stopColor="#ffd700" />
              <stop offset="100%" stopColor="#aa7c11" />
            </linearGradient>
          </defs>

          {/* Squeezed/Draped Shape of left curtain */}
          {/* S-curves to simulate fabric pulled to the side with a tie-back in the middle */}
          <path
            d="M 0 0 
               L 160 0 
               C 130 180, 80 320, 85 420 
               C 90 520, 140 680, 150 800 
               L 0 800 
               Z"
            fill="url(#fabricGradLeft)"
          />

          {/* Folds/shadow overlays */}
          <path d="M 0 0 C 40 180, 20 320, 30 420 C 40 520, 30 680, 35 800" stroke="rgba(0,0,0,0.22)" strokeWidth="4" fill="none" opacity="0.6" />
          <path d="M 0 0 C 80 180, 45 320, 50 420 C 55 520, 70 680, 75 800" stroke="rgba(0,0,0,0.25)" strokeWidth="6" fill="none" opacity="0.5" />
          <path d="M 0 0 C 120 180, 70 320, 75 420 C 80 520, 110 680, 115 800" stroke="rgba(255,255,255,0.18)" strokeWidth="5" fill="none" opacity="0.4" />
          <path d="M 0 0 C 150 180, 80 320, 85 420 C 90 520, 135 680, 145 800" stroke="rgba(0,0,0,0.3)" strokeWidth="4" fill="none" opacity="0.7" />

          {/* Golden border trim on the inner edge */}
          <path
            d="M 160 0 
               C 130 180, 80 320, 85 420 
               C 90 520, 140 680, 150 800"
            stroke="url(#goldTrim)"
            strokeWidth="5"
            fill="none"
          />

          {/* Tie-back tassel belt (Waist level) */}
          <g>
            {/* Belt */}
            <path d="M 0 410 Q 45 420 86 415 L 85 425 Q 45 430 0 420 Z" fill="url(#goldTrim)" stroke="#664614" strokeWidth="0.5" />
            {/* Hanging Tassel */}
            <path d="M 80 420 L 90 450 L 75 450 Z" fill="url(#goldTrim)" />
            <circle cx="82.5" cy="422" r="3" fill="#ffd700" />
          </g>
        </svg>
      </motion.div>

      {/* RIGHT DRAIPED CURTAIN */}
      <motion.div
        className="absolute top-0 bottom-0 right-0 h-full origin-right z-20"
        style={{ filter: 'drop-shadow(-8px 0 10px rgba(0,0,0,0.25))' }}
        variants={rightCurtainVariants}
        initial="closed"
        animate={currentState}
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 160 800"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Curtain Fabric Gold-Cream Gradient */}
            <linearGradient id="fabricGradRight" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#80562e" />
              <stop offset="25%" stopColor="#bfa37a" />
              <stop offset="50%" stopColor="#8f6b43" />
              <stop offset="75%" stopColor="#e3cca8" />
              <stop offset="100%" stopColor="#7a5229" />
            </linearGradient>
          </defs>

          {/* Squeezed/Draped Shape of right curtain */}
          <path
            d="M 160 0 
               L 0 0 
               C 30 180, 80 320, 75 420 
               C 70 520, 20 680, 10 800 
               L 160 800 
               Z"
            fill="url(#fabricGradRight)"
          />

          {/* Folds/shadow overlays */}
          <path d="M 160 0 C 120 180, 140 320, 130 420 C 120 520, 130 680, 125 800" stroke="rgba(0,0,0,0.22)" strokeWidth="4" fill="none" opacity="0.6" />
          <path d="M 160 0 C 80 180, 115 320, 110 420 C 105 520, 90 680, 85 800" stroke="rgba(0,0,0,0.25)" strokeWidth="6" fill="none" opacity="0.5" />
          <path d="M 160 0 C 40 180, 90 320, 85 420 C 80 520, 50 680, 45 800" stroke="rgba(255,255,255,0.18)" strokeWidth="5" fill="none" opacity="0.4" />
          <path d="M 160 0 C 10 180, 80 320, 75 420 C 70 520, 25 680, 15 800" stroke="rgba(0,0,0,0.3)" strokeWidth="4" fill="none" opacity="0.7" />

          {/* Golden border trim on the inner edge */}
          <path
            d="M 0 0 
               C 30 180, 80 320, 75 420 
               C 70 520, 20 680, 10 800"
            stroke="url(#goldTrim)"
            strokeWidth="5"
            fill="none"
          />

          {/* Tie-back belt */}
          <g>
            <path d="M 160 410 Q 115 420 74 415 L 75 425 Q 115 430 160 420 Z" fill="url(#goldTrim)" stroke="#664614" strokeWidth="0.5" />
            <path d="M 80 420 L 70 450 L 85 450 Z" fill="url(#goldTrim)" />
            <circle cx="77.5" cy="422" r="3" fill="#ffd700" />
          </g>
        </svg>
      </motion.div>
    </div>
  );
}
