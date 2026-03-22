'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import { CardSkeleton, ListItemSkeleton, HeaderSkeleton } from '@/components/SkeletonLoaders';

interface SavedPlace {
  id: number;
  createdAt: string;
  place: {
    id: number;
    name: string;
    locality: string | null;
    description: string | null;
    city: { id: number; name: string };
    category: { id: number; name: string; slug: string };
    _count: { posts: number };
  };
}

type SortBy = 'recent' | 'name' | 'posts';

type ViewMode = 'grid' | 'list';

export default function SavedPage() {
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('recent');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const router = useRouter();

  useEffect(() => {
    fetchSavedPlaces();

    const savedMode = localStorage.getItem('cv:savedViewMode');
    if (savedMode === 'grid' || savedMode === 'list') {
      setViewMode(savedMode);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cv:savedViewMode', viewMode);
  }, [viewMode]);

  async function fetchSavedPlaces() {
    try {
      const res = await fetch('/api/user/saved');
      const data = await res.json();

      if (res.status === 401) {
        router.push('/auth/login');
        return;
      }

      setSavedPlaces(data.savedPlaces || []);
    } catch (error) {
      console.error('Failed to fetch saved places:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUnsave(placeId: number) {
    try {
      await fetch(`/api/places/${placeId}/save`, { method: 'POST' });
      setSavedPlaces((current) => current.filter((sp) => sp.place.id !== placeId));
    } catch (error) {
      console.error('Failed to unsave place:', error);
    }
  }

  const filteredSavedPlaces = useMemo(() => {
    let next = [...savedPlaces];

    if (query.trim()) {
      const q = query.toLowerCase();
      next = next.filter(
        (item) =>
          item.place.name.toLowerCase().includes(q) ||
          item.place.category.name.toLowerCase().includes(q) ||
          item.place.city.name.toLowerCase().includes(q) ||
          (item.place.locality || '').toLowerCase().includes(q)
      );
    }

    if (sortBy === 'name') {
      next.sort((a, b) => a.place.name.localeCompare(b.place.name));
    }

    if (sortBy === 'posts') {
      next.sort((a, b) => b.place._count.posts - a.place._count.posts);
    }

    if (sortBy === 'recent') {
      next.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return next;
  }, [savedPlaces, query, sortBy]);

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="cv-shell py-6 md:py-8">
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
        <section className="cv-card mb-5 p-5 md:p-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8c7a5f]">Saved lists</p>
              <h1 className="mt-1 text-3xl font-black tracking-tight text-[#1f1d1a]">Saved places</h1>
              <p className="mt-2 text-sm cv-muted">Keep your local plans organized and ready to share.</p>
            </div>
            <Link href="/home" className="cv-button-secondary">
              Explore more
            </Link>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-[1fr_220px_220px]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search saved places"
              className="cv-field"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="cv-field"
            >
              <option value="recent">Sort: Recently saved</option>
              <option value="name">Sort: Name</option>
              <option value="posts">Sort: Most recommendations</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`w-full rounded-xl px-3 py-2 text-sm font-semibold ${viewMode === 'grid' ? 'bg-[#1f1d1a] text-[#f8f5ef]' : 'border border-neutral-900/14 bg-white text-[#4d453b]'}`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`w-full rounded-xl px-3 py-2 text-sm font-semibold ${viewMode === 'list' ? 'bg-[#1f1d1a] text-[#f8f5ef]' : 'border border-neutral-900/14 bg-white text-[#4d453b]'}`}
              >
                List
              </button>
            </div>
          </div>
        </section>

        {filteredSavedPlaces.length === 0 ? (
          <section className="cv-card p-10 text-center">
            <h2 className="text-xl font-black text-[#1f1d1a]">No saved places found</h2>
            <p className="mt-2 text-sm cv-muted">Try a different search or save places from the feed.</p>
            <Link href="/home" className="mt-4 inline-flex rounded-xl bg-[#1f1d1a] px-4 py-2 text-sm font-bold text-[#f8f5ef]">
              Go to home feed
            </Link>
          </section>
        ) : (
          <section className={`grid gap-4 ${viewMode === 'grid' ? 'md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredSavedPlaces.map((saved) => (
              <article key={saved.id} className="cv-card overflow-hidden">
                <div className={`${viewMode === 'list' ? 'grid md:grid-cols-[230px_1fr]' : ''}`}>
                  <div className="h-32 bg-gradient-to-br from-[#edd6ad] via-[#f6ecd9] to-[#d1dde9] md:h-full" />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link href={`/places/${saved.place.id}`}>
                          <h3 className="text-lg font-extrabold text-[#1f1d1a] hover:text-[#8f650c]">{saved.place.name}</h3>
                        </Link>
                        <p className="mt-1 text-sm cv-muted">{saved.place.locality || saved.place.city.name}</p>
                      </div>
                      <button
                        onClick={() => handleUnsave(saved.place.id)}
                        className="rounded-lg border border-neutral-900/14 px-2.5 py-1 text-xs font-semibold text-[#4d453b]"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full bg-[#f3dfb1] px-2.5 py-1 font-bold text-[#6a4a0c]">{saved.place.category.name}</span>
                      <span className="rounded-full border border-neutral-900/14 bg-white px-2.5 py-1 font-semibold text-[#4d453b]">{saved.place._count.posts} posts</span>
                    </div>

                    {saved.place.description && <p className="mt-3 text-sm leading-relaxed text-[#4b4338]">{saved.place.description}</p>}

                    <p className="mt-3 text-xs cv-muted">Saved on {new Date(saved.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </>
  );
}
