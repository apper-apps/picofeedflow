import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = true, 
  gradient = false, 
  glass = false,
  onClick,
  ...props 
}) => {
  const baseClasses = 'rounded-xl transition-all duration-300';
  const hoverClasses = hover ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : '';
  const gradientClasses = gradient ? 'gradient-card' : 'bg-white';
  const glassClasses = glass ? 'glass-effect' : 'card-shadow';
  
  const Component = onClick ? motion.div : 'div';
  const motionProps = onClick ? {
    whileHover: { scale: 1.02, y: -4 },
    whileTap: { scale: 0.98 }
  } : {};

  return (
    <Component
      className={`${baseClasses} ${hoverClasses} ${gradientClasses} ${glassClasses} ${className}`}
      onClick={onClick}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Card;