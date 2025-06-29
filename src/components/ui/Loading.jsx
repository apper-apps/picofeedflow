import React from 'react';
import { motion } from 'framer-motion';

const Loading = ({ type = 'articles', className = '' }) => {
  const renderArticlesSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white rounded-xl p-6 card-shadow"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <div className="w-4 h-4 bg-gray-200 rounded animate-pulse mr-2"></div>
                <div className="w-16 h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <div className="w-full h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-3/4 h-5 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse ml-3"></div>
          </div>

          {/* Summary */}
          <div className="space-y-2 mb-4">
            <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Topics */}
          <div className="flex space-x-2 mb-4">
            <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="w-12 h-6 bg-gray-200 rounded-full animate-pulse"></div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-4">
              <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderFeedsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white rounded-xl p-6 card-shadow"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center flex-1">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse mr-2"></div>
              <div className="w-32 h-5 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
          </div>

          {/* URL */}
          <div className="w-full h-4 bg-gray-200 rounded animate-pulse mb-4"></div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-6 bg-gray-200 rounded animate-pulse mx-auto mb-1"></div>
              <div className="w-16 h-3 bg-gray-200 rounded animate-pulse mx-auto"></div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-6 bg-gray-200 rounded animate-pulse mx-auto mb-1"></div>
              <div className="w-12 h-3 bg-gray-200 rounded animate-pulse mx-auto"></div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 mb-4">
            <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderTableSkeleton = () => (
    <div className="bg-white rounded-xl card-shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="w-48 h-6 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="divide-y divide-gray-200">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="px-6 py-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4 flex-1">
              <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="space-y-2">
                <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-48 h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderDashboardSkeleton = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-xl p-6 card-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-12 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="w-32 h-6 bg-gray-200 rounded animate-pulse mb-6"></div>
        <div className="w-full h-64 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Recent Items */}
      <div className="bg-white rounded-xl p-6 card-shadow">
        <div className="w-40 h-6 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="flex-1 space-y-2">
                <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-1/2 h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'feeds':
        return renderFeedsSkeleton();
      case 'table':
        return renderTableSkeleton();
      case 'dashboard':
        return renderDashboardSkeleton();
      case 'articles':
      default:
        return renderArticlesSkeleton();
    }
  };

  return (
    <div className={`animate-pulse ${className}`}>
      {renderSkeleton()}
    </div>
  );
};

export default Loading;