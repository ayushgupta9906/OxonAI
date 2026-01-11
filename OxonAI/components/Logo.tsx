export default function Logo() {
    return (
        <svg
            width="250"
            height="65"
            viewBox="0 0 650 180"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-14 w-auto"
        >
            {/* Circuit/Arrow Icon */}
            <g transform="translate(110, 35) scale(1.4)">
                <circle cx="0" cy="0" r="5" fill="#06B6D4" />
                <line x1="0" y1="0" x2="20" y2="-8" stroke="#3B82F6" strokeWidth="3.5" />
                <circle cx="20" cy="-8" r="4.5" fill="#3B82F6" />
                <line x1="20" y1="-8" x2="40" y2="5" stroke="#6366F1" strokeWidth="3.5" />
                <circle cx="40" cy="5" r="4.5" fill="#6366F1" />
                <line x1="40" y1="5" x2="60" y2="-5" stroke="#7C3AED" strokeWidth="3.5" />
                <circle cx="60" cy="-5" r="4.5" fill="#7C3AED" />
                <line x1="60" y1="-5" x2="80" y2="3" stroke="#06B6D4" strokeWidth="3.5" />
                <circle cx="80" cy="3" r="5" fill="#06B6D4" />
            </g>

            {/* Text: Oxon */}
            <defs>
                <linearGradient id="oxonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7C3AED" />
                    <stop offset="50%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
            </defs>

            <text
                x="50"
                y="120"
                fontSize="90"
                fontWeight="700"
                fontFamily="Outfit, Inter, system-ui, sans-serif"
                fill="url(#oxonGradient)"
            >
                Oxon
            </text>

            {/* Text: AI */}
            <text
                x="285"
                y="120"
                fontSize="90"
                fontWeight="700"
                fontFamily="Outfit, Inter, system-ui, sans-serif"
                fill="currentColor"
                className="fill-foreground/90"
            >
                AI
            </text>
        </svg>
    );
}
