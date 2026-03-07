import { format } from 'date-fns';
import { da } from 'date-fns/locale';
import Image from 'next/image';
import Link from 'next/link';
import { getFallbackImage } from '@/utils/fallbackImage';
import ImageWithFallback from '@/components/ImageWithFallback';

interface Author {
  id: number;
  name: string;
  profileImage: string | null;
}

interface Boat {
  id: number;
  slug: string;
  name: string;
  profileImage: string | null;
  coverImage?: string | null;
}

export interface Post {
  id: number;
  slug: string;
  title: string | null;
  content: string | null;
  postType: string;
  youtubeUrl: string | null;
  imageUrl: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  author: Author | null;
  boat: Boat;
  voyage: { id: number; title: string } | null;
}

import { unstable_noStore as noStore } from 'next/cache';
import { Ship, Sailboat, ChevronRight, User } from 'lucide-react';
import InviteCard from '@/components/InviteCard';

export const dynamic = 'force-dynamic';

export default async function Home() {
  noStore();
  // Fetch from our Node.js backend
  let allPosts: Post[] = [];
  let activeAds: any[] = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
    const [postsRes, adsRes] = await Promise.all([
      fetch(`${apiUrl}/api/posts`, { cache: 'no-store' }),
      fetch(`${apiUrl}/api/posts/ads`, { cache: 'no-store' })
    ]);

    if (postsRes.ok) allPosts = await postsRes.json();
    if (adsRes.ok) activeAds = await adsRes.json();
  } catch (error) {
    console.error('Failed to fetch posts or ads:', error);
  }

  // The Frontpage acts as a newspaper, so we only want to feature rich content like Articles and YouTube videos
  const newsPosts = allPosts.filter(p => p.postType === 'ARTICLE' || p.postType === 'YOUTUBE' || p.postType === 'PHOTO');

  const featured = newsPosts[0];
  const restOfPosts = newsPosts.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

      {/* Hero Welcome Section */}
      <div className="mb-14 lg:mb-20 text-center max-w-3xl mx-auto flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-merriweather font-black tracking-tight text-foreground/80 mb-2">
          Eventyret starter her
        </h1>
        <div className="w-24 h-1 bg-primary/20 rounded-full mt-4"></div>
      </div>

      {/* Featured Story */}
      {featured ? (
        <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-20 items-center">
          <Link href={`/posts/${featured.slug}`} className="relative h-64 md:h-full min-h-[400px] w-full lg:col-span-8 overflow-hidden rounded-3xl shadow-2xl group flex-shrink-0">
            <div className="absolute inset-0 relative w-full h-full">
              <ImageWithFallback
                src={featured.imageUrl || featured.boat.coverImage || featured.boat.profileImage || getFallbackImage(featured.boat.id, 'cover')}
                fallbackSrc={getFallbackImage(featured.boat.id, 'cover')}
                alt={`Opdatering fra ${featured.boat.name}: ${featured.title || 'Ingen titel'}`}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
              />
            </div>
            {/* Subtle overlay gradient to frame the image and highlight UI elements inside */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-black/10 pointer-events-none"></div>

            {featured.youtubeUrl && (
              <div className="absolute top-6 right-6 bg-red-600/90 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase flex items-center gap-2 backdrop-blur-md shadow-lg">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span> Video
              </div>
            )}
          </Link >

          <div className="lg:col-span-4 flex flex-col justify-center h-full">
            <div className="flex items-center gap-3 mb-4 text-xs font-bold uppercase tracking-widest text-primary">
              <Link href={`/boats/${featured.boat.slug}`} className="hover:underline underline-offset-4">{featured.boat.name}</Link>
              <span className="text-muted-foreground font-normal">&bull;</span>
              <time className="text-muted-foreground font-normal" dateTime={featured.createdAt}>
                {format(new Date(featured.createdAt), 'd. MMMM yyyy', { locale: da })}
              </time>
            </div>

            <Link href={`/posts/${featured.slug}`}>
              <h2 className="text-4xl md:text-5xl lg:text-5xl font-merriweather font-bold leading-tight mb-5 hover:text-primary transition-colors cursor-pointer">
                {featured.title || 'Opdatering fra Havet'}
              </h2>
            </Link>

            <p className="text-muted-foreground text-lg leading-relaxed mb-8 line-clamp-4">
              {featured.content}
            </p>

            <div className="flex items-center justify-between border-t border-border pt-4 mt-auto">
              <span className="font-semibold text-sm flex items-center gap-2">
                <ImageWithFallback
                  src={featured.author?.profileImage || getFallbackImage(featured.author?.id, 'avatar')}
                  fallbackSrc={getFallbackImage(featured.author?.id, 'avatar')}
                  alt={`Profilbillede af Kaptajn ${featured.author?.name || 'Ukendt'}`}
                  className="rounded-full object-cover w-6 h-6 bg-background/50 border border-primary/20"
                />
                Af {featured.author?.name || 'Slettet Bruger'}
              </span>
              <Link href={`/posts/${featured.slug}`} className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors hover:underline underline-offset-4">
                Se detaljer
              </Link>
            </div>
          </div>
        </article >
      ) : (
        <div className="text-center py-32 border-b-[2px] border-foreground mb-12">
          <h2 className="text-3xl font-merriweather font-bold text-muted-foreground">Pressen venter.</h2>
          <p className="text-muted-foreground mt-4">Ingen historier er endnu ankommet fra havene.</p>
        </div>
      )}

      {/* Grid Stories */}
      {
        restOfPosts.length > 0 && (
          <div>
            <h3 className="text-xl font-bold uppercase tracking-widest border-b border-foreground pb-4 mb-8">
              Flere Nyheder fra Havene
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              <InviteCard />
              {restOfPosts.map((post, idx) => {
                const ad = activeAds.find(a => a.placement === idx);
                return (
                  <div className="contents" key={post.id}>
                    {ad && (
                      <article className="group flex flex-col h-full bg-primary/5 rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-2 border-primary/20 overflow-hidden relative">
                        <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full z-10 shadow-md">
                          Annonce
                        </div>
                        {ad.imageUrl && (
                          <Link href={ad.linkUrl || '#'} className="block relative w-full aspect-[4/3] bg-muted overflow-hidden">
                            <Image
                              src={ad.imageUrl}
                              alt={ad.headline}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                            />
                          </Link>
                        )}
                        <div className="flex flex-col flex-grow p-6">
                          <Link href={ad.linkUrl || '#'}>
                            <h3 className="text-2xl font-merriweather font-bold mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-3">
                              {ad.headline}
                            </h3>
                          </Link>
                          <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-4">
                            {ad.content}
                          </p>
                          <div className="mt-auto flex justify-end border-t border-primary/10 pt-4">
                            <Link href={ad.linkUrl || '#'} className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-1 hover:underline underline-offset-4">
                              Læs mere <ChevronRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      </article>
                    )}
                    <article className="group flex flex-col h-full bg-background rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-border/50 overflow-hidden">
                      <Link href={`/posts/${post.slug}`} className="block relative w-full aspect-[4/3] bg-muted overflow-hidden">
                        <ImageWithFallback
                          src={post.imageUrl || post.boat.coverImage || post.boat.profileImage || getFallbackImage(post.id, 'cover')}
                          fallbackSrc={getFallbackImage(post.id, 'cover')}
                          alt={`Glimt fra havet: ${post.title || post.boat.name}`}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                        />
                        {post.youtubeUrl && (
                          <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase flex items-center gap-1.5 shadow-md">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Video
                          </div>
                        )}
                      </Link>

                      <div className="flex flex-col flex-grow p-6">
                        <div className="flex items-center gap-2 mb-3 text-[11px] font-bold uppercase tracking-widest text-primary">
                          <Link href={`/boats/${post.boat.slug}`} className="hover:underline underline-offset-4 flex gap-1.5 items-center">
                            <div className="w-5 h-5 relative shrink-0">
                              <ImageWithFallback
                                src={post.boat.profileImage || getFallbackImage(post.boat.id, 'avatar')}
                                fallbackSrc={getFallbackImage(post.boat.id, 'avatar')}
                                alt={`Logo for ${post.boat.name}`}
                                className="absolute inset-0 w-full h-full rounded-full object-cover border border-primary/20 bg-background/50"
                              />
                            </div>
                            {post.boat.name}
                          </Link>
                          <span className="text-muted-foreground font-normal line-clamp-1 truncate block">&bull; {format(new Date(post.createdAt), 'd. MMM yyyy', { locale: da })}</span>
                        </div>

                        <Link href={`/posts/${post.slug}`}>
                          <h3 className="text-2xl font-merriweather font-bold mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-3">
                            {post.title || (post.postType === 'PHOTO' ? 'Nyt Billede' : 'Opdatering')}
                          </h3>
                        </Link>

                        <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
                          {post.content}
                        </p>

                        <div className="mt-auto flex items-center justify-between border-t border-border/60 pt-4">
                          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                            <ImageWithFallback
                              src={post.author?.profileImage || getFallbackImage(post.author?.id, 'avatar')}
                              fallbackSrc={getFallbackImage(post.author?.id, 'avatar')}
                              alt={`Profilbillede af forfatter ${post.author?.name || 'Slettet'}`}
                              className="rounded-full object-cover w-6 h-6 bg-background/50 border border-primary/20"
                            />
                            Af {post.author?.name || 'Slettet Bruger'}
                          </span>
                        </div>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          </div>
        )
      }
    </div >
  );
}
