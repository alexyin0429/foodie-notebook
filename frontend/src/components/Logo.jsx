import React from 'react';

const Logo = ({ size = 40, className = "" }) => (
  <div className={`flex items-center ${className}`}>
    <img
      src="/favicon.ico"
      alt="Logo"
      className="full"
      style={{ width: size, height: size }}
    />
    <span className="ml-2 text-lg font-semibold text-indigo-600">Foodie Notebook</span>
  </div>
);

export default Logo;

