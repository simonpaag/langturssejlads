import { Anchor, Waves, Sailboat } from 'lucide-react';
import { SunriseNoArrow } from './SunriseNoArrow';

export default function AnimatedLoader({ className = "", text = "Henter..." }: { className?: string, text?: string }) {
    return (
        <div className={`flex flex-col items-center justify-center gap-6 ${className}`}>
            <div className="flex items-center justify-center gap-4 sm:gap-6">
                <div className="flex flex-col items-center justify-center group relative animate-bounce-wave" style={{ animationDelay: '0ms' }}>
                    <Anchor className="w-6 h-6 sm:w-8 sm:h-8 stroke-[1.5] text-primary" />
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-primary/30"></div>
                <div className="flex flex-col items-center justify-center group relative animate-bounce-wave" style={{ animationDelay: '150ms' }}>
                    <Waves className="w-6 h-6 sm:w-8 sm:h-8 stroke-[1.5] text-primary" />
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-primary/30"></div>
                <div className="flex flex-col items-center justify-center group relative animate-bounce-wave" style={{ animationDelay: '300ms' }}>
                    <Sailboat className="w-6 h-6 sm:w-8 sm:h-8 stroke-[1.5] text-primary" />
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-primary/30"></div>
                <div className="flex flex-col items-center justify-center group relative animate-bounce-wave" style={{ animationDelay: '450ms' }}>
                    <SunriseNoArrow className="w-6 h-6 sm:w-8 sm:h-8 stroke-[1.5] text-primary" />
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
