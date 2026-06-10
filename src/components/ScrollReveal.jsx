import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function ScrollReveal({ children }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ y: 28, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : { y: 28, opacity: 0 }}
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1] // cubic-bezier 0.22 1 0.36 1
      }}
    >
      {children}
    </motion.div>
  );
}
