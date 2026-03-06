import { Anchor, Waves, Sailboat, Sunrise } from 'lucide-react';

export default function FifthElement({ className = "" }: { className?: string }) {
    return (
        <div className={`flex items-center justify-center gap-4 sm:gap-6 ${className}`}>
            <div className="flex flex-col items-center justify-center group relative">
                <Anchor className="w-5 h-5 sm:w-7 sm:h-7 stroke-[1.5] text-current opacity-70 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="w-1 h-1 rounded-full bg-current opacity-30"></div>
            <div className="flex flex-col items-center justify-center group relative">
                <Waves className="w-5 h-5 sm:w-7 sm:h-7 stroke-[1.5] text-current opacity-70 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="w-1 h-1 rounded-full bg-current opacity-30"></div>
            <div className="flex flex-col items-center justify-center group relative">
                <Sailboat className="w-5 h-5 sm:w-7 sm:h-7 stroke-[1.5] text-current opacity-70 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="w-1 h-1 rounded-full bg-current opacity-30"></div>
            <div className="flex flex-col items-center justify-center group relative">
                <Sunrise className="w-5 h-5 sm:w-7 sm:h-7 stroke-[1.5] text-current opacity-70 group-hover:opacity-100 transition-opacity" />
            </div>
        </div>
    );
}
