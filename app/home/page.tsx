'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { CardSkeleton, HeaderSkeleton } from '@/components/SkeletonLoaders';

interface Post {
  id: number;
  caption: string;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO';
  tags: string | null;
  budgetEstimate: number | null;
  createdAt: string;
  user: { id: number; name: string };
  place: { id: number; name: string; locality: string | null };
  category: { id: number; name: string; slug: string };
  _count: { likes: number; comments: number };
}

interface User {
  id: number;
  name: string;
  selectedCityId: number | null;
  selectedCity: { id: number; name: string } | null;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

type SortBy = 'newest' | 'popular' | 'budgetLow' | 'budgetHigh';
type ViewMode = 'grid' | 'compact';

const quickFilters = [
  { label: 'Under Rs. 300', minBudget: 0, maxBudget: 300 },
  { label: 'Date Ideas', keyword: 'date' },
  { label: 'Study Spots', keyword: 'study' },
  { label: 'Events Today', keyword: 'event' },
  { label: 'Hidden Gems', keyword: 'hidden' },
];

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [minBudget, setMinBudget] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  const [mediaType, setMediaType] = useState<'ALL' | 'IMAGE' | 'VIDEO'>('ALL');
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<number>>(new Set());
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
    fetchCategories();

    const storedViewMode = localStorage.getItem('cv:viewMode');
    if (storedViewMode === 'grid' || storedViewMode === 'compact') {
      setViewMode(storedViewMode);
    }
  }, []);

  useEffect(() => {
    if (user?.selectedCityId) {
      fetchPosts();
    }
  }, [user, selectedCategory, searchQuery, minBudget, maxBudget, mediaType]);

  useEffect(() => {
    localStorage.setItem('cv:viewMode', viewMode);
  }, [viewMode]);

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
      setCategories(data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }

  async function fetchPosts() {
    if (!user?.selectedCityId) return;

    try {
      const params = new URLSearchParams({
        cityId: user.selectedCityId.toString(),
        limit: '120',
        ...(selectedCategory && { categoryId: selectedCategory.toString() }),
        ...(searchQuery && { q: searchQuery }),
        ...(minBudget && { minBudget }),
        ...(maxBudget && { maxBudget }),
        ...(mediaType !== 'ALL' && { mediaType }),
      });

      const res = await fetch(`/api/feed?${params}`);
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLike(postId: number) {
    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
      const data = await res.json();

      if (data.liked) {
        setLikedPosts(new Set([...likedPosts, postId]));
      } else {
        const nextLikedPosts = new Set(likedPosts);
        nextLikedPosts.delete(postId);
        setLikedPosts(nextLikedPosts);
      }

      fetchPosts();
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  }

  async function handleSavePlace(placeId: number, postId: number) {
    try {
      await fetch(`/api/places/${placeId}/save`, { method: 'POST' });
      const nextSaved = new Set(savedPosts);
      if (nextSaved.has(postId)) {
        nextSaved.delete(postId);
      } else {
        nextSaved.add(postId);
      }
      setSavedPosts(nextSaved);
    } catch (error) {
      console.error('Failed to save place:', error);
    }
  }

  async function handleShare(post: Post) {
    const shareUrl = `${window.location.origin}/places/${post.place.id}`;
    const shareText = `${post.place.name} in ${post.place.locality || user?.selectedCity?.name || 'your city'} - ${post.caption}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: 'CityVibe Recommendation', text: shareText, url: shareUrl });
        return;
      } catch {
        // Ignore cancellation and fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      alert('Link copied to clipboard');
    } catch {
      alert('Unable to share right now');
    }
  }

  function applyQuickFilter(filter: (typeof quickFilters)[number]) {
    if (activeQuickFilter === filter.label) {
      setActiveQuickFilter(null);
      setSearchInput('');
      setSearchQuery('');
      setMinBudget('');
      setMaxBudget('');
      return;
    }

    setActiveQuickFilter(filter.label);
    if (filter.keyword) {
      setSearchInput(filter.keyword);
      setSearchQuery(filter.keyword);
      setMinBudget('');
      setMaxBudget('');
    }

    if (filter.minBudget !== undefined || filter.maxBudget !== undefined) {
      setMinBudget(filter.minBudget?.toString() || '');
      setMaxBudget(filter.maxBudget?.toString() || '');
      setSearchInput('');
      setSearchQuery('');
    }
  }

  const sortedPosts = useMemo(() => {
    const nextPosts = [...posts];

    if (sortBy === 'popular') {
      nextPosts.sort((a, b) => b._count.likes - a._count.likes);
    }

    if (sortBy === 'budgetLow') {
      nextPosts.sort((a, b) => (a.budgetEstimate ?? Number.MAX_SAFE_INTEGER) - (b.budgetEstimate ?? Number.MAX_SAFE_INTEGER));
    }

    if (sortBy === 'budgetHigh') {
      nextPosts.sort((a, b) => (b.budgetEstimate ?? 0) - (a.budgetEstimate ?? 0));
    }

    if (sortBy === 'newest') {
      nextPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return nextPosts;
  }, [posts, sortBy]);

  const selectedCategoryObj = categories.find((category) => category.id === selectedCategory) || null;
  const uploadHref = selectedCategoryObj
    ? `/upload?mode=new&categoryId=${selectedCategoryObj.id}`
    : '/upload?mode=new';

  if (loading || !user) {
    return (
      <>
        <Navigation />
        <div className="cv-shell py-8 md:py-8 cv-enter">
          <HeaderSkeleton />
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <CardSkeleton count={6} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="cv-shell py-6 md:py-8 cv-enter">
        <section className="cv-card mb-5 p-4 md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8c7a5f]">Local Discovery Dashboard</p>
              <h1 className="mt-1 text-3xl font-black tracking-tight text-[#1f1d1a] md:text-4xl">Discover {user.selectedCity?.name}</h1>
              <p className="mt-2 text-sm cv-muted md:text-base">Short recommendation cards, curated by locals.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={uploadHref}
                className="rounded-lg bg-[#1f1d1a] px-4 py-2.5 text-sm font-semibold text-[#f8f5ef] hover:bg-black hover:shadow-lg transition-all duration-200 active:scale-95"
              >
                + Add Recommendation
              </Link>
              <button
                onClick={() => setViewMode('grid')}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 ${viewMode === 'grid' ? 'bg-[#1f1d1a] text-[#f7f3ea] shadow-md' : 'border border-neutral-900/12 bg-white text-[#4d453b] hover:bg-[#f9f6f0]'}`}
              >
                Grid View
              </button>
              <button
                onClick={() => setViewMode('compact')}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200 ${viewMode === 'compact' ? 'bg-[#1f1d1a] text-[#f7f3ea] shadow-md' : 'border border-neutral-900/12 bg-white text-[#4d453b] hover:bg-[#f9f6f0]'}`}
              >
                Compact View
              </button>
            </div>
          </div>

          <div className="mt-4 grid gap-3 lg:grid-cols-[1.2fr_repeat(4,minmax(0,1fr))]">
            <div className="rounded-xl border border-neutral-900/12 bg-white p-2">
              <input
                aria-label="Search feed"
                placeholder="Search place, category, locality"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSearchQuery(searchInput.trim());
                  }
                }}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              />
            </div>
            <input
              aria-label="Minimum budget"
              type="number"
              value={minBudget}
              onChange={(e) => setMinBudget(e.target.value)}
              placeholder="Min Rs"
              className="rounded-xl border border-neutral-900/12 bg-white px-3 py-2 text-sm outline-none"
            />
            <input
              aria-label="Maximum budget"
              type="number"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              placeholder="Max Rs"
              className="rounded-xl border border-neutral-900/12 bg-white px-3 py-2 text-sm outline-none"
            />
            <select
              aria-label="Media type filter"
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value as 'ALL' | 'IMAGE' | 'VIDEO')}
              className="rounded-xl border border-neutral-900/12 bg-white px-3 py-2 text-sm outline-none"
            >
              <option value="ALL">All Media</option>
              <option value="IMAGE">Photos</option>
              <option value="VIDEO">Videos</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => setSearchQuery(searchInput.trim())}
                className="cv-button-primary w-full px-3 py-2 text-sm"
              >
                Apply
              </button>
              <button
                onClick={() => {
                  setSearchInput('');
                  setSearchQuery('');
                  setMinBudget('');
                  setMaxBudget('');
                  setMediaType('ALL');
                  setSelectedCategory(null);
                  setActiveQuickFilter(null);
                }}
                className="w-full rounded-xl border border-neutral-900/14 bg-white px-3 py-2 text-sm font-semibold text-[#4d453b]"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {quickFilters.map((chip) => (
              <button
                key={chip.label}
                onClick={() => applyQuickFilter(chip)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${activeQuickFilter === chip.label ? 'border-[#1f1d1a] bg-[#1f1d1a] text-[#f7f3ea]' : 'border-neutral-900/14 bg-white text-[#4d453b] hover:bg-[#f4ecdc]'}`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </section>

        <section className="mb-4 flex flex-wrap items-center gap-2">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`rounded-full px-3 py-1.5 text-sm font-semibold ${selectedCategory === null ? 'bg-[#1f1d1a] text-[#f8f5ef]' : 'border border-neutral-900/14 bg-white text-[#4d453b]'}`}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`rounded-full px-3 py-1.5 text-sm font-semibold ${selectedCategory === category.id ? 'bg-[#1f1d1a] text-[#f8f5ef]' : 'border border-neutral-900/14 bg-white text-[#4d453b]'}`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="ml-auto">
            <select
              aria-label="Sort posts"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="rounded-xl border border-neutral-900/12 bg-white px-3 py-2 text-sm outline-none"
            >
              <option value="newest">Sort: Newest</option>
              <option value="popular">Sort: Most liked</option>
              <option value="budgetLow">Sort: Budget low to high</option>
              <option value="budgetHigh">Sort: Budget high to low</option>
            </select>
          </div>
        </section>

        {sortedPosts.length === 0 ? (
          <section className="cv-card p-8 text-center">
            <h3 className="text-xl font-black text-[#1f1d1a]">No matches found</h3>
            <p className="mt-2 text-sm cv-muted">Try broader filters or publish a recommendation.</p>
            <Link href={uploadHref} className="mt-4 inline-flex rounded-xl bg-[#1f1d1a] px-4 py-2 text-sm font-bold text-[#f8f5ef]">
              Upload Recommendation
            </Link>
          </section>
        ) : (
          <section className={`grid gap-4 ${viewMode === 'grid' ? 'md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
            {sortedPosts.map((post) => (
              <article key={post.id} className="cv-card overflow-hidden">
                <div className={`${viewMode === 'compact' ? 'grid md:grid-cols-[240px_1fr]' : ''}`}>
                  <Link href={`/places/${post.place.id}`}>
                    <div className={`relative ${viewMode === 'compact' ? 'h-full min-h-[180px]' : 'h-44'} bg-gradient-to-br from-[#eed6ab] via-[#f7e9cf] to-[#d7e0ea]`}>
                      <div className="absolute left-3 top-3 rounded-full border border-neutral-900/14 bg-white/90 px-2.5 py-1 text-xs font-bold text-[#4b4338]">
                        {post.mediaType === 'IMAGE' ? 'Photo' : 'Video'}
                      </div>
                    </div>
                  </Link>

                  <div className="p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase tracking-[0.13em] text-[#8c7a5f]">{post.category.name}</span>
                      {post.budgetEstimate && (
                        <span className="rounded-full bg-[#f3dfb1] px-2 py-0.5 text-xs font-bold text-[#6a4a0c]">Rs. {post.budgetEstimate}</span>
                      )}
                    </div>

                    <Link href={`/places/${post.place.id}`}>
                      <h3 className="mt-2 text-lg font-extrabold leading-tight text-[#1f1d1a] hover:text-[#8f650c]">{post.place.name}</h3>
                    </Link>

                    {post.place.locality && <p className="mt-1 text-sm cv-muted">{post.place.locality}</p>}
                    <p className="mt-2 text-sm leading-relaxed text-[#4b4338]">{post.caption}</p>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-neutral-900/10 pt-3 text-sm">
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleLike(post.id)} className="font-semibold text-[#3f382f] hover:text-[#8f650c]">
                          {likedPosts.has(post.id) ? 'Liked' : 'Like'} {post._count.likes}
                        </button>
                        <span className="font-semibold cv-muted">Comments {post._count.comments}</span>
                      </div>
                      <span className="text-xs cv-muted">by {post.user.name}</span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={() => handleSavePlace(post.place.id, post.id)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${savedPosts.has(post.id) ? 'bg-[#1f1d1a] text-[#f8f5ef]' : 'border border-neutral-900/14 bg-white text-[#4d453b]'}`}
                      >
                        {savedPosts.has(post.id) ? 'Saved' : 'Save'}
                      </button>
                      <button
                        onClick={() => handleShare(post)}
                        className="rounded-lg border border-neutral-900/14 bg-white px-3 py-1.5 text-xs font-semibold text-[#4d453b]"
                      >
                        Share
                      </button>
                      <Link href={`/places/${post.place.id}`} className="rounded-lg border border-neutral-900/14 bg-white px-3 py-1.5 text-xs font-semibold text-[#4d453b]">
                        View Place
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}

        <Link
          href={uploadHref}
          className="fixed bottom-5 right-5 z-20 inline-flex items-center rounded-full bg-[#1f1d1a] px-4 py-3 text-sm font-bold text-[#f8f5ef] shadow-xl shadow-black/20 hover:bg-black md:hidden"
        >
          + Add
        </Link>
      </main>
    </>
  );
}
