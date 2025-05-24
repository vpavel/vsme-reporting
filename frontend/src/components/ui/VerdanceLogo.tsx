interface VerdanceLogoProps {
  size?: number;
  className?: string;
}

export default function VerdanceLogo({ size = 40, className = "" }: VerdanceLogoProps) {
  return (
    <svg
      viewBox="0 0 250 70"
      width={size * 3.57}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gradient for the circles */}
        <radialGradient id="circleGradient1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{ stopColor: "#a7f3d0", stopOpacity: 0.9 }} />
          <stop offset="100%" style={{ stopColor: "#6ee7b7", stopOpacity: 0.7 }} />
        </radialGradient>
        <radialGradient id="circleGradient2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{ stopColor: "#86efac", stopOpacity: 0.9 }} />
          <stop offset="100%" style={{ stopColor: "#4ade80", stopOpacity: 0.7 }} />
        </radialGradient>
        <radialGradient id="circleGradient3" cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{ stopColor: "#bbf7d0", stopOpacity: 0.9 }} />
          <stop offset="100%" style={{ stopColor: "#86efac", stopOpacity: 0.7 }} />
        </radialGradient>
        {/* Subtle glow filter */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Environmental Circle (Top) */}
      <circle cx="35" cy="25" r="16" fill="url(#circleGradient1)" filter="url(#glow)" opacity="0.8" />

      {/* Social Circle (Bottom Left) */}
      <circle cx="23" cy="45" r="16" fill="url(#circleGradient2)" filter="url(#glow)" opacity="0.8" />

      {/* Governance Circle (Bottom Right) */}
      <circle cx="47" cy="45" r="16" fill="url(#circleGradient3)" filter="url(#glow)" opacity="0.8" />

      {/* Verdance Text */}
      <text
        x="85"
        y="45"
        fontFamily="'Inter', 'Segoe UI', -apple-system, sans-serif"
        fontSize="36"
        fontWeight="600"
        fill="#065f46"
        letterSpacing="-0.8px"
      >
        Verdance
      </text>
    </svg>
  );
}
