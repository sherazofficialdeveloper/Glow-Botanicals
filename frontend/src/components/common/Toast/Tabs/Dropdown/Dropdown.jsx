// components/common/Dropdown/Dropdown.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export const Dropdown = ({
  trigger,
  items,
  onSelect,
  className = '',
  menuClassName = '',
  align = 'left',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleItemClick = (item) => {
    if (onSelect) onSelect(item);
    setIsOpen(false);
  };

  const alignClasses = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      {/* Trigger */}
      <div onClick={() => !disabled && setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div
          className={`
            absolute mt-2 min-w-[200px] bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50
            ${alignClasses[align] || alignClasses.left}
            ${menuClassName}
          `}
        >
          {items.map((item, index) => (
            <button
              key={index}
              onClick={() => handleItemClick(item)}
              className={`
                w-full px-4 py-2.5 text-sm text-left
                hover:bg-gray-50 transition-colors
                flex items-center space-x-2
                ${item.danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'}
                ${item.disabled ? 'opacity-50 cursor-not-allowed hover:bg-transparent' : ''}
              `}
              disabled={item.disabled}
            >
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              <span>{item.label}</span>
              {item.badge && (
                <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Dropdown Item Component
export const DropdownItem = ({
  label,
  icon,
  onClick,
  danger = false,
  disabled = false,
  badge,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full px-4 py-2.5 text-sm text-left
        hover:bg-gray-50 transition-colors
        flex items-center space-x-2
        ${danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700'}
        ${disabled ? 'opacity-50 cursor-not-allowed hover:bg-transparent' : ''}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
      {badge && (
        <span className="ml-auto text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
};