import { motion } from 'framer-motion';
import { Linkedin, Star } from 'lucide-react';

export default function ReviewBoard({ reviews }) {
    // Sort or group can be done here, but simple mapping with distinct styles is enough for now
    return (
        <div className="flex space-x-6 overflow-x-auto pb-8 pt-4 w-[700px] no-scroll px-4">
            {reviews.map((review, i) => {
                const isLinkedIn = review.source === "LinkedIn";
                return (
                    <div
                        key={i}
                        className={`flex-shrink-0 w-80 p-6 rounded-xl border relative shadow-xl backdrop-blur-sm
                 ${isLinkedIn
                                ? 'bg-blue-900/40 border-blue-500/30 text-blue-50'
                                : 'bg-green-900/40 border-green-500/30 text-green-50'
                            }`}
                    >
                        {/* Quote Icon */}
                        <div className="absolute -top-3 -right-3 text-4xl opacity-20">❝</div>

                        {/* Source Badge */}
                        <div className="flex items-center space-x-2 mb-4 opacity-70">
                            {isLinkedIn ? <Linkedin size={16} /> : <Star size={16} fill="currentColor" />}
                            <span className="text-xs uppercase tracking-wider">{review.source}</span>
                        </div>

                        <p className="text-sm italic mb-6 leading-relaxed opacity-90">
                            "{review.text}"
                        </p>

                        <div className="border-t border-white/10 pt-4 flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg
                      ${isLinkedIn ? 'bg-blue-600' : 'bg-green-600'}`}>
                                {review.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-sm">{review.name}</p>
                                <p className="text-[10px] opacity-70 uppercase tracking-widest">{review.role}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
