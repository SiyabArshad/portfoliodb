import { motion, useMotionValueEvent } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function HUD({ progress, speed, stationName, variant, stopped, language }) {
    const [displaySpeed, setDisplaySpeed] = useState(0);

    const t = {
        en: {
            origin: "ORIGIN POINT",
            next: "NEXT ARRIVAL",
            overrides: "System Overrides",
            move: "MOVE CONTROL",
            brake: "BRAKE/PAUSE",
            signal: "SIGNAL HORN",
            arrows: "Arrows",
            space: "Space",
            hkey: "H Key",
            velocity: "Telemetry: Velocity",
            distance: "Telemetry: Distance",
            remaining: "% REMAINING",
            state: "Operational State",
            stationary: "🛑 STATIONARY",
            mainline: "🟢 MAINLINE_CLEAR",
            mode: "Control Mode",
            engineer: "Software Engineer"
        },
        de: {
            origin: "AUSGANGSPUNKT",
            next: "NÄCHSTE ANKUNFT",
            overrides: "Systembefehle",
            move: "BEWEGUNG",
            brake: "BREMSE/PAUSE",
            signal: "SIGNALHORN",
            arrows: "Pfeiltasten",
            space: "Leertaste",
            hkey: "H-Taste",
            velocity: "Telemetrie: Geschwindigkeit",
            distance: "Telemetrie: Entfernung",
            remaining: "% VERBLEIBEND",
            state: "Betriebszustand",
            stationary: "🛑 STILLSTAND",
            mainline: "🟢 STRECKE_FREI",
            mode: "Steuermodus",
            engineer: "Softwareentwickler"
        }
    };

    const content = t[language || 'en'];

    useMotionValueEvent(speed, "change", (latest) => {
        if (!stopped) {
            setDisplaySpeed(Math.abs(latest) * 100);
        }
    });

    useEffect(() => {
        if (stopped) {
            setDisplaySpeed(0);
        }
    }, [stopped]);

    return (
        <div className="fixed inset-0 w-full h-full z-40 pointer-events-none font-sans flex flex-col justify-between">

            {/* Top Section: Master Console & Control Groups */}
            <div className="flex justify-between items-start w-full p-8">

                {/* Left Console Group: Unified Information Stack */}
                <div className="flex flex-col space-y-4">

                    {/* Personnel Identity Badge */}
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-db-red to-red-900 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                        <div className="relative bg-black/95 border border-white/10 p-6 rounded-xl shadow-2xl min-w-[340px] backdrop-blur-3xl overflow-hidden">
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-20"></div>

                            <div className="flex items-start justify-between relative z-10">
                                <div>
                                    <h1 className="text-3xl font-black text-white tracking-tighter leading-none uppercase">Siyab Arshad</h1>
                                    <p className="text-[10px] font-black uppercase text-db-red mt-2 tracking-[0.3em] flex items-center">
                                        <span className="w-4 h-[1px] bg-db-red mr-2"></span>
                                        {content.engineer}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-mono text-white/40 uppercase">Fleet ID</p>
                                    <p className="text-xs font-mono text-white/80 font-bold tracking-tighter uppercase">ICE 110</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Destination Hub - Below Identity */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="relative bg-black/90 border border-white/10 p-5 rounded-xl shadow-2xl min-w-[340px] backdrop-blur-3xl overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-db-red"></div>
                        <span className="text-[9px] uppercase tracking-[0.4em] text-white/40 block mb-2 font-black">
                            {progress < 0.05 ? content.origin : content.next}
                        </span>
                        <div className="flex items-center space-x-4">
                            <div className="w-2 h-2 rounded-full bg-db-red animate-ping"></div>
                            <span className="text-xl font-black text-white font-mono tracking-tighter uppercase leading-none truncate max-w-[260px]">
                                {stationName}
                            </span>
                        </div>
                    </motion.div>
                </div>

                {/* Right Console Group: Systems & Overrides */}
                <div className="bg-black/95 border border-white/10 p-5 rounded-xl backdrop-blur-md shadow-2xl pointer-events-auto">
                    <span className="text-[10px] font-black text-db-red uppercase tracking-widest block mb-3 opacity-60">{content.overrides}</span>
                    <div className="space-y-1.5 font-mono text-[10px] text-gray-300 min-w-[160px]">
                        <p className="flex justify-between items-center"><span className="opacity-50 text-[9px]">{content.move}</span> <span className="text-white bg-white/5 border border-white/10 px-1.5 py-0.5 rounded uppercase">{content.arrows}</span></p>
                        <p className="flex justify-between items-center"><span className="opacity-50 text-[9px]">{content.brake}</span> <span className="text-white bg-white/5 border border-white/10 px-1.5 py-0.5 rounded uppercase">{content.space}</span></p>
                        <p className="flex justify-between items-center"><span className="opacity-50 text-[9px]">{content.signal}</span> <span className="text-white bg-white/5 border border-white/10 px-1.5 py-0.5 rounded uppercase">{content.hkey}</span></p>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Real-time Telemetry & Journey Path */}
            <div className="w-full relative z-40 bg-black/90 border-t border-white/10">
                {/* Visual Rail Progress */}
                <div className="h-1.5 w-full bg-gray-900 relative">
                    <motion.div
                        className="h-full bg-db-red shadow-[0_0_20px_rgba(236,27,45,0.8)]"
                        style={{ width: `${progress * 100}%` }}
                    />
                </div>

                {/* Telemetry Dashboard */}
                <div className="flex justify-between items-center px-10 py-6">
                    <div className="flex space-x-12">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-1">{content.velocity}</span>
                            <span className="text-2xl font-black text-white font-mono leading-none tracking-tighter">
                                {displaySpeed.toFixed(0)} <span className="text-[10px] text-white/40 font-normal ml-1 tracking-normal">KM/H</span>
                            </span>
                        </div>
                        <div className="flex flex-col border-l border-white/10 pl-12">
                            <span className="text-[9px] font-mono text-white/30 uppercase tracking-widest mb-1">{content.distance}</span>
                            <span className="text-2xl font-black text-white font-mono leading-none tracking-tighter">
                                {Math.max(0, (100 - progress * 100)).toFixed(1)} <span className="text-[10px] text-white/40 font-normal ml-1 tracking-normal">{content.remaining}</span>
                            </span>
                        </div>
                    </div>

                    {/* Industrial Status Indicator */}
                    <div className="flex items-center space-x-6">
                        <div className="flex flex-col items-end">
                            <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.3em] mb-1">{content.state}</span>
                            <div className={`px-5 py-2 rounded-sm text-[10px] font-black tracking-[0.2em] transition-all duration-700 border ${displaySpeed < 5 ? 'bg-db-red/10 border-db-red/30 text-db-red' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}>
                                {displaySpeed < 5 ? content.stationary : content.mainline}
                            </div>
                        </div>
                        <div className="h-10 w-[1px] bg-white/10 mx-2"></div>
                        <div className="flex flex-col items-end">
                            <span className="text-[8px] font-mono text-white/20 uppercase tracking-[0.3em] mb-1">{content.mode}</span>
                            <span className="text-[10px] font-black text-white/60 tracking-widest uppercase">Autonomous_V.110</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
