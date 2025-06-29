import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import ApperIcon from '@/components/ApperIcon';

const Header = ({ 
  title, 
  subtitle,
  showSearch = false,
  searchValue = '',
  onSearch,
  onSidebarToggle,
  actions = []
}) => {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-effect border-b border-gray-200/50 px-6 py-4 sticky top-0 z-30"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            icon="Menu"
            onClick={onSidebarToggle}
            className="lg:hidden"
          />
          
          <div>
            <h1 className="text-2xl font-bold text-gradient">{title}</h1>
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {showSearch && (
            <div className="hidden md:block w-80">
              <SearchBar
                value={searchValue}
                onSearch={onSearch}
                placeholder="Search articles, topics..."
              />
            </div>
          )}

          <div className="flex items-center space-x-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'secondary'}
                size="sm"
                icon={action.icon}
                onClick={action.onClick}
                className={action.className}
              >
                {action.label}
              </Button>
            ))}
          </div>

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              icon="Bell"
              className="relative"
            >
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      {showSearch && (
        <div className="md:hidden mt-4">
          <SearchBar
            value={searchValue}
            onSearch={onSearch}
            placeholder="Search articles, topics..."
          />
        </div>
      )}
    </motion.header>
  );
};

export default Header;