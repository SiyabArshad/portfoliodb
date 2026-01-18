import { motion } from 'framer-motion';

export default function Train({ stopped = false }) {
    return (
        <motion.div
            className="relative z-20 w-[600px] h-[180px] select-none"
            initial={{ x: 0 }} // Start in position
            animate={{ x: 0 }} // No bounce
        >
            {/* Train SVG below... */}
            <svg viewBox="0 0 600 180" className="w-full h-full drop-shadow-2xl">
                {/* ICE Train Body - Sleek White/Red */}
                <path d="M 50,50 L 550,50 C 580,50 600,70 600,100 L 600,160 L 0,160 L 0,100 C 0,70 20,50 50,50 Z" fill="#FFFFFF" stroke="#282D37" strokeWidth="3" />

                {/* DB Red Stripe */}
                <rect x="0" y="90" width="600" height="20" fill="#EC1B2D" />

                {/* Windows */}
                <rect x="450" y="60" width="100" height="60" rx="5" fill="#87CEEB" stroke="#282D37" strokeWidth="2" />
                <rect x="320" y="60" width="100" height="60" rx="5" fill="#87CEEB" stroke="#282D37" strokeWidth="2" />
                <rect x="190" y="60" width="100" height="60" rx="5" fill="#87CEEB" stroke="#282D37" strokeWidth="2" />
                <rect x="60" y="60" width="100" height="60" rx="5" fill="#87CEEB" stroke="#282D37" strokeWidth="2" />

                {/* DB Logo */}
                <circle cx="550" cy="75" r="20" fill="#EC1B2D" />
                <text x="540" y="82" fontFamily="Arial" fontWeight="bold" fontSize="20" fill="#FFF">DB</text>

                {/* Fleet Number */}
                <text x="50" y="85" fontFamily="monospace" fontWeight="bold" fontSize="12" fill="#282D37">ICE 110</text>

                {/* Front nose */}
                <path d="M 120,55 L 180,55 L 180,95 L 80,95 C 80,95 85,60 120,55 Z" fill="#282D37" />

                <motion.g
                    animate={stopped ? { rotate: 0 } : { rotate: 360 }}
                    transition={stopped ? { duration: 0.5 } : { repeat: Infinity, duration: 1, ease: "linear" }}
                    style={{ transformOrigin: "150px 160px" }}
                >
                    <circle cx="150" cy="160" r="18" fill="#333" />
                    <circle cx="150" cy="160" r="10" fill="#666" />
                    <rect x="148" y="142" width="4" height="36" fill="#444" />
                    <rect x="132" y="158" width="36" height="4" fill="#444" />
                </motion.g>

                <motion.g
                    animate={stopped ? { rotate: 0 } : { rotate: 360 }}
                    transition={stopped ? { duration: 0.5 } : { repeat: Infinity, duration: 1, ease: "linear" }}
                    style={{ transformOrigin: "450px 160px" }}
                >
                    <circle cx="450" cy="160" r="18" fill="#333" />
                    <circle cx="450" cy="160" r="10" fill="#666" />
                    <rect x="448" y="142" width="4" height="36" fill="#444" />
                    <rect x="432" y="158" width="36" height="4" fill="#444" />
                </motion.g>

                {/* Shadow/Glow */}
                <defs>
                    <filter id="lighting" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="2" dy="2" stdDeviation="2" floodColor="#000" floodOpacity="0.3" />
                    </filter>
                </defs>
            </svg>
        </motion.div>
    );
}
