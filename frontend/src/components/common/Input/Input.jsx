// components/common/Input/Input.jsx
'use client';

import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const Input = forwardRef(({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  icon,
  required = false,
  disabled = false,
  className = '',
  containerClassName = '',
  maxLength,
  min,
  max,
  step,
  rows,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const isTextarea = type === 'textarea';

  const baseInputStyles = `
    w-full px-4 py-2.5 border rounded-lg 
    focus:outline-none focus:ring-2 focus:ring-[#d9006c] focus:border-transparent
    transition-all duration-200
    disabled:bg-gray-100 disabled:cursor-not-allowed
    ${error ? 'border-red-500 focus:ring-red-500/50' : 'border-gray-300'}
    ${icon ? 'pl-10' : ''}
    ${className}
  `;

  const inputContent = isTextarea ? (
    <textarea
      ref={ref}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      rows={rows || 4}
      className={`${baseInputStyles} resize-y min-h-[80px]`}
      {...props}
    />
  ) : (
    <input
      ref={ref}
      type={inputType}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      maxLength={maxLength}
      min={min}
      max={max}
      step={step}
      className={baseInputStyles}
      {...props}
    />
  );

  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}
        {inputContent}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';