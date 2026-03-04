"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // Avoid hydration mismatch by waiting for client mount
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button
                className="p-2 bg-muted rounded-full text-muted-foreground opacity-50 border border-border"
                aria-label="Skift tema loader"
                disabled
            >
                <div className="h-5 w-5" />
            </button>
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 bg-muted rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors relative flex items-center justify-center border border-border group"
            aria-label="Skift tema"
        >
            <Sun className="h-5 w-5 transition-all block dark:hidden group-hover:rotate-45" />
            <Moon className="h-5 w-5 transition-all hidden dark:block group-hover:-rotate-12" />
        </button>
    );
}
