'use client';

import { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import { supabase } from '@/lib/supabaseClient';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface ImageUploadProps {
    onUploadSuccess: (url: string) => void;
    currentImage?: string | null;
    label?: string;
    aspectRatio?: 'square' | 'video' | 'auto'; // Til CSS styling
}

export default function ImageUpload({ onUploadSuccess, currentImage, label = "Upload Billede", aspectRatio = 'auto' }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Tjek filtype
        if (!file.type.startsWith('image/')) {
            setError('Vælg venligst et gyldigt billede (JPG, PNG, WebP).');
            return;
        }

        setIsUploading(true);
        setError(null);

        // Visuel preview med det samme mod frontenden (rå fil)
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);

        try {
            // 1: Komprimering i browseren (Krymper filen og danner et hurtigt WebP billede)
            console.log(`Original størrelse: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
            const options = {
                maxSizeMB: 0.8, // Makismalt 800 KB
                maxWidthOrHeight: 1920, // Fuldt HD bredde er rigeligt til coverbilleder
                useWebWorker: true,
                fileType: 'image/webp', // Konverter til WebP for ultimativ performance
            };

            const compressedFile = await imageCompression(file, options);
            console.log(`Komprimeret størrelse: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);

            // 2: Generer et unikt filnavn så filer ikke overskriver hinanden
            const fileExt = 'webp';
            const fileName = `${uuidv4()}.${fileExt}`;
            const filePath = `${fileName}`;

            // 3: Upload til Supabase "sejler-billeder" bucket
            const { error: uploadError, data } = await supabase.storage
                .from('sejler-billeder')
                .upload(filePath, compressedFile, {
                    cacheControl: '3600',
                    upsert: false,
                    contentType: 'image/webp'
                });

            if (uploadError) {
                console.error("Supabase error:", uploadError);
                throw new Error("Kunne ikke uploade billedet til skyen. Har du husket at lægge dine URL/Keys i .env.local?");
            }

            // 4: Hent den offentlige URL
            const { data: publicUrlData } = supabase.storage
                .from('sejler-billeder')
                .getPublicUrl(filePath);

            const publicUrl = publicUrlData.publicUrl;

            // Opdater faderkomponenten (fx båd-oprettelsen eller dashboardet) med den nye weblink
            onUploadSuccess(publicUrl);
            setPreview(publicUrl);
            setIsUploading(false);

        } catch (err: unknown) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Der opstod en uventet fejl under upload.');
            setIsUploading(false);
            setPreview(currentImage || null); // Revert
        }
    };

    const triggerFileSelect = () => {
        if (!isUploading && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Definer CSS dimensioner ud fra prop (til f.eks Profilbillede vs. Togtbillede)
    let containerClass = "w-full border-2 border-dashed rounded-2xl flex flex-col items-center justify-center overflow-hidden transition-all group relative ";
    if (aspectRatio === 'square') containerClass += "aspect-square max-w-[200px] mx-auto rounded-full ";
    else if (aspectRatio === 'video') containerClass += "aspect-video ";
    else containerClass += "min-h-[160px] py-8 ";

    containerClass += isUploading ? "bg-muted/50 border-muted opacity-80 cursor-wait " :
        error ? "bg-destructive/5 border-destructive cursor-pointer hover:bg-destructive/10 " :
            "bg-muted/20 border-border/60 cursor-pointer hover:bg-muted/50 hover:border-primary/50 ";

    return (
        <div className="w-full">
            {label && <label className="block text-[11px] font-bold uppercase tracking-widest text-foreground/80 mb-2">{label}</label>}

            <div
                onClick={triggerFileSelect}
                className={containerClass}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg, image/png, image/webp"
                    className="hidden"
                />

                {/* VISNING: Baggrundsbillede, hvis valgt (og ikke under knoklende upload) */}
                {preview && !isUploading && (
                    <img
                        src={preview}
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 group-hover:blur-[2px] transition-all duration-300 z-0"
                    />
                )}

                {/* VISNING: Læse-ikoner undervejs */}
                <div className={`relative z-10 flex flex-col items-center justify-center p-4 text-center transition-opacity ${preview && !isUploading ? 'opacity-0 group-hover:opacity-100 bg-black/40 text-white rounded-lg backdrop-blur-sm' : ''}`}>
                    {isUploading ? (
                        <>
                            <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
                            <p className="text-sm font-bold text-foreground">Optimerer filen...</p>
                            <p className="text-xs text-muted-foreground mt-1">Dette sparer op til 90% plads</p>
                        </>
                    ) : error ? (
                        <>
                            <AlertCircle className="w-8 h-8 text-destructive mb-3" />
                            <p className="text-sm font-bold text-destructive px-2">{error}</p>
                            <p className="text-xs text-destructive/80 mt-2 hover:underline">Prøv igen</p>
                        </>
                    ) : preview ? (
                        <>
                            <UploadCloud className="w-8 h-8 mb-2" />
                            <p className="text-sm font-bold">Tryk for at udskifte</p>
                        </>
                    ) : (
                        <>
                            <UploadCloud className="w-8 h-8 text-muted-foreground mb-3 group-hover:text-primary transition-colors duration-300" />
                            <p className="text-sm font-bold text-foreground">Klik for at vælge billede</p>
                            <p className="text-xs text-muted-foreground mt-1 px-4 max-w-[250px]">Mobilbilleder krympes til ~300KB af systemet inden upload</p>
                        </>
                    )}
                </div>
            </div>

            {/* Success message uden for boksen ved færdiggørelse */}
            {preview && !isUploading && !error && (
                <div className="flex items-center gap-1.5 mt-3 text-xs font-semibold text-emerald-600 dark:text-emerald-500">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Billedet er klar og gemt i skyen.
                </div>
            )}
        </div>
    );
}
