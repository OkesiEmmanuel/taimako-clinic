'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  href,
  label,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400',
    outline:
      'border border-gray-300 text-gray-700 bg-transparent hover:bg-gray-100 focus:ring-gray-400',
  };

  const combined = `${baseStyles} ${variants[variant]} ${className} px-5 py-2.5 shadow`;

  const MotionWrapper = motion.div;

  if (href) {
    return (
      <MotionWrapper whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link href={href} className={combined}>
          {label}
        </Link>
      </MotionWrapper>
    );
  }

  return (
    <MotionWrapper whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <button className={combined} {...props}>
        {label}
      </button>
    </MotionWrapper>
  );
};

export default Button;
