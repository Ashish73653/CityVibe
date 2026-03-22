'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { CategoryCardSkeleton, HeaderSkeleton } from '@/components/SkeletonLoaders';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  _count?: {
    RecommendationPost: number;
  };
}

interface Post {
  id: number;
  caption: string;
  mediaUrl: string;
  category: { id: number; name: string };
  _count: { likes: number };
}

export default function CategoriesPage() {
  const [user, setUser] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryStats, setCategoryStats] = useState<Record<number, { posts: number; trending: Post[] }>>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user?.selectedCityId) {
      fetchCategories();
    }
  }, [user]);

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

  async function fetchCategories() {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories || []);

      // Fetch trending posts for each category
      const stats: Record<number, { posts: number; trending: Post[] }> = {};

      for (const category of data.categories || []) {
        try {
          const postsRes = await fetch(
            `/api/feed?cityId=${user.selectedCityId}&categoryId=${category.id}&limit=3`
          );
          const postsData = await postsRes.json();
          stats[category.id] = {
            posts: postsData.posts?.length || 0,
            trending: (postsData.posts || []).slice(0, 3),
          };
        } catch (error) {
          stats[category.id] = { posts: 0, trending: [] };
        }
      }

      setCategoryStats(stats);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading || !user) {
    return (
      <>
        <Navigation />
        <div className="cv-shell py-8 md:py-8 cv-enter">
          <HeaderSkeleton />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <CategoryCardSkeleton count={6} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="cv-shell py-6 md:py-8 cv-enter">
        <section className="cv-card mb-8 p-6 md:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8c7a5f]">Discover</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight text-[#1f1d1a] md:text-5xl">
            Explore by Category
          </h1>
          <p className="mt-3 text-lg text-[#6a6258]">
            Find amazing recommendations by browsing popular categories in {user.selectedCity?.name}
          </p>
        </section>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const stats = categoryStats[category.id] || { posts: 0, trending: [] };
            const categoryColor = getCategoryColor(category.id);

            return (
              <Link
                key={category.id}
                href={`/home?categoryId=${category.id}`}
                className="group cv-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[#c89420]/30 hover:-translate-y-1"
              >
                {/* Category Header with Gradient */}
                <div
                  className={`h-32 bg-gradient-to-br p-6 text-white flex flex-col justify-between ${categoryColor}`}
                >
                  <div>
                    <h3 className="text-2xl font-black tracking-tight">{category.name}</h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold opacity-90">{stats.posts} recommendations</span>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-lg">
                      →
                    </span>
                  </div>
                </div>

                {/* Category Details */}
                <div className="p-5">
                  {category.description && (
                    <p className="text-sm text-[#6a6258] mb-4 line-clamp-2">{category.description}</p>
                  )}

                  {/* Trending Posts Preview */}
                  {stats.trending.length > 0 && (
                    <div className="space-y-3 border-t border-neutral-900/10 pt-4">
                      <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#8c7a5f]">
                        Trending
                      </p>
                      <div className="space-y-2">
                        {stats.trending.slice(0, 2).map((post) => (
                          <div
                            key={post.id}
                            className="flex items-start gap-2 text-xs text-[#6a6258]"
                          >
                            <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-[#c89420]" />
                            <span className="line-clamp-2">{post.caption}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="mt-4 flex gap-4 border-t border-neutral-900/10 pt-4 text-xs font-semibold text-[#4d453b]">
                    <div>
                      <span className="block text-[#c89420]">{stats.posts}</span>
                      <span className="text-[#8c7a5f]">Posts</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {categories.length === 0 && (
          <div className="cv-card flex h-48 flex-col items-center justify-center text-center">
            <p className="text-[#8c7a5f]">No categories available yet</p>
          </div>
        )}
      </main>
    </>
  );
}

function getCategoryColor(id: number): string {
  const colors = [
    'from-[#c89420] to-[#a8770f]',
    'from-[#c7683b] to-[#b04d1f]',
    'from-[#76855a] to-[#5a6845]',
    'from-[#6f7f8d] to-[#536478]',
    'from-[#c89420] to-[#9d6f15]',
    'from-[#8b6f47] to-[#6b5436]',
  ];
  return colors[id % colors.length];
}
