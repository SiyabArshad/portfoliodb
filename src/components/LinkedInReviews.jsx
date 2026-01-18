import { Linkedin } from 'lucide-react';

export default function LinkedInReviews({ reviews, language }) {
    const t = {
        title: language === 'de' ? 'Teamepfehlungen' : 'Team Recommendations',
        subtitle: language === 'de' ? 'Von Kollegen bei Nova Pakistan' : 'From colleagues at Nova Pakistan'
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-600 p-3 rounded-lg">
                    <Linkedin size={24} className="text-white" />
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
                        className="bg-white/10 backdrop-blur-md border-2 border-blue-400/30 rounded-xl p-6 hover:bg-white/15 transition-all"
                    >
                        <div className="flex items-start space-x-4">
                            <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                                {review.name.charAt(0)}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <p className="font-bold text-white text-lg">{review.name}</p>
                                        <p className="text-blue-200 text-sm">{review.role}</p>
                                    </div>
                                    <Linkedin size={20} className="text-blue-400" />
                                </div>
                                <p className="text-white/90 italic leading-relaxed">
                                    "{review.text}"
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
