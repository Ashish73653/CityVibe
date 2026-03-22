'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { CreatorCardSkeleton, HeaderSkeleton } from '@/components/SkeletonLoaders';

interface Creator {
  id: number;
  name: string;
  _count: {
    RecommendationPost: number;
  };
  topPosts?: Array<{
    id: number;
    caption: string;
    mediaUrl: string;
    _count: { likes: number };
  }>;
}

interface User {
  id: number;
  selectedCityId: number | null;
  selectedCity: { id: number; name: string } | null;
}

export default function CreatorsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>([]);
  const [sortBy, setSortBy] = useState<'posts' | 'popular'>('posts');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user?.selectedCityId) {
      fetchCreators();
    }
  }, [user]);

  useEffect(() => {
    sortCreators();
  }, [creators, sortBy]);

  async function fetchUser() {
    try {
      const res = await fetch('/api/user/me');
      const data = await res.json();

      if (!data.user) {
        router.push('/auth/login');
        return;
      }

      if (!data.user.selectedCityId) {
        router.push('/select-city');
        return;
      }

      setUser(data.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  }

  async function fetchCreators() {
    if (!user?.selectedCityId) return;

    try {
      // Fetch all posts to get creators
      const res = await fetch(`/api/feed?cityId=${user.selectedCityId}&limit=500`);
      const data = await res.json();

      // Group posts by creator
      const creatorMap = new Map<number, Creator>();

      (data.posts || []).forEach((post: any) => {
        const creatorId = post.user.id;

        if (!creatorMap.has(creatorId)) {
          creatorMap.set(creatorId, {
            id: creatorId,
            name: post.user.name,
            _count: { RecommendationPost: 0 },
            topPosts: [],
          });
        }

        const creator = creatorMap.get(creatorId)!;
        creator._count.RecommendationPost += 1;

        if ((creator.topPosts || []).length < 4) {
          creator.topPosts = [...(creator.topPosts || []), post];
        }

        // Keep top posts sorted by likes
        creator.topPosts?.sort((a, b) => b._count.likes - a._count.likes);
      });

      // Filter creators with at least 1 post
      const creatorsList = Array.from(creatorMap.values())
        .filter((c) => c._count.RecommendationPost >= 1)
        .sort((a, b) => b._count.RecommendationPost - a._count.RecommendationPost);

      setCreators(creatorsList);
    } catch (error) {
      console.error('Failed to fetch creators:', error);
    } finally {
      setLoading(false);
    }
  }

  function sortCreators() {
    let sorted = [...creators];

    if (sortBy === 'popular') {
      // Sort by total likes of their posts
      sorted.sort((a, b) => {
        const aLikes = (a.topPosts || []).reduce((sum, post) => sum + post._count.likes, 0);
        const bLikes = (b.topPosts || []).reduce((sum, post) => sum + post._count.likes, 0);
        return bLikes - aLikes;
      });
    } else {
      // Sort by number of posts
      sorted.sort((a, b) => b._count.RecommendationPost - a._count.RecommendationPost);
    }

    setFilteredCreators(sorted);
  }

  if (loading || !user) {
    return (
      <>
        <Navigation />
        <div className="cv-shell py-8 md:py-8 cv-enter">
          <HeaderSkeleton />
          <div className="mb-8 flex items-center gap-3 animate-pulse">
            <div className="h-4 w-12 rounded bg-[#f1e8d4]" />
            <div className="flex gap-2">
              <div className="h-10 w-32 rounded-lg bg-[#f1e8d4]" />
              <div className="h-10 w-32 rounded-lg bg-[#f1e8d4]" />
            </div>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <CreatorCardSkeleton count={6} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="cv-shell py-6 md:py-8 cv-enter">
        {/* Header */}
        <section className="cv-card mb-8 p-6 md:p-8 bg-gradient-to-br from-[#76855a] to-[#5a6845] text-white">
          <p className="text-sm font-bold uppercase tracking-[0.14em] opacity-90">Community</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
            Meet the Creators
          </h1>
          <p className="mt-3 text-lg opacity-90">
            Local experts and enthusiasts sharing hidden gems, restaurants, and experiences in{' '}
            {user.selectedCity?.name}
          </p>
        </section>

        {/* Sort Controls */}
        <div className="mb-8 flex items-center gap-3">
          <p className="text-sm font-bold text-[#8c7a5f]">Sort by:</p>
          <div className="flex gap-2">
            {[
              { value: 'posts', label: '📝 Most Active' },
              { value: 'popular', label: '⭐ Most Popular' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value as 'posts' | 'popular')}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  sortBy === option.value
                    ? 'bg-[#1f1d1a] text-[#f8f5ef] shadow-md'
                    : 'border border-neutral-900/12 bg-white text-[#4d453b] hover:bg-[#f9f6f0]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Creators Grid */}
        {filteredCreators.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredCreators.map((creator) => {
              const totalLikes = (creator.topPosts || []).reduce((sum, post) => sum + post._count.likes, 0);

              return (
                <div
                  key={creator.id}
                  className="group cv-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[#c89420]/30 hover:-translate-y-1"
                >
                  {/* Creator Header */}
                  <div className="relative h-24 bg-gradient-to-r from-[#76855a] to-[#6f7f8d] overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-white/10" />
                    <div className="absolute bottom-0 left-0 h-12 w-12 rounded-full bg-white/10" />
                  </div>

                  {/* Creator Info */}
                  <div className="px-5 pb-5 pt-4">
                    <div className="mb-4">
                      <div className="mb-3 -mt-12 flex justify-between items-start">
                        <div className="inline-flex h-20 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-[#d9a12a] to-[#ba8418] text-3xl font-black text-[#1d1b18] shadow-lg">
                          {creator.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-xs font-bold text-[#c89420] bg-[#f4ecdc] px-2 py-1 rounded">
                          Verified Local
                        </span>
                      </div>

                      <h3 className="mt-4 text-lg font-bold text-[#1f1d1a]">{creator.name}</h3>
                      <p className="text-xs text-[#8c7a5f]">@{creator.name.toLowerCase().replace(/\s+/g, '_')}</p>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 border-y border-neutral-900/10 py-4">
                      <div className="text-center">
                        <p className="text-lg font-black text-[#c89420]">{creator._count.RecommendationPost}</p>
                        <p className="text-xs font-semibold text-[#8c7a5f]">Recommendations</p>
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-black text-[#c89420]">{totalLikes}</p>
                        <p className="text-xs font-semibold text-[#8c7a5f]">Total Likes</p>
                      </div>
                    </div>

                    {/* Top Posts Preview */}
                    {(creator.topPosts || []).length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#8c7a5f]">
                          Top Posts
                        </p>
                        <div className="grid grid-cols-4 gap-2">
                          {(creator.topPosts || []).slice(0, 4).map((post) => (
                            <div
                              key={post.id}
                              className="group/post relative aspect-square overflow-hidden rounded-lg bg-[#f1e8d4]"
                            >
                              {post.mediaUrl ? (
                                <img
                                  src={post.mediaUrl}
                                  alt={post.caption}
                                  className="h-full w-full object-cover transition-transform group-hover/post:scale-110"
                                />
                              ) : null}
                              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover/post:bg-black/40">
                                <span className="text-xs font-bold text-white opacity-0 transition-opacity group-hover/post:opacity-100">
                                  ❤️ {post._count.likes}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* View Profile Button */}
                    <button className="mt-4 w-full rounded-lg bg-[#1f1d1a] px-4 py-2.5 text-xs font-bold text-[#f8f5ef] transition-all duration-200 hover:bg-black active:scale-95">
                      View Profile
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="cv-card flex h-48 flex-col items-center justify-center text-center">
            <p className="text-lg font-semibold text-[#1f1d1a]">No creators yet</p>
            <p className="mt-1 text-sm text-[#8c7a5f]">
              Be the first to create amazing recommendations in {user.selectedCity?.name}
            </p>
            <Link
              href="/upload"
              className="mt-4 rounded-lg bg-[#c89420] px-6 py-2 text-sm font-bold text-[#1d1b18] transition-all hover:bg-[#b37d1f]"
            >
              Create Recommendation
            </Link>
          </div>
        )}

        {/* Stats Footer */}
        {filteredCreators.length > 0 && (
          <div className="mt-12 cv-card p-6 bg-gradient-to-r from-[#f4ecdc] to-[#ede2cf]">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-black text-[#c89420]">{filteredCreators.length}</p>
                <p className="text-sm font-semibold text-[#8c7a5f]">Active Creators</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#c89420]">
                  {filteredCreators.reduce((sum, c) => sum + c._count.RecommendationPost, 0)}
                </p>
                <p className="text-sm font-semibold text-[#8c7a5f]">Total Recommendations</p>
              </div>
              <div>
                <p className="text-2xl font-black text-[#c89420]">
                  {filteredCreators.reduce(
                    (sum, c) => sum + (c.topPosts || []).reduce((pSum, p) => pSum + p._count.likes, 0),
                    0
                  )}
                </p>
                <p className="text-sm font-semibold text-[#8c7a5f]">Total Engagement</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
