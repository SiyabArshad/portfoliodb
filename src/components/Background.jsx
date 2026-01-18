import { motion, useTransform, useMotionValueEvent } from 'framer-motion';
import { useState } from 'react';

export default function Background({ scrollX, length }) {
    // Safety check for length to avoid NaNs
    const validLength = Number.isFinite(length) && length > 0 ? length : 10000;

    // Parallax layers
    // Background transition point (somewhere around 65% of the journey)
    const transitionPoint = -validLength * 0.65;

    // Transform scroll progress to opacity for cross-fading backgrounds
    // FIX: Input ranges must be ascending [-14000, -10000]
    // Zone A: Pakistan (Start to 60%) -> Fades OUT as we go left (more negative)
    const opacityZoneA = useTransform(scrollX, [-validLength * 0.7, -validLength * 0.5], [0, 1]);

    // Zone B: Germany (50% to End) -> Fades IN as we go left (more negative)
    const opacityZoneB = useTransform(scrollX, [-validLength * 0.7, -validLength * 0.5], [1, 0]);

    const xSky = useTransform(scrollX, [0, -validLength], [0, -validLength * 0.1]);
    const xMountains = useTransform(scrollX, [0, -validLength], [0, -validLength * 0.2]);
    const xCity = useTransform(scrollX, [0, -validLength], [0, -validLength * 0.5]);
    const xClouds = useTransform(scrollX, [0, -validLength], [0, -validLength * 0.8]);

    return (
        <div className="fixed inset-0 w-full h-full -z-10 overflow-hidden bg-db-warm-sand">

            {/* --- ZONE A: PAKISTAN (Warm/Sunset) --- */}
            <motion.div style={{ opacity: opacityZoneA }} className="absolute inset-0 w-full h-full bg-gradient-to-b from-orange-200 via-amber-100 to-db-warm-sand">
                {/* Sun */}
                <div className="absolute top-20 right-[20%] w-32 h-32 bg-orange-400 rounded-full blur-2xl opacity-60" />

                {/* Taxila/Margalla Hills Silhouette */}
                <motion.div className="absolute bottom-32 left-0 flex space-x-0 opacity-40 text-stone-700 fill-current" style={{ x: xMountains }}>
                    {Array.from({ length: 40 }).map((_, i) => (
                        <svg key={`mtn-${i}`} width="500" height="250" viewBox="0 0 500 250" className="-ml-48">
                            <path d={`M0,250 L${100 + Math.random() * 300},${50 + Math.random() * 50} L500,250 Z`} />
                        </svg>
                    ))}
                </motion.div>

                {/* Minarets/Architecture hints */}
                <motion.div className="absolute bottom-32 left-[800px] flex space-x-96 opacity-30 text-stone-800 fill-current" style={{ x: xCity }}>
                    <div className="w-12 h-48 bg-stone-800 rounded-t-full mx-10"></div>
                    <div className="w-24 h-32 bg-stone-800 rounded-t-full mx-12"></div>
                </motion.div>
            </motion.div>


            {/* --- ZONE B: GERMANY (Cool/Night/Rain) --- */}
            <motion.div style={{ opacity: opacityZoneB }} className="absolute inset-0 w-full h-full bg-gradient-to-b from-slate-900 via-slate-800 to-db-deep-blue">
                {/* Moon */}
                <div className="absolute top-10 right-[10%] w-24 h-24 bg-sky-100 rounded-full blur-xl opacity-20" />

                {/* Berlin Skyline / Modern City */}
                <motion.div className="absolute bottom-32 left-[100vw] flex items-end opacity-60 text-indigo-950 fill-current invisible" style={{ x: xCity, visibility: 'visible' }}>
                    {Array.from({ length: 30 }).map((_, i) => (
                        <div key={`city-${i}`} className="bg-indigo-950 mx-1" style={{ width: 30 + Math.random() * 40, height: 100 + Math.random() * 300 }}></div>
                    ))}
                    {/* TV Tower Hint */}
                    <div className="w-4 h-[500px] bg-indigo-950 ml-10 relative">
                        <div className="absolute top-10 -left-6 w-16 h-16 bg-indigo-950 rounded-full"></div>
                    </div>
                </motion.div>
            </motion.div>


            {/* --- GLOBAL ELEMENTS --- */}
            {/* Clouds (Shared but styled differently via blending modes or just white) */}
            <motion.div
                className="absolute top-10 left-0 flex space-x-[800px]"
                style={{ x: xClouds }}
            >
                {Array.from({ length: 15 }).map((_, i) => (
                    <div key={`cloud-${i}`} className="w-64 h-20 bg-white rounded-full opacity-10 blur-xl"></div>
                ))}
            </motion.div>

        </div>
    );
}
