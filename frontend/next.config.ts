import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_BUILD_TIME: new Date().toLocaleString('da-DK', {
      timeZone: 'Europe/Copenhagen',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  },
  async redirects() {
    return [
      // Gamle Sider (Pages)
      { source: '/pages/55nord', destination: '/boats/55nord', permanent: true },
      { source: '/pages/s-y-miraculix', destination: '/boats/miraculix', permanent: true },
      { source: '/pages/skibe-pa-langtur', destination: '/boats', permanent: true },
      { source: '/pages/s-y-veritas', destination: '/boats/veritas', permanent: true },
      { source: '/pages/kontakt', destination: '/om', permanent: true }, // Kontakt findes på Om-siden
      { source: '/pages/bestil-hjemmeside', destination: '/annoncor', permanent: true }, // Tætteste match
      { source: '/pages/s-y-josephine', destination: '/boats/josephine', permanent: true },
      { source: '/pages/gastepladser', destination: '/togter', permanent: true }, // Gastepladser er nu togter
      { source: '/pages/hvalodea', destination: '/boats/hvalodea', permanent: true },
      { source: '/pages/film', destination: '/faq', permanent: true }, // Film/viden
      { source: '/pages/ayla-sailing', destination: '/boats/ayla', permanent: true },
      { source: '/pages/therosentofts', destination: '/boats/rosentofts', permanent: true },
      { source: '/pages/staysaltysailing', destination: '/boats/staysalty', permanent: true },
      { source: '/pages/transportsejlads', destination: '/faq', permanent: true }, // Tilbydes nok ikke som service, så faq er sikrest

      // Gamle Blogs
      { source: '/blogs/news', destination: '/faq', permanent: true },
      { source: '/blogs/tips', destination: '/faq', permanent: true },
      { source: '/blogs/arc-sejlads', destination: '/faq', permanent: true },

      // Specifikke gamle artikler / sider
      { source: '/hvad-er-kojepenge.html', destination: '/faq/koejepenge', permanent: true },
      { source: '/hvilken-baad-skal-jeg-vaelge.html', destination: '/faq', permanent: true },
      { source: '/pages/:path*', destination: '/faq', permanent: true }, // Fallback for alle andre /pages
      { source: '/blogs/:path*', destination: '/faq', permanent: true } // Fallback for alle andre /blogs
    ];
  }
};

export default nextConfig;
