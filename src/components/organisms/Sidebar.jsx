import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Sidebar = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const [userRole] = useState('admin'); // In real app, get from auth context

  const adminMenuItems = [
    { path: '/admin', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/feeds', label: 'Feed Manager', icon: 'Rss' },
    { path: '/filters', label: 'Content Filters', icon: 'Filter' },
    { path: '/topics', label: 'Topics', icon: 'Tags' },
    { path: '/analytics', label: 'Analytics', icon: 'BarChart3' },
    { path: '/settings', label: 'Settings', icon: 'Settings' }
  ];

  const userMenuItems = [
    { path: '/', label: 'Dashboard', icon: 'Home' },
    { path: '/topics', label: 'Topics', icon: 'Tags' },
    { path: '/bookmarks', label: 'Bookmarks', icon: 'Bookmark' },
    { path: '/settings', label: 'Settings', icon: 'Settings' }
  ];

  const menuItems = userRole === 'admin' ? adminMenuItems : userMenuItems;

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed left-0 top-0 h-full w-72 sidebar-gradient text-white z-50 lg:translate-x-0 lg:static lg:z-auto"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center">
                  <ApperIcon name="Rss" size={22} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gradient-white">FeedFlow</h1>
                  <p className="text-xs text-gray-300">Smart News Curation</p>
                </div>
              </div>
              <button
                onClick={onToggle}
                className="lg:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && onToggle()}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                      isActive
                        ? 'bg-gradient-to-r from-primary-500/20 to-primary-600/20 text-white border border-primary-400/30'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <ApperIcon 
                        name={item.icon} 
                        size={20} 
                        className={isActive ? 'text-primary-300' : 'group-hover:text-white'}
                      />
                      <span className="font-medium">{item.label}</span>
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="ml-auto w-2 h-2 bg-primary-400 rounded-full"
                          initial={false}
                          transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/5">
              <div className="w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center">
                <ApperIcon name="User" size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {userRole === 'admin' ? 'Admin User' : 'Reader'}
                </p>
                <p className="text-xs text-gray-400 capitalize">{userRole}</p>
              </div>
              <button className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                <ApperIcon name="MoreHorizontal" size={16} className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;