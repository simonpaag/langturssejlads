'use client';

import { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import { supabase } from '@/lib/supabaseClient';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, X, Star } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface MultiImageUploadProps {
    onUploadSuccess: (urls: string[]) => void;
    currentImages?: string[];
    label?: string;
}

export default function MultiImageUpload({ onUploadSuccess, currentImages = [], label = "Upload Billeder" }: MultiImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [previews, setPreviews] = useState<string[]>(currentImages);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Vurder om der eksisterer ugyldige filer
        const invalidFile = files.find(file => !file.type.startsWith('image/'));
        if (invalidFile) {
            setError('Nogle filer er ikke billeder. Vælg kun JPG, PNG, WebP.');
            return;
        }

        setIsUploading(true);
        setError(null);

        // Opret previews for at vise de valgte filer imens (Midlertidigt kombineret med eksisterende fotos)
        const newLocalPreviews = files.map(f => URL.createObjectURL(f));
        setPreviews(prev => [...prev, ...newLocalPreviews]);

        try {
            const options = {
                maxSizeMB: 0.8,
                maxWidthOrHeight: 1920,
                useWebWorker: true,
                fileType: 'image/webp',
            };

            const uploadPromises = files.map(async (file) => {
                const compressedFile = await imageCompression(file, options);

                const fileExt = 'webp';
                const fileName = `${uuidv4()}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('sejler-billeder')
                    .upload(filePath, compressedFile, {
                        cacheControl: '3600',
                        upsert: false,
                        contentType: 'image/webp'
                    });

                if (uploadError) throw uploadError;

                const { data: publicUrlData } = supabase.storage
                    .from('sejler-billeder')
                    .getPublicUrl(filePath);

                return publicUrlData.publicUrl;
            });

            const newUploadedUrls = await Promise.all(uploadPromises);

            const updatedUrls = [...currentImages, ...newUploadedUrls];
            onUploadSuccess(updatedUrls);

            // Opdater previews fra lokale URLS til de rigtige Cloud-URLS
            setPreviews(updatedUrls);
        } catch (err: unknown) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Uventet fejl.');
            setPreviews(currentImages); // Revert
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeImage = (indexToRemove: number) => {
        const updatedPreviews = previews.filter((_, idx) => idx !== indexToRemove);
        setPreviews(updatedPreviews);
        onUploadSuccess(updatedPreviews); // Fjern også fra hoved-statet
    };

    const setAsCover = (indexToCover: number) => {
        if (indexToCover === 0) return; // Allerede cover
        const updatedPreviews = [...previews];
        const [coverImage] = updatedPreviews.splice(indexToCover, 1);
        updatedPreviews.unshift(coverImage);

        setPreviews(updatedPreviews);
        onUploadSuccess(updatedPreviews);
    };

    const triggerFileSelect = () => {
        if (!isUploading && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <div className="w-full">
            {label && <label className="block text-[11px] font-bold uppercase tracking-widest text-foreground/80 mb-2">{label}</label>}

            <div
                onClick={(e) => {
                    // Hvis man klikker indenfor boksen men ikke på et billede/fjern-knap
                    const target = e.target as HTMLElement;
                    if (!target.closest('.image-preview-item')) triggerFileSelect();
                }}
                className={`w-full min-h-[160px] border-2 border-dashed rounded-2xl p-4 transition-all relative
                    ${isUploading ? "bg-muted/50 border-muted opacity-80 cursor-wait" :
                        error ? "bg-destructive/5 border-destructive cursor-pointer hover:bg-destructive/10" :
                            "bg-muted/20 border-border/60 cursor-pointer hover:bg-muted/50 hover:border-primary/50"}`}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/jpeg, image/png, image/webp"
                    className="hidden"
                    multiple
                />

                {previews.length > 0 ? (
                    <div className="flex flex-wrap gap-4 items-center">
                        {previews.map((previewUrl, index) => (
                            <div key={index} className={`image-preview-item relative group w-24 h-24 rounded-xl overflow-hidden shadow-sm shrink-0 border-2 bg-white ${index === 0 ? 'border-amber-400' : 'border-border'}`}>
                                <img src={previewUrl} alt={`Preview ${index}`} className="w-full h-full object-cover" />

                                {index === 0 && (
                                    <div className="absolute bottom-0 left-0 right-0 bg-amber-400/90 text-amber-950 text-[9px] font-black uppercase text-center py-0.5 tracking-wider">
                                        Cover
                                    </div>
                                )}

                                {!isUploading && (
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                        <button
                                            type="button"
                                            title="Brug som forsidebillede for dette opslag"
                                            onClick={(e) => { e.stopPropagation(); setAsCover(index); }}
                                            className={`p-1.5 rounded-full transition-colors ${index === 0 ? 'bg-amber-400 text-amber-950' : 'bg-white/20 text-white hover:bg-amber-400 hover:text-amber-950 hover:scale-110'}`}
                                        >
                                            <Star className={`w-4 h-4 ${index === 0 ? 'fill-current' : ''}`} />
                                        </button>

                                        <button
                                            type="button"
                                            title="Slet billede"
                                            onClick={(e) => { e.stopPropagation(); removeImage(index); }}
                                            className="p-1 rounded-full bg-destructive/80 text-white hover:bg-destructive hover:scale-110 transition-all absolute top-1 right-1"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}

                        {!isUploading && (
                            <div onClick={triggerFileSelect} className="image-preview-item w-24 h-24 rounded-xl border-2 border-dashed border-border/60 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted hover:text-primary hover:border-primary/50 transition-colors shrink-0">
                                <UploadCloud className="w-6 h-6 mb-1" />
                                <span className="text-[10px] uppercase font-bold text-center px-1">Tilføj<br />flere</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-8 opacity-70">
                        <UploadCloud className="w-8 h-8 text-muted-foreground mb-3" />
                        <p className="text-sm font-bold text-foreground">Vælg et eller flere billeder</p>
                        <p className="text-xs text-muted-foreground mt-1 px-4 text-center max-w-[250px]">Mobilbilleder krympes til ~300KB af systemet inden upload</p>
                    </div>
                )}

                {isUploading && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center bg-black/40 text-white rounded-xl backdrop-blur-sm">
                        <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
                        <p className="text-sm font-bold">Klargør og uploader filer...</p>
                    </div>
                )}

                {error && !isUploading && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center bg-destructive/10 text-destructive rounded-xl backdrop-blur-sm px-4">
                        <AlertCircle className="w-8 h-8 mb-3" />
                        <p className="text-sm font-bold px-2">{error}</p>
                    </div>
                )}
            </div>

            {previews.length > 0 && !isUploading && !error && (
                <div className="flex items-center gap-1.5 mt-3 text-xs font-semibold text-emerald-600 dark:text-emerald-500">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Billedgalleri klar til tryk ({previews.length} valgt).
                </div>
            )}
        </div>
    );
}
