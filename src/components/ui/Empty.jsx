import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  icon = 'Inbox',
  title = 'No items found',
  description = 'There are no items to display at the moment.',
  action,
  actionText = 'Take Action',
  onAction,
  className = '',
  size = 'default'
}) => {
  const sizes = {
    sm: {
      container: 'py-8',
      icon: { size: 24, container: 'w-12 h-12' },
      title: 'text-lg',
      description: 'text-sm'
    },
    default: {
      container: 'py-16',
      icon: { size: 32, container: 'w-20 h-20' },
      title: 'text-2xl',
      description: 'text-base'
    },
    lg: {
      container: 'py-24',
      icon: { size: 40, container: 'w-24 h-24' },
      title: 'text-3xl',
      description: 'text-lg'
    }
  };

  const currentSize = sizes[size];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center ${currentSize.container} px-6 text-center ${className}`}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", damping: 20 }}
        className={`${currentSize.icon.container} bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6`}
      >
        <ApperIcon name={icon} size={currentSize.icon.size} className="text-gray-500" />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`${currentSize.title} font-bold text-gray-900 mb-3`}
      >
        {title}
      </motion.h3>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={`${currentSize.description} text-gray-600 mb-8 max-w-md`}
      >
        {description}
      </motion.p>

      {(action || onAction) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {action ? (
            action
          ) : (
            <Button
              onClick={onAction}
              variant="primary"
              size="lg"
              icon="Plus"
            >
              {actionText}
            </Button>
          )}
        </motion.div>
      )}

      {/* Decorative Elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary-200 rounded-full opacity-20"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-secondary-200 rounded-full opacity-30"></div>
        <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 bg-accent-200 rounded-full opacity-25"></div>
      </motion.div>
    </motion.div>
  );
};

export default Empty;