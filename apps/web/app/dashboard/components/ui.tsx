'use client';

import React, { useState } from 'react';
import { Loader2, Eye, EyeOff } from 'lucide-react';

type ButtonSize = 'sm' | 'md';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'premium';
  isLoading?: boolean;
  size?: ButtonSize;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading,
  className = '',
  disabled,
  size = 'md',
  ...props
}) => {
  const baseStyles =
    'px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';
  const variants = {
    primary: 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-900/20 border border-cyan-500/50',
    premium:
      'bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-900/30 border border-white/10',
    secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600',
    outline: 'bg-transparent border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500',
    ghost: 'bg-transparent text-slate-400 hover:text-white hover:bg-white/5',
  };
  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: '',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, helperText, className = '', type, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full group">
      {label && (
        <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wide transition-colors group-focus-within:text-cyan-500">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type={inputType}
          className={`w-full bg-slate-900/50 border ${
            error ? 'border-red-500/50 focus:border-red-500' : 'border-slate-800 focus:border-cyan-500/50'
          } focus:ring-1 focus:ring-cyan-500/50 rounded-lg px-4 py-2.5 text-slate-200 placeholder-slate-600 transition-all outline-none font-sans ${
            isPassword ? 'pr-10' : ''
          } ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 focus:outline-none transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      <div className="min-h-[20px] mt-1">
        {helperText && !error && <p className="text-xs text-slate-500">{helperText}</p>}
        {error && <p className="text-xs text-red-400 flex items-center gap-1">{error}</p>}
      </div>
    </div>
  );
};

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  return <div className={`glass-card rounded-xl border border-slate-800/60 ${className}`}>{children}</div>;
};

export const Checkbox: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
}> = ({ label, checked, onChange, required }) => (
  <label className="flex items-start gap-3 cursor-pointer group">
    <div className="relative flex items-center pt-0.5">
      <input type="checkbox" className="peer sr-only" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <div
        className={`w-5 h-5 border rounded transition-all duration-200 flex items-center justify-center ${
          checked
            ? 'bg-cyan-600 border-cyan-600 shadow-lg shadow-cyan-900/50'
            : 'border-slate-700 bg-slate-900/50 group-hover:border-slate-500'
        }`}
      >
        {checked && (
          <svg
            className="w-3.5 h-3.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
    </div>
    <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors leading-relaxed select-none">
      {label} {required && <span className="text-red-400">*</span>}
    </span>
  </label>
);
