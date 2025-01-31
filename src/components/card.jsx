import React from 'react';

export const Card = ({ children, className }) => (
  <div className={`shadow-md rounded-lg p-4 bg-white ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children, className }) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children }) => (
  <div>
    {children}
  </div>
);
