import React from 'react';
import { motion } from 'framer-motion';

export default function FloatingPetals() {
  // Configs for exactly 6 floating rose petals
  const petals = [
    { id: 1, left: '8%', size: 16, duration: 14, delay: 0, sway: 40 },
    { id: 2, left: '25%', size: 12, duration: 18, delay: 3, sway: -30 },
    { id: 3, left: '42%', size: 20, duration: 16, delay: 1.5, sway: 50 },
    { id: 4, left: '60%', size: 14, duration: 15, delay: 4.5, sway: -40 },
    { id: 5, left: '78%', size: 18, duration: 19, delay: 2.5, sway: 35 },
    { id: 6, left: '92%', size: 15, duration: 17, delay: 6, sway: -25 }
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-20">
      {petals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute text-[#d4967a] opacity-40"
          style={{
            left: petal.left,
            top: '-50px', // Start above screen
            width: petal.size,
            height: petal.size,
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, petal.sway, -petal.sway, 0],
            rotate: [0, 180, 360, 540],
          }}
          transition={{
            y: {
              duration: petal.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: petal.delay,
            },
            x: {
              duration: petal.duration / 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: petal.delay,
            },
            rotate: {
              duration: petal.duration,
              repeat: Infinity,
              ease: 'linear',
              delay: petal.delay,
            },
          }}
        >
          {/* Custom Organic Petal Path */}
          <svg viewBox="0 0 30 30" className="w-full h-full fill-current">
            <path d="M15,5 C22,5 26,12 22,20 C18,25 12,25 8,20 C4,12 8,5 15,5 Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
