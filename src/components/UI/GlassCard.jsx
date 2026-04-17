import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility for merging tailwind classes efficiently
 */
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const GlassCard = ({ children, className, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={cn(
        "glass-card p-4 rounded-xl relative overflow-hidden",
        className
      )}
    >
      {/* Subtle top light effect */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-teal-glow/20 to-transparent" />
      
      {children}
    </motion.div>
  );
};

export default GlassCard;
