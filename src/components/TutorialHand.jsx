import { motion } from 'framer-motion';
import { Hand } from 'lucide-react';

export default function TutorialHand({ text, direction = 'up', onClick }) {
    const clickAnimation = {
        scale: [1, 0.9, 1],
        y: [0, 5, 0],
        transition: {
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut"
        }
    };

    return (
        <motion.div
            className="absolute z-[200] flex flex-col items-center cursor-pointer pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={onClick}
            style={{
                // Positioning defaults handled by parent, but we add offsets
                ...(direction === 'up' && { bottom: '100%', marginBottom: '10px' }),
                ...(direction === 'down' && { top: '100%', marginTop: '10px' }),
                ...(direction === 'left' && { right: '100%', marginRight: '20px' }),
                ...(direction === 'right' && { left: '100%', marginLeft: '20px' }),
            }}
        >
            {/* Tooltip Text */}
            <div className="bg-black/80 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-xl mb-2 whitespace-nowrap border border-white/20 uppercase tracking-wide">
                {text}
            </div>

            {/* Hand Icon - Simulating Press */}
            <motion.div
                animate={clickAnimation}
                className="relative"
            >
                {/* Touch/Click Ripple Effect */}
                <motion.div
                    animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="absolute inset-0 bg-white/50 rounded-full blur-sm"
                ></motion.div>

                <div className="bg-white p-3 rounded-full shadow-[0_0_15px_rgba(0,0,0,0.3)] border-2 border-db-red relative z-10">
                    <Hand className="text-db-red w-6 h-6 rotate-[-15deg]" fill="currentColor" />
                </div>
            </motion.div>
        </motion.div>
    );
}
