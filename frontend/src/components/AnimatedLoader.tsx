'use client';

import { useState, useEffect } from 'react';
import { Anchor, Waves, Sailboat, Compass } from 'lucide-react';
import { SunriseNoArrow } from './SunriseNoArrow';

const ELEMENTS = [
    Anchor,
    Waves,
    Sailboat,
    SunriseNoArrow,
    Compass
];

export default function AnimatedLoader({ className = "", text = "Henter..." }: { className?: string, text?: string }) {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % ELEMENTS.length);
        }, 1200); // Skifter ikon hver 1.2 sekund
        return () => clearInterval(interval);
    }, []);

    const CurrentIcon = ELEMENTS[activeIndex];

    return (
        <div className={`flex flex-col items-center justify-center gap-6 ${className}`}>
            <div className="flex items-center justify-center p-4 bg-primary/5 rounded-full border border-primary/20 shadow-inner">
                {/* Den indre beholder spinner langsomt og kontinuerligt */}
                <div className="flex flex-col items-center justify-center animate-spin" style={{ animationDuration: '4s' }}>
                    <CurrentIcon className="w-8 h-8 sm:w-10 sm:h-10 stroke-[1.5] text-primary" />
                </div>
            </div>

            {text && (
                <p className="text-sm font-bold uppercase tracking-widest text-primary/70 animate-pulse">
                    {text}
                </p>
            )}
        </div>
    );
}
