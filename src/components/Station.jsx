import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import TutorialHand from './TutorialHand';

export default function Station({ station, xPos, onStationClick, isCurrentStop, stopTimer, announcement, isTutorialTarget, language }) {
    const isDe = language === 'de';

    const t = {
        en: {
            inspect: "Click to Inspect Details",
            halt: "STATION HALT",
            milestone: "Role / Education Milestone",
            tap: "TAP TO INSPECT",
            details: "DETAILS"
        },
        de: {
            inspect: "Klicken für Details",
            halt: "ANHALTEN",
            milestone: "Rolle / Bildungsmeilenstein",
            tap: "ZUM ÖFFNEN TIPPEN",
            details: "DETAILS"
        }
    };

    const content = t[language || 'en'];

    // Choose localized data or fallback
    const title = isDe ? (station.title_de || station.title) : station.title;
    const subtitle = isDe ? (station.subtitle_de || station.subtitle) : station.subtitle;
    const institution = isDe ? (station.institution_de || station.institution) : station.institution;

    return (
        <motion.div
            className="absolute bottom-[350px] flex flex-col items-start"
            style={{ left: xPos }}
            initial={{ opacity: 1, y: 0 }}
        >
            {/* Station Sign - DB Style White/Black */}
            <div className="mb-4 bg-white border border-gray-300 shadow-xl px-4 py-2 relative flex items-center space-x-3 rounded-sm">
                <MapPin className="text-db-red" size={20} />
                <div>
                    <h2 className="text-xl font-black text-gray-900 font-mono uppercase tracking-tighter line-clamp-1">{title}</h2>
                    <p className="text-[10px] text-gray-500 font-mono tracking-[0.2em]">{station.year}</p>
                </div>
                {/* Connector Line to Post */}
                <div className="absolute -bottom-4 left-6 w-1 h-4 bg-gray-400"></div>
            </div>

            {/* Station Ticket Card */}
            <div
                onClick={() => onStationClick && onStationClick(station)}
                className="bg-db-dark-grey border-l-4 border-db-red p-0 rounded-r-xl shadow-2xl w-[450px] relative text-white font-sans overflow-hidden group hover:scale-[1.02] transition-transform duration-300 cursor-pointer pointer-events-auto"
            >
                {isTutorialTarget && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                        <TutorialHand text={content.inspect} direction="up" />
                    </div>
                )}

                {/* Compact Alert / Status Pill */}
                {isCurrentStop && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-3 right-3 bg-emerald-600 text-white px-3 py-1 text-[9px] font-black font-mono rounded shadow-lg z-20 flex items-center space-x-2 border border-white/20"
                    >
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                        <span className="uppercase tracking-wider">{announcement || content.halt}</span>
                    </motion.div>
                )}

                {/* Header Section */}
                <div className="bg-black/40 p-5 flex justify-between items-start border-b border-white/5">
                    <div className="pr-12"> {/* Padding right for Alert space */}
                        <h3 className="text-xl font-bold text-white tracking-tight">{subtitle}</h3>
                        <p className="text-white/60 text-xs mt-1 uppercase tracking-wider">{institution}</p>
                    </div>
                </div>

                {/* Body Content */}
                <div className="p-5">
                    <div className="flex items-center space-x-4">
                        <div className="flex-1">
                            <div className="h-1 w-full bg-gray-800 rounded-full mb-2 overflow-hidden">
                                <div className="h-full bg-gray-600 w-1/3"></div>
                            </div>
                            <p className="text-[10px] text-gray-500 font-mono uppercase">{content.milestone}</p>
                        </div>

                    </div>

                    {/* Footer Action */}
                    <div className="mt-6 flex items-center justify-between text-xs font-mono text-gray-400 border-t border-white/5 pt-3">
                        <span>{content.tap}</span>
                        <div className="flex items-center space-x-2 group-hover:text-white transition-colors">
                            <span>{content.details}</span>
                            <svg className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </div>
                    </div>
                </div>

                {/* Decorative Circles */}
                <div className="absolute top-1/2 -right-3 w-6 h-6 bg-black rounded-full"></div>
            </div>
        </motion.div>
    );
}
