import { format } from 'date-fns';
import { da } from 'date-fns/locale';
import Image from 'next/image';
import Link from 'next/link';

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
  author: Author;
  boat: Boat;
  voyage: { id: number; title: string } | null;
}

import { unstable_noStore as noStore } from 'next/cache';
import { Ship, Sailboat, ChevronRight, User } from 'lucide-react';
import InviteCard from '@/components/InviteCard';

export const revalidate = 60; // Cached per minut

export default async function Home() {
  // Fetch from our Node.js backend
  let allPosts: Post[] = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://langturssejlads-api.onrender.com';
    const res = await fetch(`${apiUrl}/api/posts`, { next: { revalidate: 60 } });
    if (res.ok) {
      allPosts = await res.json();
    }
  } catch (error) {
    console.error('Failed to fetch posts:', error);
  }

  // The Frontpage acts as a newspaper, so we only want to feature rich content like Articles and YouTube videos
  const newsPosts = allPosts.filter(p => p.postType === 'ARTICLE' || p.postType === 'YOUTUBE' || p.postType === 'PHOTO');

  const featured = newsPosts[0];
  const restOfPosts = newsPosts.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

      {/* Hero Welcome Section */}
      <div className="mb-16 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-merriweather font-black tracking-tight text-foreground mb-4">
          Eventyret starter her
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8">
          Følg de danske sejlere på langfart på de syv verdenshave.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="https://www.facebook.com/groups/Langturssejlads/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-2.5 text-sm bg-[#1877F2] hover:bg-[#1877F2]/90 text-white font-bold rounded-full transition-all flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook Gruppe
          </a>
          <Link
            href="/register"
            className="w-full sm:w-auto px-6 py-2.5 text-sm bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 transition-all border border-transparent"
          >
            Vær med
          </Link>
        </div>
      </div>

      {/* Featured Story */}
      {featured ? (
        <article className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-20 items-center">
          <Link href={`/posts/${featured.slug}`} className="relative h-64 md:h-full min-h-[400px] w-full lg:col-span-8 overflow-hidden rounded-3xl shadow-2xl group flex-shrink-0">
            <div className="absolute inset-0 relative w-full h-full">
              <Image
                src={featured.imageUrl || `https://images.unsplash.com/photo-1544331046-ad6498b846bf?q=80&w=1200&auto=format&fit=crop`}
                alt={`Opdatering fra ${featured.boat.name}: ${featured.title || 'Ingen titel'}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                priority
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
                {featured.author.profileImage ? (
                  <Image
                    src={featured.author.profileImage}
                    alt={`Profilbillede af Kaptajn ${featured.author.name}`}
                    width={24} height={24}
                    className="rounded-full object-cover w-6 h-6"
                  />
                ) : (
                  <User className="w-5 h-5 text-muted-foreground mr-1" />
                )}
                Af {featured.author.name}
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
              {restOfPosts.map((post, idx) => (
                <article key={post.id} className="group flex flex-col h-full bg-background rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-border/50 overflow-hidden">
                  <Link href={`/posts/${post.slug}`} className="block relative w-full aspect-[4/3] bg-muted overflow-hidden">
                    <Image
                      src={post.imageUrl || `https://images.unsplash.com/photo-1500455806655-2cde2ff969c3?q=80&w=800&auto=format&fit=crop&sig=${post.id}`}
                      alt={`Glimt fra havet: ${post.title || post.boat.name}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
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
                        {post.boat.profileImage && (
                          <div className="w-5 h-5 relative">
                            <Image
                              src={post.boat.profileImage}
                              alt={`Logo for ${post.boat.name}`}
                              fill
                              className="rounded-full object-cover"
                            />
                          </div>
                        )}
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
                        {post.author.profileImage ? (
                          <Image
                            src={post.author.profileImage}
                            alt={`Profilbillede af forfatter ${post.author.name}`}
                            width={24} height={24}
                            className="rounded-full object-cover w-6 h-6"
                          />
                        ) : (
                          <User className="w-4 h-4 text-muted-foreground mr-1" />
                        )}
                        Af {post.author.name}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )
      }
    </div >
  );
}
