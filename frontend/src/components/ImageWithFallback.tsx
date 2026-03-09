'use client';

import { useState, ImgHTMLAttributes, useEffect } from 'react';
import Image from 'next/image';

interface ImageWithFallbackProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'className'> {
    src?: string | null;
    fallbackSrc: string;
    alt: string;
    className?: string;
    sizes?: string;
}

export default function ImageWithFallback({ src, fallbackSrc, alt, className, sizes, ...rest }: ImageWithFallbackProps) {
    const [prevSrc, setPrevSrc] = useState(src);
    const [imgSrc, setImgSrc] = useState<string | undefined>(src || undefined);

    // Sync state with props directly in render but ONLY when the prop actually changes
    if (src !== prevSrc) {
        setPrevSrc(src);
        setImgSrc(src || undefined);
    }

    return (
        <Image
            {...(rest as any)}
            src={imgSrc || fallbackSrc}
            alt={alt || 'Billede'}
            className={className}
            fill
            sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
            onError={() => {
                setImgSrc(fallbackSrc);
            }}
        />
    );
}
