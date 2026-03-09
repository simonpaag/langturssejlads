import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const hostname = request.headers.get('host') || '';

    // Redirect *.vercel.app to the main domain for SEO purposes
    if (
        hostname.includes('vercel.app') &&
        !hostname.includes('localhost')
    ) {
        const url = request.nextUrl.clone();
        url.hostname = 'langturssejlads.dk';
        url.port = ''; // Ensure port isn't attached to custom domain

        // 301 Permanent Redirect
        return NextResponse.redirect(url, 301);
    }

    return NextResponse.next();
}

// Config for middleware matcher
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
