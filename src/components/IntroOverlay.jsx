import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export default function IntroOverlay({ onStart, onDemoStart, language, setLanguage }) {
    const t = {
        en: {
            journey: "The Engineering Journey",
            start: "DEPART / START",
            tour: "▶ Start Guided Journey",
            platform: "PLATFORM",
            mode: "MODE",
            service: "SERVICE",
            exclusive: "ICE 592 Exclusive",
            interactive: "Interactive Journey"
        },
        de: {
            journey: "Die Reise des Ingenieurs",
            start: "ABFAHRT / START",
            tour: "▶ Geführte Tour starten",
            platform: "GLEIS",
            mode: "MODUS",
            service: "SERVICE",
            exclusive: "ICE 592 Exklusiv",
            interactive: "Interaktive Reise"
        }
    };

    const content = t[language];

    return (
        <motion.div
            className="fixed inset-0 z-[100] bg-db-deep-blue flex items-center justify-center p-4 bg-opacity-95 backdrop-blur-md"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: "none" }}
            transition={{ duration: 1 }}
        >
            {/* Small Top-Right Language Switcher */}
            <div className="absolute top-8 right-8 z-[110]">
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-1 rounded-full flex items-center relative gap-0 overflow-hidden shadow-2xl">
                    <motion.div
                        className="absolute bg-db-red rounded-full z-0"
                        initial={false}
                        animate={{
                            x: language === 'en' ? 0 : 50,
                            width: 50,
                            height: 32
                        }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />

                    <button
                        onClick={() => setLanguage('en')}
                        className={`relative z-10 w-[50px] h-[32px] flex items-center justify-center font-mono text-[10px] font-black transition-colors duration-300 ${language === 'en' ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
                    >
                        EN
                    </button>
                    <button
                        onClick={() => setLanguage('de')}
                        className={`relative z-10 w-[50px] h-[32px] flex items-center justify-center font-mono text-[10px] font-black transition-colors duration-300 ${language === 'de' ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
                    >
                        DE
                    </button>
                </div>
            </div>

            <div className="max-w-2xl w-full text-center space-y-12">
                <motion.div
                    key={language}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-db-red to-white tracking-tighter">
                        SIYAB ARSHAD
                    </h1>
                    <p className="text-2xl text-white/40 mt-4 tracking-[0.3em] uppercase font-mono">{content.journey}</p>
                </motion.div>

                <motion.div
                    className="flex flex-col items-center space-y-6 pt-4"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <button
                        onClick={() => onStart(5)}
                        className="group relative px-12 py-6 bg-db-red text-white font-bold text-3xl rounded-full overflow-hidden shadow-[0_0_50px_rgba(236,27,45,0.5)] hover:shadow-[0_0_80px_rgba(236,27,45,0.7)] transition-all duration-300 transform hover:scale-105 active:scale-95"
                    >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
                        <span className="flex items-center space-x-4">
                            <Play className="fill-current w-8 h-8" />
                            <span>{content.start}</span>
                        </span>
                    </button>

                    <button
                        onClick={() => onDemoStart && onDemoStart()}
                        className="text-white/50 hover:text-white text-sm font-mono tracking-widest uppercase border-b border-white/20 hover:border-white transition-all pb-1 hover:scale-105"
                    >
                        {content.tour}
                    </button>
                </motion.div>

                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-500 font-mono border-t border-white/10 pt-10"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex flex-col items-center">
                        <span className="block mb-2 text-db-red font-bold">{content.platform}</span>
                        <span className="text-white/80">01 - PK</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="block mb-2 text-db-red font-bold">{content.mode}</span>
                        <span className="text-white/80">{content.interactive}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="block mb-2 text-db-red font-bold">{content.service}</span>
                        <span className="text-white/80">{content.exclusive}</span>
                    </div>
                </motion.div>

            </div>
        </motion.div>
    );
}
