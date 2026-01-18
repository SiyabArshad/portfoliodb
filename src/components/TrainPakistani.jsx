import { motion } from 'framer-motion';

export default function TrainPakistani({ stopped = false }) {
    return (
        <motion.div
            className="relative z-20 w-[600px] h-[180px] select-none"
            initial={{ x: 0 }}
            animate={{ x: 0 }}
        >
            <svg viewBox="0 0 600 180" className="w-full h-full drop-shadow-2xl">
                {/* Train Body - Classic Green */}
                <path
                    d="M 520,50 
             L 50,50 
             C 30,50 10,70 5,140 
             L 5,160 
             L 580,160
             C 590,160 600,150 600,140
             L 600,50
             Z"
                    fill="#115E34"
                />

                {/* Yellow Branding Stripes */}
                <rect x="0" y="80" width="600" height="15" fill="#FFD700" />
                <rect x="0" y="110" width="600" height="5" fill="#FFD700" />

                {/* Windows (Old school, smaller) */}
                <rect x="450" y="60" width="80" height="50" rx="2" fill="#222" stroke="#FFD700" strokeWidth="2" />
                <rect x="330" y="60" width="80" height="50" rx="2" fill="#222" stroke="#FFD700" strokeWidth="2" />
                <rect x="210" y="60" width="80" height="50" rx="2" fill="#222" stroke="#FFD700" strokeWidth="2" />
                <rect x="90" y="60" width="80" height="50" rx="2" fill="#222" stroke="#FFD700" strokeWidth="2" />

                {/* Engine Front / Grill */}
                <rect x="10" y="120" width="40" height="30" fill="#333" />
                <line x1="15" y1="125" x2="45" y2="125" stroke="#666" strokeWidth="2" />
                <line x1="15" y1="130" x2="45" y2="130" stroke="#666" strokeWidth="2" />
                <line x1="15" y1="135" x2="45" y2="135" stroke="#666" strokeWidth="2" />

                {/* Wheels / Bogies (Complex/Mechanical) - Stop when stopped */}
                <motion.g
                    animate={stopped ? { rotate: 0 } : { rotate: 360 }}
                    transition={stopped ? { duration: 0.5 } : { repeat: Infinity, duration: 0.8, ease: "linear" }}
                    style={{ transformOrigin: "150px 160px" }}
                >
                    <circle cx="150" cy="160" r="22" fill="#222" stroke="#555" strokeWidth="4" />
                    <circle cx="150" cy="160" r="8" fill="#888" />
                    <rect x="148" y="138" width="4" height="44" fill="#666" />
                    <rect x="128" y="158" width="44" height="4" fill="#666" />
                </motion.g>

                <motion.g
                    animate={stopped ? { rotate: 0 } : { rotate: 360 }}
                    transition={stopped ? { duration: 0.5 } : { repeat: Infinity, duration: 0.8, ease: "linear" }}
                    style={{ transformOrigin: "450px 160px" }}
                >
                    <circle cx="450" cy="160" r="22" fill="#222" stroke="#555" strokeWidth="4" />
                    <circle cx="450" cy="160" r="8" fill="#888" />
                    <rect x="448" y="138" width="4" height="44" fill="#666" />
                    <rect x="428" y="158" width="44" height="4" fill="#666" />
                </motion.g>

                {/* Connector Rod (Steam/Diesel style animation hint) */}
                <motion.rect
                    x="150" y="155" width="300" height="10" fill="#444"
                    animate={stopped ? { x: 0 } : { x: [0, 5, 0] }}
                    transition={stopped ? { duration: 0.5 } : { duration: 0.8, repeat: Infinity }}
                />

                {/* Pakistan Railway Logo Hint */}
                <circle cx="550" cy="100" r="25" fill="#115E34" stroke="#FFD700" strokeWidth="2" />
                <text x="538" y="108" fontFamily="serif" fontWeight="bold" fontSize="24" fill="#FFF">PK</text>

                {/* Fleet Number */}
                <text x="50" y="75" fontFamily="serif" fontWeight="bold" fontSize="12" fill="#FFD700">ICE-110</text>
            </svg>
        </motion.div>
    );
}
