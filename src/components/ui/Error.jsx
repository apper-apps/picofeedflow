import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Error = ({ 
  message = 'Something went wrong', 
  description,
  onRetry,
  showHome = false,
  className = '' 
}) => {
  const handleGoHome = () => {
    window.location.href = '/';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center py-16 px-6 text-center ${className}`}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-20 h-20 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center mb-6"
      >
        <ApperIcon name="AlertTriangle" size={32} className="text-red-600" />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-2xl font-bold text-gray-900 mb-3"
      >
        {message}
      </motion.h3>

      {description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 mb-8 max-w-md"
        >
          {description}
        </motion.p>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        {onRetry && (
          <Button
            onClick={onRetry}
            icon="RefreshCw"
            variant="primary"
            size="lg"
          >
            Try Again
          </Button>
        )}
        
        {showHome && (
          <Button
            onClick={handleGoHome}
            icon="Home"
            variant="secondary"
            size="lg"
          >
            Go Home
          </Button>
        )}
      </motion.div>

      {/* Additional Help */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 bg-gray-50 rounded-lg max-w-md"
      >
        <p className="text-sm text-gray-600 mb-2">
          <strong>Having trouble?</strong>
        </p>
        <ul className="text-sm text-gray-600 space-y-1 text-left">
          <li>• Check your internet connection</li>
          <li>• Refresh the page</li>
          <li>• Try again in a few minutes</li>
        </ul>
      </motion.div>
    </motion.div>
  );
};

export default Error;