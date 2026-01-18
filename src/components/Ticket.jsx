import { Github, Linkedin, FileText, Mail, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Ticket({ isVisible }) {
    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 pointer-events-auto">
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="bg-db-dark-grey border-l-4 border-db-red shadow-2xl rounded-r-xl w-[400px] relative text-white font-sans overflow-hidden"
            >
                {/* Header */}
                <div className="bg-black/40 p-6 border-b border-white/10 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Fahrkarte</h2>
                        <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">Journey Complete</span>
                    </div>
                    <div className="text-right">
                        <span className="block text-db-red font-mono font-bold text-lg">ICE 110</span>
                        <span className="block text-[9px] text-gray-500 uppercase">First Class</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4 text-gray-300 hover:text-white transition-colors cursor-pointer group p-2 hover:bg-white/5 rounded-lg" onClick={() => window.open('https://github.com/SiyabArshad', '_blank')}>
                            <div className="p-2 bg-gray-800 rounded-full group-hover:bg-db-red transition-colors">
                                <Github size={20} />
                            </div>
                            <div>
                                <span className="block text-sm font-bold text-white">GitHub</span>
                                <span className="block text-[10px] text-gray-500">View Source Code</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 text-gray-300 hover:text-white transition-colors cursor-pointer group p-2 hover:bg-white/5 rounded-lg" onClick={() => window.open('https://www.linkedin.com/in/siyab-arshad/', '_blank')}>
                            <div className="p-2 bg-gray-800 rounded-full group-hover:bg-blue-600 transition-colors">
                                <Linkedin size={20} />
                            </div>
                            <div>
                                <span className="block text-sm font-bold text-white">LinkedIn</span>
                                <span className="block text-[10px] text-gray-500">Connect Professionally</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 text-gray-300 hover:text-white transition-colors cursor-pointer group p-2 hover:bg-white/5 rounded-lg" onClick={() => window.open('https://wa.me/923175841165', '_blank')}>
                            <div className="p-2 bg-gray-800 rounded-full group-hover:bg-green-500 transition-colors">
                                <MessageCircle size={20} />
                            </div>
                            <div>
                                <span className="block text-sm font-bold text-white">WhatsApp</span>
                                <span className="block text-[10px] text-gray-500">Direct Message</span>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4 text-gray-300 hover:text-white transition-colors cursor-pointer group p-2 hover:bg-white/5 rounded-lg" onClick={() => window.location.href = 'mailto:siyabarshadsatti@gmail.com'}>
                            <div className="p-2 bg-gray-800 rounded-full group-hover:bg-emerald-600 transition-colors">
                                <Mail size={20} />
                            </div>
                            <div>
                                <span className="block text-sm font-bold text-white">Email</span>
                                <span className="block text-[10px] text-gray-500">Send Inquiry</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-dashed border-gray-700">
                        <button
                            onClick={() => window.open('/resume.pdf', '_blank')}
                            className="w-full bg-white hover:bg-gray-200 text-db-dark-grey font-black py-4 px-6 rounded-lg text-xs uppercase tracking-[0.2em] flex items-center justify-center space-x-3 transition-transform active:scale-95 shadow-xl"
                        >
                            <FileText size={16} />
                            <span>Download Full Resume</span>
                        </button>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-1/2 -right-4 w-8 h-8 bg-black rounded-full"></div>
                <div className="absolute top-1/2 -left-4 w-8 h-8 bg-black rounded-full"></div>
            </motion.div>
        </div>
    );
}
