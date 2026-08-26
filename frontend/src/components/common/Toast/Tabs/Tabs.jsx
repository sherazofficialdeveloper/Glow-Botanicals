// components/common/Tabs/Tabs.jsx
'use client';

import { useState } from 'react';

export const Tabs = ({
  tabs,
  defaultTab,
  onChange,
  className = '',
  variant = 'default',
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (onChange) onChange(tabId);
  };

  const variants = {
    default: 'border-b border-gray-200',
    pills: 'space-x-2',
    underline: 'border-b border-gray-200',
  };

  const buttonVariants = {
    default: `
      px-4 py-2 text-sm font-medium text-gray-500 
      hover:text-gray-700 hover:border-gray-300 
      border-b-2 border-transparent 
      transition-all duration-200
      -mb-px
    `,
    pills: `
      px-4 py-2 text-sm font-medium rounded-full
      transition-all duration-200
    `,
    underline: `
      px-4 py-2 text-sm font-medium text-gray-500 
      hover:text-gray-700 
      border-b-2 border-transparent 
      transition-all duration-200
      -mb-px
    `,
  };

  const activeVariants = {
    default: 'text-[#d9006c] border-[#d9006c]',
    pills: 'bg-[#d9006c] text-white shadow-sm',
    underline: 'text-[#d9006c] border-[#d9006c]',
  };

  const activeTabData = tabs.find((tab) => tab.id === activeTab);

  return (
    <div className={className}>
      {/* Tab Headers */}
      <div className={`flex ${variant === 'pills' ? 'flex-wrap gap-2' : ''} ${variants[variant]}`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const baseStyles = buttonVariants[variant] || buttonVariants.default;
          const activeStyles = isActive ? activeVariants[variant] || activeVariants.default : '';

          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`${baseStyles} ${activeStyles} ${
                isActive ? 'font-bold' : ''
              }`}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
              {tab.count !== undefined && (
                <span className={`ml-2 text-xs ${isActive ? 'text-[#d9006c]' : 'text-gray-400'}`}>
                  ({tab.count})
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTabData?.content || activeTabData?.component}
      </div>
    </div>
  );
};