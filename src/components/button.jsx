import React from 'react';

export const Button = ({ children, variant = 'default', onClick, className }) => {
  const buttonStyles = variant === 'outline' 
    ? 'border border-gray-500 text-gray-500'
    : 'bg-blue-500 text-white';

  return (
    <button className={`px-4 py-2 rounded ${buttonStyles} ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};
