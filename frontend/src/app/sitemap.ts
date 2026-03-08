import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://langturssejlads.dk';
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';

    let boats = [];
    let voyages = [];
    let faqs = [];
    let posts = [];

    try {
        const [boatsRes, voyagesRes, faqRes, postsRes] = await Promise.all([
            fetch(`${apiUrl}/api/boats`, { next: { revalidate: 3600 } }),
            fetch(`${apiUrl}/api/voyages`, { next: { revalidate: 3600 } }),
            fetch(`${apiUrl}/api/faq`, { next: { revalidate: 3600 } }),
            fetch(`${apiUrl}/api/posts`, { next: { revalidate: 3600 } })
        ]);

        if (boatsRes.ok) boats = await boatsRes.json();
        if (voyagesRes.ok) voyages = await voyagesRes.json();
        if (faqRes.ok) faqs = await faqRes.json();
        if (postsRes.ok) posts = await postsRes.json();
    } catch (error) {
        console.error('Failed to fetch data for sitemap:', error);
    }

    // Base static routes
    const routes = [
        '',
        '/boats',
        '/togter',
        '/faq',
        '/om',
        '/rettigheder',
        '/annoncor',
        '/opret-baad',
        '/login',
        '/register'
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic boat routes
    const boatRoutes = boats.map((boat: any) => ({
        url: `${baseUrl}/boats/${boat.slug}`,
        lastModified: boat.updatedAt ? new Date(boat.updatedAt) : new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    // Dynamic voyage routes
    const voyageRoutes = voyages.map((voyage: any) => ({
        url: `${baseUrl}/boats/${voyage.boat?.slug}/voyages/${voyage.slug}`,
        lastModified: voyage.updatedAt ? new Date(voyage.updatedAt) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }));

    // Dynamic FAQ routes
    const faqRoutes = faqs.map((faq: any) => ({
        url: `${baseUrl}/faq/${faq.slug}`,
        lastModified: faq.updatedAt ? new Date(faq.updatedAt) : new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }));

    // Dynamic Post (Logbøger) routes
    const postRoutes = posts.map((post: any) => ({
        url: `${baseUrl}/posts/${post.slug}`,
        lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.createdAt),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }));

    return [...routes, ...boatRoutes, ...voyageRoutes, ...faqRoutes, ...postRoutes];
}
