import type { Metadata } from 'next';
import { Inter, Merriweather } from 'next/font/google';
import { Suspense } from 'react';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const merriweather = Merriweather({
  weight: ['300', '400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-merriweather',
  display: 'swap',
});

import CookieBanner from '@/components/CookieBanner';
import { ThemeProvider } from '@/components/ThemeProvider';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  metadataBase: new URL('https://langturssejlads.dk'),
  title: 'Langturssejlads.dk - Historier fra verdenshavene',
  description: 'En platform for danske langturssejlere og deres utrolige rejser.',
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da" className={`${inter.variable} ${merriweather.variable}`} suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased min-h-screen flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Suspense fallback={<div className="h-14 bg-background border-b border-border" />}>
            <Navbar />
          </Suspense>
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
          <CookieBanner />
          {process.env.NEXT_PUBLIC_BUILD_TIME && (
            <div className="fixed bottom-2 right-4 z-[100] text-[10px] font-medium text-muted-foreground/40 pointer-events-none select-none text-right">
              Sidst opdateret: {process.env.NEXT_PUBLIC_BUILD_TIME}
            </div>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
