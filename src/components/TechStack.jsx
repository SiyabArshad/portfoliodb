import { motion } from 'framer-motion';

export default function TechStack({ skills, language }) {
    const t = {
        languages: language === 'de' ? 'Sprachen' : 'Languages',
        frameworks: language === 'de' ? 'Frameworks' : 'Frameworks',
        cloud: language === 'de' ? 'Cloud' : 'Cloud',
        databases: language === 'de' ? 'Datenbanken' : 'Databases',
        other: language === 'de' ? 'Sonstiges' : 'Other'
    };

    return (
        <div className="grid grid-cols-2 gap-4 mt-6 w-full">
            {Object.entries(skills).map(([category, items], idx) => (
                <div key={category} className="bg-white/5 p-3 rounded border border-white/10">
                    <h4 className="text-xs font-bold text-db-red uppercase mb-2">{t[category] || category}</h4>
                    <div className="flex flex-wrap gap-2">
                        {items.map(skill => (
                            <span key={skill} className="text-xs bg-black/20 px-2 py-1 rounded text-gray-300">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
