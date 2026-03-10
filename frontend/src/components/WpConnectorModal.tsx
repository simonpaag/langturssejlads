"use client";

import { X, ArrowRightLeft } from "lucide-react";
import WpConnectorForm from "./WpConnectorForm";
import { useEffect } from "react";

interface WpConnectorModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function WpConnectorModal({ isOpen, onClose }: WpConnectorModalProps) {
    // Prevent scrolling when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 pb-20 sm:pb-6">
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background rounded-3xl shadow-2xl border border-border/50 animate-in fade-in zoom-in-95 duration-200">
                <div className="sticky top-0 right-0 z-10 flex justify-end p-4 pointer-events-none">
                    <button
                        onClick={onClose}
                        className="p-2 bg-background/80 backdrop-blur rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-all pointer-events-auto shadow-sm border border-border/50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="px-6 pb-8 md:px-10 md:pb-12 -mt-10">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center p-4 bg-blue-500/10 rounded-full mb-6 text-blue-500 shadow-inner border border-blue-500/20">
                            <ArrowRightLeft className="w-8 h-8" />
                        </div>
                        <h2 className="text-3xl font-bold font-merriweather mb-4 text-foreground">Forbind din WordPress blog</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Har du allerede en personlig sejlerblog kørende på WordPress? Med vores nye Connector kan dit indhold skydes direkte over på Langturssejlads, helt automatisk.
                        </p>
                    </div>

                    <WpConnectorForm />
                </div>
            </div>
        </div>
    );
}
