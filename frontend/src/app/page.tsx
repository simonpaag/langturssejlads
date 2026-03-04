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

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Fetch from our Node.js backend
  let allPosts: Post[] = [];
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://angturssejlads-api.onrender.com';
    const res = await fetch(`${apiUrl}/api/posts`, { cache: 'no-store' });
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

      {/* Featured Story */}
      {featured ? (
        <article className="mb-16 md:mb-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center border-b-[2px] border-foreground pb-12">
          <Link href={`/posts/${featured.slug}`} className="lg:col-span-8 group hover-lift cursor-pointer block">
            <div className="relative w-full aspect-[16/9] lg:aspect-[2/1] bg-muted overflow-hidden border border-border">
              {/* Beautiful Cover Image */}
              <img
                src={featured.imageUrl || `https://images.unsplash.com/photo-1544331002-c940ce98a8da?q=80&w=2000&auto=format&fit=crop`}
                alt="Sailing cover"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out grayscale-[20%]"
              />
              {
                featured.youtubeUrl && (
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-2 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Video Oplevelse
                  </div>
                )
              }
            </div >
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
                {featured.author.profileImage && <img src={featured.author.profileImage} alt={featured.author.name} className="w-6 h-6 rounded-full" />}
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
              {restOfPosts.map((post, idx) => (
                <article key={post.id} className="group flex flex-col h-full hover-lift">
                  <Link href={`/posts/${post.slug}`} className="block relative w-full aspect-[4/3] bg-muted mb-4 overflow-hidden border border-border">
                    <img
                      src={post.imageUrl || `https://images.unsplash.com/photo-1500455806655-2cde2ff969c3?q=80&w=800&auto=format&fit=crop&sig=${post.id}`}
                      alt="Sailing grid image"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out grayscale-[10%]"
                    />
                    {post.youtubeUrl && (
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Video
                      </div>
                    )}
                  </Link>

                  <div className="flex items-center gap-2 mb-2 text-[11px] font-bold uppercase tracking-widest text-primary">
                    <Link href={`/boats/${post.boat.slug}`} className="hover:underline underline-offset-4 flex gap-1.5 items-center">
                      {post.boat.profileImage && <img src={post.boat.profileImage} alt={post.boat.name} className="w-4 h-4 rounded-full" />}
                      {post.boat.name}
                    </Link>
                    <span className="text-muted-foreground font-normal line-clamp-1 truncate block">&bull; {format(new Date(post.createdAt), 'd. MMM yyyy', { locale: da })}</span>
                  </div>

                  <Link href={`/posts/${post.slug}`}>
                    <h3 className="text-2xl font-merriweather font-bold mb-3 leading-snug group-hover:text-primary transition-colors line-clamp-3">
                      {post.title || (post.postType === 'PHOTO' ? 'Nyt Billede' : 'Opdatering')}
                    </h3>
                  </Link>

                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
                    {post.content}
                  </p>

                  <div className="mt-auto pt-4 border-t border-border/60">
                    <span className="text-xs font-semibold text-muted-foreground">Af {post.author.name}</span>
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
