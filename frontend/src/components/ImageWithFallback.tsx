'use client';

import { useState, ImgHTMLAttributes, useEffect } from 'react';

interface ImageWithFallbackProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
    src?: string | null;
    fallbackSrc: string;
}

export default function ImageWithFallback({ src, fallbackSrc, alt, ...rest }: ImageWithFallbackProps) {
    const [imgSrc, setImgSrc] = useState<string | undefined>(src || undefined);

    useEffect(() => {
        setImgSrc(src || undefined);
    }, [src]);

    return (
        <img
            {...rest}
            src={imgSrc || fallbackSrc}
            alt={alt || 'Billede'}
            onError={() => {
                setImgSrc(fallbackSrc);
            }}
        />
    );
}
