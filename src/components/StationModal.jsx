import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, Building2 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import TutorialHand from './TutorialHand';

export default function StationModal({ station, onClose, children, isTutorialMode, language }) {
    const modalRef = useRef(null);

    // Prevent background scrolling when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Automated Guided Journey Sequence
    useEffect(() => {
        if (!isTutorialMode || !modalRef.current) return;

        let timeouts = [];

        // 1. Initial pause for Title Reading (1.5s)
        timeouts.push(setTimeout(() => {
            // 2. Slow Smooth Scroll Down to read content
            if (modalRef.current) {
                const scrollHeight = modalRef.current.scrollHeight;
                modalRef.current.scrollTo({
                    top: scrollHeight,
                    behavior: 'smooth'
                });
            }
        }, 1500));

        // 3. Pause at bottom (Reading Time - 5s)
        timeouts.push(setTimeout(() => {
            // 4. Scroll back up
            if (modalRef.current) {
                modalRef.current.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        }, 6500));

        // 5. Close after returning to top (1.5s)
        timeouts.push(setTimeout(() => {
            onClose();
        }, 8000));

        return () => timeouts.forEach(clearTimeout);
    }, [isTutorialMode, onClose]);

    const isDe = language === 'de';
    const title = isDe ? (station.title_de || station.title) : station.title;
    const subtitle = isDe ? (station.subtitle_de || station.subtitle) : station.subtitle;
    const institution = isDe ? (station.institution_de || station.institution) : station.institution;
    const description = isDe ? (station.description_de || station.description) : station.description;
    const highlights = isDe ? (station.highlights_de || station.highlights) : station.highlights;

    const t = {
        en: {
            highlights: "Key Highlights",
            close: "Close & Continue Journey"
        },
        de: {
            highlights: "Wichtige Highlights",
            close: "Schließen & Reise fortsetzen"
        }
    };

    const content = t[language || 'en'];

    if (!station) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9999] flex items-center justify-center p-8"
                onClick={() => onClose()}
            >
                <motion.div
                    ref={modalRef}
                    initial={{ scale: 0.9, opacity: 0, y: 100 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 100 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto border-4 border-db-red relative scroll-smooth"
                    style={{
                        boxShadow: '0 0 60px rgba(236, 27, 45, 0.3), inset 0 0 60px rgba(255, 255, 255, 0.05)'
                    }}
                >
                    {/* TUTORIAL HANDS - HIDDEN IN AUTO MODE AS REQUESTED */}

                    {/* Glassmorphism overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-3xl pointer-events-none"></div>

                    {/* Header - Now scrolls with content */}
                    <div className="bg-gradient-to-r from-db-red to-red-800 p-10 border-b-4 border-white/20 flex items-center justify-between relative overflow-hidden">
                        {/* Abstract background pattern for header */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                <path d="M0,50 L100,20 L100,100 L0,100 Z" fill="white" />
                            </svg>
                        </div>

                        <div className="flex items-center space-x-8 relative z-10">
                            <div className="bg-white/20 p-5 rounded-2xl backdrop-blur-md shadow-inner border border-white/30">
                                <MapPin size={56} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-6xl font-bold text-white font-mono tracking-tighter mb-2">{title}</h2>
                                <div className="flex items-center space-x-3 text-white/80">
                                    <Calendar size={20} />
                                    <span className="text-2xl font-mono tracking-wider">{station.year}</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative z-10">
                            <button
                                onClick={onClose}
                                className="bg-white/10 hover:bg-white/30 p-5 rounded-full transition-all hover:rotate-90 duration-300 border border-white/20 shadow-xl"
                            >
                                <X size={40} className="text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-10 relative z-10">
                        {/* Station Info */}
                        <div className="bg-white/5 backdrop-blur-sm border-2 border-white/10 rounded-2xl p-8 mb-8 shadow-lg">
                            <h3 className="text-4xl font-bold text-white mb-4">{subtitle}</h3>
                            <div className="flex items-center space-x-8 text-white/90 mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-db-red/30 p-2 rounded-lg">
                                        <Building2 size={24} />
                                    </div>
                                    <span className="font-semibold text-xl">{institution}</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="bg-db-red/30 p-2 rounded-lg">
                                        <Calendar size={24} />
                                    </div>
                                    <span className="text-xl">{station.year}</span>
                                </div>
                            </div>
                            <p className="text-white/95 text-xl leading-relaxed">
                                {description}
                            </p>
                        </div>

                        {/* Highlights */}
                        {highlights && highlights.length > 0 && (
                            <div className="mb-8">
                                <h4 className="text-3xl font-bold text-white mb-6 flex items-center space-x-3">
                                    <span className="bg-db-red w-2 h-8 rounded-full"></span>
                                    <span>{content.highlights}</span>
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                    {highlights.map((highlight, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="bg-gradient-to-r from-db-red/20 to-db-red/10 border-2 border-db-red/40 px-6 py-4 rounded-xl text-white font-semibold flex items-center space-x-3 backdrop-blur-sm hover:border-db-red transition-all"
                                        >
                                            <span className="text-db-red text-2xl">✓</span>
                                            <span className="text-lg">{highlight}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Additional Content (Reviews, Skills, etc) */}
                        {children && (Array.isArray(children) ? children.some(c => c) : children) && (
                            <div className="mt-10 bg-white/5 backdrop-blur-sm border-2 border-white/10 rounded-2xl p-8 border-t-db-red/30">
                                {children}
                            </div>
                        )}

                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="w-full bg-gradient-to-r from-db-red to-red-700 hover:from-red-700 hover:to-db-red text-white font-bold py-5 px-8 rounded-xl transition-all mt-10 text-xl shadow-lg hover:shadow-2xl transform hover:scale-[1.02] active:scale-95"
                        >
                            ✓ {content.close}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
