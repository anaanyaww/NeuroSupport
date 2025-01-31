import React, { useState, useEffect } from 'react';
import { Sun, Moon, Palette, Leaf, Heart, Coffee, Cloud } from 'lucide-react';

const ThemeProvider = ({ children }) => {
  // Initialize theme from localStorage or default to 'light'
  const [currentTheme, setCurrentTheme] = useState(() => {
    const savedTheme = localStorage.getItem('preferred-theme');
    return savedTheme || 'light';
  });
  
  const themes = {
    light: {
      primary: '#f8fafc',
      secondary: '#ffffff',
      text: '#334155',
      accent: '#818cf8',
      border: '#e2e8f0',
      shadow: 'rgba(0, 0, 0, 0.05)'
    },
    dark: {
      primary: '#1e293b',
      secondary: '#334155',
      text: '#f8fafc',
      accent: '#818cf8',
      border: '#475569',
      shadow: 'rgba(0, 0, 0, 0.2)'
    },
    pastelLavender: {
      primary: '#fef6ff',
      secondary: '#ffffff',
      text: '#4a5568',
      accent: '#c4b5fd',
      border: '#f3e8ff',
      shadow: 'rgba(196, 181, 253, 0.1)'
    },
    pastelBlue: {
      primary: '#f0f9ff',
      secondary: '#ffffff',
      text: '#334155',
      accent: '#93c5fd',
      border: '#e0f2fe',
      shadow: 'rgba(147, 197, 253, 0.1)'
    },
    pastelMint: {
      primary: '#f0fdf4',
      secondary: '#ffffff',
      text: '#374151',
      accent: '#86efac',
      border: '#dcfce7',
      shadow: 'rgba(134, 239, 172, 0.1)'
    },
    pastelPeach: {
      primary: '#fff5f5',
      secondary: '#ffffff',
      text: '#4a5568',
      accent: '#fdb5b5',
      border: '#fee2e2',
      shadow: 'rgba(253, 181, 181, 0.1)'
    },
    pastelYellow: {
      primary: '#fefce8',
      secondary: '#ffffff',
      text: '#4a5568',
      accent: '#fde047',
      border: '#fef9c3',
      shadow: 'rgba(253, 224, 71, 0.1)'
    },
    warmSand: {
      primary: '#fef3c7',
      secondary: '#fffbeb',
      text: '#92400e',
      accent: '#f59e0b',
      border: '#fde68a',
      shadow: 'rgba(245, 158, 11, 0.1)'
    },
    warmRose: {
      primary: '#fff1f2',
      secondary: '#ffffff',
      text: '#881337',
      accent: '#fb7185',
      border: '#ffe4e6',
      shadow: 'rgba(251, 113, 133, 0.1)'
    },
    serenity: {
      primary: '#f0f4f8',
      secondary: '#ffffff',
      text: '#334155',
      accent: '#64748b',
      border: '#e2e8f0',
      shadow: 'rgba(100, 116, 139, 0.1)'
    }
  };

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem('preferred-theme', currentTheme);
    
    const root = document.documentElement;
    const theme = themes[currentTheme];
    
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }, [currentTheme]);

  // Formatted theme name for tooltip
  const formatThemeName = (theme) => {
    return theme
      .replace(/([A-Z])/g, ' $1')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const ThemeButton = ({ theme, icon: Icon, color }) => (
    <button
      onClick={() => setCurrentTheme(theme)}
      className={`p-2 rounded-md transition-all duration-200 hover:scale-110 hover:shadow-lg
        ${currentTheme === theme 
          ? 'bg-gray-100 shadow-inner ring-2 ring-opacity-50 ring-offset-2 ring-offset-white ring-gray-200' 
          : 'hover:bg-gray-50'
        }`}
      aria-label={`Switch to ${formatThemeName(theme)} theme`}
      title={formatThemeName(theme)}
      role="radio"
      aria-checked={currentTheme === theme}
    >
      <Icon 
        size={20} 
        color={color} 
        className="transition-transform duration-200"
      />
    </button>
  );

  return (
    <div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: themes[currentTheme].primary }}>
      <div 
        className="fixed top-4 right-4 flex flex-wrap gap-2 bg-white p-3 rounded-lg shadow-lg max-w-xs z-50"
        role="radiogroup"
        aria-label="Theme selection"
      >
        <ThemeButton theme="light" icon={Sun} color="#64748b" />
        <ThemeButton theme="dark" icon={Moon} color="#64748b" />
        <ThemeButton theme="pastelLavender" icon={Cloud} color="#c4b5fd" />
        <ThemeButton theme="pastelBlue" icon={Cloud} color="#93c5fd" />
        <ThemeButton theme="pastelMint" icon={Leaf} color="#86efac" />
        <ThemeButton theme="pastelPeach" icon={Heart} color="#fdb5b5" />
        <ThemeButton theme="pastelYellow" icon={Sun} color="#fde047" />
        <ThemeButton theme="warmSand" icon={Coffee} color="#f59e0b" />
        <ThemeButton theme="warmRose" icon={Heart} color="#fb7185" />
        <ThemeButton theme="serenity" icon={Cloud} color="#64748b" />
      </div>
      {children}
    </div>
  );
};

export default ThemeProvider;