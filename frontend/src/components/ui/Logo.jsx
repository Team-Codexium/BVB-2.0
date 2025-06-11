import React from 'react';

const Logo = ({ width = 150, height = 75, className = "" }) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 300 150" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#ef4444', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#dc2626', stopOpacity: 1}} />
        </linearGradient>
        <linearGradient id="blackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: '#374151', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: '#111827', stopOpacity: 1}} />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Background Circle */}
      <circle cx="150" cy="75" r="70" fill="url(#blackGradient)" opacity="0.1"/>
      
      {/* Left Doodle Character */}
      <g transform="translate(50, 30)">
        {/* Head */}
        <circle cx="25" cy="25" r="15" fill="none" stroke="url(#redGradient)" strokeWidth="3"/>
        
        {/* Eyes */}
        <circle cx="20" cy="22" r="2" fill="url(#redGradient)"/>
        <circle cx="30" cy="22" r="2" fill="url(#redGradient)"/>
        
        {/* Mouth */}
        <path d="M 18 30 Q 25 33 32 30" fill="none" stroke="url(#redGradient)" strokeWidth="2"/>
        
        {/* Body */}
        <line x1="25" y1="40" x2="25" y2="70" stroke="url(#redGradient)" strokeWidth="3"/>
        
        {/* Arms */}
        <line x1="25" y1="50" x2="10" y2="45" stroke="url(#redGradient)" strokeWidth="3"/>
        <line x1="25" y1="50" x2="40" y2="55" stroke="url(#redGradient)" strokeWidth="3"/>
        
        {/* Legs */}
        <line x1="25" y1="70" x2="15" y2="85" stroke="url(#redGradient)" strokeWidth="3"/>
        <line x1="25" y1="70" x2="35" y2="85" stroke="url(#redGradient)" strokeWidth="3"/>
        
        {/* Microphone */}
        <ellipse cx="5" cy="42" rx="4" ry="6" fill="url(#redGradient)"/>
        <line x1="9" y1="42" x2="10" y2="45" stroke="url(#blackGradient)" strokeWidth="2"/>
        
        {/* Sound waves */}
        <path d="M 0 35 Q -5 42 0 49" fill="none" stroke="url(#redGradient)" strokeWidth="1" opacity="0.6"/>
        <path d="M -3 32 Q -10 42 -3 52" fill="none" stroke="url(#redGradient)" strokeWidth="1" opacity="0.4"/>
      </g>
      
      {/* Right Doodle Character */}
      <g transform="translate(200, 30)">
        {/* Head */}
        <circle cx="25" cy="25" r="15" fill="none" stroke="url(#blackGradient)" strokeWidth="3"/>
        
        {/* Eyes */}
        <circle cx="20" cy="22" r="2" fill="url(#blackGradient)"/>
        <circle cx="30" cy="22" r="2" fill="url(#blackGradient)"/>
        
        {/* Mouth */}
        <path d="M 18 30 Q 25 33 32 30" fill="none" stroke="url(#blackGradient)" strokeWidth="2"/>
        
        {/* Body */}
        <line x1="25" y1="40" x2="25" y2="70" stroke="url(#blackGradient)" strokeWidth="3"/>
        
        {/* Arms */}
        <line x1="25" y1="50" x2="10" y2="55" stroke="url(#blackGradient)" strokeWidth="3"/>
        <line x1="25" y1="50" x2="40" y2="45" stroke="url(#blackGradient)" strokeWidth="3"/>
        
        {/* Legs */}
        <line x1="25" y1="70" x2="15" y2="85" stroke="url(#blackGradient)" strokeWidth="3"/>
        <line x1="25" y1="70" x2="35" y2="85" stroke="url(#blackGradient)" strokeWidth="3"/>
        
        {/* Microphone */}
        <ellipse cx="45" cy="42" rx="4" ry="6" fill="url(#blackGradient)"/>
        <line x1="41" y1="42" x2="40" y2="45" stroke="url(#redGradient)" strokeWidth="2"/>
        
        {/* Sound waves */}
        <path d="M 50 35 Q 55 42 50 49" fill="none" stroke="url(#blackGradient)" strokeWidth="1" opacity="0.6"/>
        <path d="M 53 32 Q 60 42 53 52" fill="none" stroke="url(#blackGradient)" strokeWidth="1" opacity="0.4"/>
      </g>
      
      {/* VS Text */}
      <text x="150" y="80" textAnchor="middle" fontFamily="Arial Black, sans-serif" fontSize="20" fontWeight="bold" fill="url(#redGradient)" filter="url(#glow)">VS</text>
      
      {/* Lightning bolts */}
      <path d="M 140 65 L 145 55 L 142 50 L 148 40" fill="none" stroke="url(#redGradient)" strokeWidth="2" opacity="0.7">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite"/>
      </path>
      <path d="M 160 65 L 155 55 L 158 50 L 152 40" fill="none" stroke="url(#redGradient)" strokeWidth="2" opacity="0.7">
        <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" begin="0.75s" repeatCount="indefinite"/>
      </path>
      
      {/* Musical notes */}
      <g opacity="0.5">
        <text x="30" y="20" fontFamily="Arial" fontSize="12" fill="url(#redGradient)">♪</text>
        <text x="270" y="25" fontFamily="Arial" fontSize="10" fill="url(#blackGradient)">♫</text>
        <text x="40" y="130" fontFamily="Arial" fontSize="8" fill="url(#redGradient)">♪</text>
        <text x="260" y="125" fontFamily="Arial" fontSize="12" fill="url(#blackGradient)">♫</text>
      </g>
      
      {/* Animated beat lines */}
      <g opacity="0.3">
        <line x1="80" y1="100" x2="90" y2="100" stroke="url(#redGradient)" strokeWidth="2">
          <animate attributeName="x2" values="90;100;90" dur="0.8s" repeatCount="indefinite"/>
        </line>
        <line x1="80" y1="105" x2="95" y2="105" stroke="url(#redGradient)" strokeWidth="2">
          <animate attributeName="x2" values="95;105;95" dur="0.6s" repeatCount="indefinite"/>
        </line>
        <line x1="80" y1="110" x2="85" y2="110" stroke="url(#redGradient)" strokeWidth="2">
          <animate attributeName="x2" values="85;95;85" dur="1s" repeatCount="indefinite"/>
        </line>
        
        <line x1="210" y1="100" x2="220" y2="100" stroke="url(#blackGradient)" strokeWidth="2">
          <animate attributeName="x1" values="210;200;210" dur="0.8s" repeatCount="indefinite"/>
        </line>
        <line x1="205" y1="105" x2="220" y2="105" stroke="url(#blackGradient)" strokeWidth="2">
          <animate attributeName="x1" values="205;195;205" dur="0.6s" repeatCount="indefinite"/>
        </line>
        <line x1="215" y1="110" x2="220" y2="110" stroke="url(#blackGradient)" strokeWidth="2">
          <animate attributeName="x1" values="215;205;215" dur="1s" repeatCount="indefinite"/>
        </line>
      </g>
    </svg>
  );
};

export default Logo;