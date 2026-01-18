import { Star } from 'lucide-react';

export default function FiverrReviews({ reviews, language }) {
    const t = {
        title: language === 'de' ? 'Kundenbewertungen' : 'Client Reviews',
        subtitle: language === 'de' ? 'Von über 50 erfolgreichen Fiverr-Projekten' : 'From 50+ successful Fiverr projects'
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-6">
                <div className="bg-green-600 p-3 rounded-lg">
                    <Star size={24} className="text-white" fill="white" />
                </div>
                <div>
                    <h4 className="text-2xl font-bold text-white">{t.title}</h4>
                    <p className="text-white/70 text-sm">{t.subtitle}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {reviews.map((review, idx) => (
                    <div
                        key={idx}
                        className="bg-white/10 backdrop-blur-md border-2 border-green-400/30 rounded-xl p-6 hover:bg-white/15 transition-all"
                    >
                        <div className="flex items-start space-x-4">
                            <div className="bg-green-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                                {review.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <p className="font-bold text-white text-lg">{review.name}</p>
                                        <p className="text-green-200 text-sm">{review.role}</p>
                                    </div>
                                    <div className="flex space-x-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} className="text-yellow-400" fill="currentColor" />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-white/90 italic leading-relaxed mb-3">
                                    "{review.text}"
                                </p>
                                <div className="flex items-center space-x-2">
                                    <span className="bg-green-500/30 px-3 py-1 rounded-full text-xs text-green-100 font-semibold">
                                        {review.project}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
