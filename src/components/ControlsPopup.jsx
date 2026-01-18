import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Keyboard, Mouse } from 'lucide-react';

export default function ControlsPopup({ language, onDismiss }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Auto-dismiss after 8 seconds
        const timer = setTimeout(() => {
            handleDismiss();
        }, 8000);

        return () => clearTimeout(timer);
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        setTimeout(() => {
            if (onDismiss) onDismiss();
        }, 500);
    };

    const t = {
        en: {
            title: "Game Controls",
            subtitle: "Master Your Journey",
            scroll: "Scroll",
            scrollDesc: "Move the train forward/backward",
            arrows: "Arrow Keys",
            arrowsDesc: "Navigate through your journey",
            horn: "H Key",
            hornDesc: "Sound the horn",
            restart: "R Key",
            restartDesc: "Restart the journey",
            click: "Click Stations",
            clickDesc: "View detailed information",
            dismiss: "Got it! Let's go",
            tip: "Tip: Scroll slowly to enjoy the journey!"
        },
        de: {
            title: "Spielsteuerung",
            subtitle: "Meistern Sie Ihre Reise",
            scroll: "Scrollen",
            scrollDesc: "Zug vorwärts/rückwärts bewegen",
            arrows: "Pfeiltasten",
            arrowsDesc: "Durch Ihre Reise navigieren",
            horn: "H-Taste",
            hornDesc: "Hupe betätigen",
            restart: "R-Taste",
            restartDesc: "Reise neu starten",
            click: "Stationen anklicken",
            clickDesc: "Detaillierte Informationen anzeigen",
            dismiss: "Verstanden! Los geht's",
            tip: "Tipp: Scrollen Sie langsam, um die Reise zu genießen!"
        }
    };

    const content = t[language || 'en'];

    const controls = [
        {
            icon: <Mouse size={32} className="text-db-red" />,
            title: content.scroll,
            description: content.scrollDesc,
            demo: (
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="flex flex-col items-center"
                >
                    <ArrowDown size={20} className="text-db-red" />
                    <ArrowUp size={20} className="text-db-red mt-1" />
                </motion.div>
            )
        },
        {
            icon: <Keyboard size={32} className="text-blue-400" />,
            title: content.arrows,
            description: content.arrowsDesc,
            demo: (
                <div className="flex space-x-1">
                    <motion.div
                        animate={{ x: [-5, 5, -5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="bg-white/10 px-2 py-1 rounded text-xs font-mono"
                    >
                        ←→
                    </motion.div>
                </div>
            )
        },
        {
            icon: <span className="text-3xl">📯</span>,
            title: content.horn,
            description: content.hornDesc,
            demo: (
                <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="bg-yellow-500/20 px-3 py-1 rounded text-sm font-mono font-bold"
                >
                    H
                </motion.div>
            )
        },
        {
            icon: <span className="text-3xl">🔄</span>,
            title: content.restart,
            description: content.restartDesc,
            demo: (
                <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                    className="bg-blue-500/20 px-3 py-1 rounded text-sm font-mono font-bold"
                >
                    R
                </motion.div>
            )
        },
        {
            icon: <span className="text-3xl">👆</span>,
            title: content.click,
            description: content.clickDesc,
            demo: (
                <motion.div
                    animate={{ scale: [1, 0.9, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="bg-db-red/20 px-3 py-1 rounded text-xs font-mono"
                >
                    CLICK
                </motion.div>
            )
        }
    ];

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-md z-[10000] flex items-center justify-center p-4"
                    onClick={handleDismiss}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, y: 50 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.8, opacity: 0, y: 50 }}
                        transition={{ type: "spring", damping: 20, stiffness: 300 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gradient-to-br from-gray-900 to-black border-4 border-db-red rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden"
                        style={{
                            boxShadow: '0 0 80px rgba(236, 27, 45, 0.5)'
                        }}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-db-red to-red-800 p-8 text-center relative overflow-hidden">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 opacity-10"
                            >
                                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent" />
                            </motion.div>
                            <motion.h2
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-5xl font-black text-white tracking-tight mb-2 relative z-10"
                            >
                                {content.title}
                            </motion.h2>
                            <motion.p
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-white/90 text-lg font-mono relative z-10"
                            >
                                {content.subtitle}
                            </motion.p>
                        </div>

                        {/* Controls Grid */}
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                {controls.map((control, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + index * 0.1 }}
                                        className="bg-white/5 backdrop-blur-sm border-2 border-white/10 rounded-xl p-5 hover:border-db-red/50 transition-all group"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className="bg-black/30 p-3 rounded-lg group-hover:scale-110 transition-transform">
                                                    {control.icon}
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-bold text-lg mb-1">
                                                        {control.title}
                                                    </h3>
                                                    <p className="text-gray-400 text-sm">
                                                        {control.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                {control.demo}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Tip */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2 }}
                                className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 rounded-xl p-4 mb-6"
                            >
                                <div className="flex items-center space-x-3">
                                    <motion.span
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{ repeat: Infinity, duration: 2 }}
                                        className="text-2xl"
                                    >
                                        💡
                                    </motion.span>
                                    <p className="text-yellow-200 font-medium">
                                        {content.tip}
                                    </p>
                                </div>
                            </motion.div>

                            {/* Dismiss Button */}
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.4 }}
                                onClick={handleDismiss}
                                className="w-full bg-gradient-to-r from-db-red to-red-700 hover:from-red-700 hover:to-db-red text-white font-bold py-4 px-8 rounded-xl transition-all text-xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] active:scale-95"
                            >
                                ✓ {content.dismiss}
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
