export function BarbershopIllustration() {
  return (
    <svg
      viewBox="0 0 400 300"
      className="w-full h-full max-w-md mx-auto"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <rect width="400" height="300" fill="url(#gradient)" />

      {/* Barbershop Building */}
      <rect x="50" y="120" width="300" height="150" fill="#2D3748" rx="8" />
      <rect x="60" y="130" width="280" height="130" fill="#4A5568" rx="4" />

      {/* Windows */}
      <rect x="80" y="150" width="60" height="80" fill="#E2E8F0" rx="4" />
      <rect x="160" y="150" width="80" height="80" fill="#E2E8F0" rx="4" />
      <rect x="260" y="150" width="60" height="80" fill="#E2E8F0" rx="4" />

      {/* Door */}
      <rect x="190" y="190" width="20" height="40" fill="#8B4513" rx="2" />
      <circle cx="205" cy="210" r="1" fill="#FFD700" />

      {/* Barber Pole */}
      <rect x="170" y="80" width="8" height="60" fill="#DC143C" />
      <rect x="170" y="80" width="8" height="8" fill="#FFFFFF" />
      <rect x="170" y="96" width="8" height="8" fill="#0000FF" />
      <rect x="170" y="112" width="8" height="8" fill="#FFFFFF" />
      <rect x="170" y="128" width="8" height="8" fill="#DC143C" />
      <circle cx="174" cy="75" r="6" fill="#C0C0C0" />
      <circle cx="174" cy="145" r="6" fill="#C0C0C0" />

      {/* Sign */}
      <rect x="120" y="100" width="160" height="30" fill="#1A202C" rx="4" />
      <text x="200" y="120" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="bold">
        BARBERSHOP
      </text>

      {/* Scissors Icon */}
      <g transform="translate(90, 105)">
        <path
          d="M8 2L4 6L8 10M16 2L20 6L16 10M12 6H12.01"
          stroke="#FFD700"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      {/* Hair Clipper Icon */}
      <g transform="translate(290, 105)">
        <rect x="0" y="0" width="12" height="20" fill="#4A5568" rx="2" />
        <rect x="2" y="2" width="8" height="4" fill="#E2E8F0" rx="1" />
        <rect x="1" y="8" width="10" height="2" fill="#FFD700" />
        <rect x="1" y="12" width="10" height="2" fill="#FFD700" />
        <rect x="1" y="16" width="10" height="2" fill="#FFD700" />
      </g>

      {/* Clouds */}
      <ellipse cx="100" cy="40" rx="20" ry="12" fill="#FFFFFF" opacity="0.8" />
      <ellipse cx="300" cy="30" rx="25" ry="15" fill="#FFFFFF" opacity="0.6" />

      {/* Sun */}
      <circle cx="350" cy="50" r="15" fill="#FFD700" />
      <g stroke="#FFD700" strokeWidth="2" strokeLinecap="round">
        <line x1="350" y1="20" x2="350" y2="25" />
        <line x1="350" y1="75" x2="350" y2="80" />
        <line x1="320" y1="50" x2="325" y2="50" />
        <line x1="375" y1="50" x2="380" y2="50" />
        <line x1="330" y1="30" x2="334" y2="34" />
        <line x1="366" y1="66" x2="370" y2="70" />
        <line x1="370" y1="30" x2="366" y2="34" />
        <line x1="334" y1="66" x2="330" y2="70" />
      </g>

      {/* Gradient Definition */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#667EEA" />
          <stop offset="100%" stopColor="#764BA2" />
        </linearGradient>
      </defs>
    </svg>
  )
}
