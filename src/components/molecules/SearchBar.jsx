import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ 
  placeholder = "Search articles...", 
  onSearch, 
  onClear,
  value = '',
  className = '',
  showFilters = false,
  onToggleFilters
}) => {
  const [searchValue, setSearchValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = useCallback((searchTerm) => {
    setSearchValue(searchTerm);
    if (onSearch) {
      onSearch(searchTerm);
    }
  }, [onSearch]);

  const handleClear = useCallback(() => {
    setSearchValue('');
    if (onClear) {
      onClear();
    }
    if (onSearch) {
      onSearch('');
    }
  }, [onClear, onSearch]);

  return (
    <motion.div 
      className={`relative ${className}`}
      animate={{ scale: isFocused ? 1.02 : 1 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center space-x-3">
        <div className="flex-1 relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <ApperIcon name="Search" size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full pl-12 pr-12 py-3 text-gray-900 placeholder-gray-500 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
          />
          {searchValue && (
            <button
              onClick={handleClear}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <ApperIcon name="X" size={18} />
            </button>
          )}
        </div>
        
        {showFilters && (
          <Button
            variant="secondary"
            icon="Filter"
            onClick={onToggleFilters}
            className="shadow-sm hover:shadow-md"
          >
            Filters
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default SearchBar;