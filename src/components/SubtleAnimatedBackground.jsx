import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// A detailed 8-pointed geometric Islamic star path
const IslamicStarPattern = ({ size = 200, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    className={className}
    fill="none" 
    stroke="#aa7c11" 
    strokeWidth="0.5" 
    strokeOpacity="0.08"
  >
    {/* Concentric circles */}
    <circle cx="50" cy="50" r="45" strokeDasharray="1,2" />
    <circle cx="50" cy="50" r="38" />
    <circle cx="50" cy="50" r="28" strokeDasharray="2,1" />
    <circle cx="50" cy="50" r="12" />

    {/* Intersecting squares for 8-pointed star */}
    <rect x="25" y="25" width="50" height="50" transform="rotate(0 50 50)" />
    <rect x="25" y="25" width="50" height="50" transform="rotate(45 50 50)" />
    
    {/* Decorative inner lines */}
    <line x1="50" y1="5" x2="50" y2="95" strokeDasharray="1,3" />
    <line x1="5" y1="50" x2="95" y2="50" strokeDasharray="1,3" />
    <line x1="18.18" y1="18.18" x2="81.82" y2="81.82" strokeDasharray="1,3" />
    <line x1="18.18" y1="81.82" x2="81.82" y2="18.18" strokeDasharray="1,3" />

    {/* Outer floral-like tips */}
    {Array.from({ length: 8 }).map((_, i) => {
      const angle = (i * 45) * (Math.PI / 180);
      const x1 = 50 + 38 * Math.cos(angle);
      const y1 = 50 + 38 * Math.sin(angle);
      return (
        <circle 
          key={i} 
          cx={x1} 
          cy={y1} 
          r="1.5" 
          fill="#aa7c11" 
          fillOpacity="0.15" 
          stroke="none" 
        />
      );
    })}
  </svg>
);

// Large detailed center mandala
const ArabesqueMandala = ({ size = 500, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 200 200" 
    className={className}
    fill="none" 
    stroke="#aa7c11" 
    strokeWidth="0.4"
    strokeOpacity="0.05"
  >
    {/* Inner detail */}
    <circle cx="100" cy="100" r="10" />
    <circle cx="100" cy="100" r="20" strokeDasharray="1,1" />
    <circle cx="100" cy="100" r="40" />
    <circle cx="100" cy="100" r="60" strokeDasharray="2,2" />
    <circle cx="100" cy="100" r="80" />
    <circle cx="100" cy="100" r="95" />

    {/* Repeating arch/petal patterns */}
    {Array.from({ length: 16 }).map((_, i) => {
      const angle = (i * 22.5) * (Math.PI / 180);
      const x = 100 + 80 * Math.cos(angle);
      const y = 100 + 80 * Math.sin(angle);
      const rx = 100 + 95 * Math.cos(angle);
      const ry = 100 + 95 * Math.sin(angle);
      
      return (
        <g key={i}>
          {/* Radial spoke lines */}
          <line x1="100" y1="100" x2={rx} y2={ry} strokeOpacity="0.03" />
          {/* Petal loops */}
          <circle cx={x} cy={y} r="8" strokeOpacity="0.04" />
          {/* Tiny nodes */}
          <circle cx={x} cy={y} r="1.5" fill="#aa7c11" fillOpacity="0.1" stroke="none" />
        </g>
      );
    })}

    {/* Interlacing stars and diamonds */}
    {Array.from({ length: 8 }).map((_, i) => {
      const rot = i * 45;
      return (
        <g key={i} transform={`rotate(${rot} 100 100)`}>
          <path d="M100 20 L108 50 L100 80 L92 50 Z" strokeOpacity="0.04" />
          <path d="M100 5 L104 25 L100 45 L96 25 Z" strokeOpacity="0.03" />
          <rect x="75" y="75" width="50" height="50" strokeOpacity="0.02" />
        </g>
      );
    })}
  </svg>
);

export default function SubtleAnimatedBackground() {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    // Generate 18 subtle twinkling sparkles with random offsets and sizes
    const items = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // horizontal percent
      y: Math.random() * 90 + 5, // vertical percent
      size: Math.random() * 8 + 6, // 6px to 14px size
      duration: Math.random() * 4 + 4, // animation duration (4s to 8s)
      delay: Math.random() * 5, // delay before starting
    }));
    setSparkles(items);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none bg-[#fdfaf5]">
      
      {/* 1. Breathing Warm Ambient Glows */}
      <div className="absolute inset-0 opacity-[0.4] mix-blend-multiply">
        {/* Soft Gold Glow (Center Top) */}
        <motion.div 
          className="absolute top-[-10%] left-[25%] w-[50%] aspect-square rounded-full bg-gradient-to-b from-[#e5c185]/20 to-transparent blur-[80px]"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.9, 0.6],
            x: [0, 20, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Soft Rose/Amber Glow (Center Bottom) */}
        <motion.div 
          className="absolute bottom-[-15%] right-[20%] w-[60%] aspect-square rounded-full bg-gradient-to-t from-[#aa7c11]/10 to-transparent blur-[100px]"
          animate={{ 
            scale: [1.1, 0.95, 1.1],
            opacity: [0.5, 0.8, 0.5],
            y: [0, -15, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* 2. Slow-Rotating Mandalas / Islamic Geometric Watermarks */}
      {/* Large Center-Hero Mandala */}
      <div className="absolute top-[18%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 160, repeat: Infinity, ease: "linear" }}
          className="origin-center"
        >
          <ArabesqueMandala size={650} />
        </motion.div>
      </div>

      {/* Top Left Star Pattern */}
      <div className="absolute top-[8%] left-[-5%] md:left-[5%]">
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
          className="origin-center"
        >
          <IslamicStarPattern size={250} />
        </motion.div>
      </div>

      {/* Top Right Star Pattern */}
      <div className="absolute top-[8%] right-[-5%] md:right-[5%]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 110, repeat: Infinity, ease: "linear" }}
          className="origin-center"
        >
          <IslamicStarPattern size={250} />
        </motion.div>
      </div>

      {/* Bottom Mid-Section Mandalas (appear as scroll continues) */}
      <div className="absolute bottom-[20%] left-[-10%] md:left-[10%] opacity-40">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 140, repeat: Infinity, ease: "linear" }}
          className="origin-center"
        >
          <ArabesqueMandala size={350} />
        </motion.div>
      </div>

      <div className="absolute bottom-[10%] right-[-10%] md:right-[10%] opacity-40">
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="origin-center"
        >
          <ArabesqueMandala size={350} />
        </motion.div>
      </div>

      {/* 3. Twinkling Golden Sparkles (4-pointed star shapes) */}
      <div className="absolute inset-0">
        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            className="absolute"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              width: sparkle.size,
              height: sparkle.size,
            }}
            animate={{
              opacity: [0, 0.7, 0],
              scale: [0.6, 1.1, 0.6],
              rotate: [0, 45, 90],
              y: [0, -15, 0],
            }}
            transition={{
              duration: sparkle.duration,
              repeat: Infinity,
              delay: sparkle.delay,
              ease: "easeInOut",
            }}
          >
            {/* 4-pointed golden star path */}
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-[#aa7c11]/40">
              <path 
                d="M12 0 L15.5 8.5 L24 12 L15.5 15.5 L12 24 L8.5 15.5 L0 12 L8.5 8.5 Z" 
                fill="currentColor"
                stroke="#e5c185"
                strokeWidth="0.5"
                strokeOpacity="0.6"
              />
            </svg>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
