import React from 'react';
import { motion } from 'framer-motion';

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'md',
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full transition-all duration-200';
  
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-gradient-to-r from-primary-100 to-primary-200 text-primary-800',
    secondary: 'bg-gradient-to-r from-secondary-100 to-secondary-200 text-secondary-800',
    accent: 'bg-gradient-to-r from-accent-100 to-accent-200 text-accent-800',
    success: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800',
    warning: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800',
    error: 'bg-gradient-to-r from-red-100 to-red-200 text-red-800',
    info: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800'
  };
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </motion.span>
  );
};

export default Badge;