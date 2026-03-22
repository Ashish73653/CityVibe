'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Link from 'next/link';
import { EventCardSkeleton, HeaderSkeleton, FiltersSkeleton } from '@/components/SkeletonLoaders';

interface Event {
  id: number;
  caption: string;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO';
  createdAt: string;
  place: { id: number; name: string; locality: string | null };
  category: { id: number; name: string };
  user: { id: number; name: string };
  _count: { likes: number; comments: number };
}

interface User {
  id: number;
  selectedCityId: number | null;
  selectedCity: { id: number; name: string } | null;
}

export default function EventsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (user?.selectedCityId) {
      fetchEvents();
    }
  }, [user]);

  useEffect(() => {
    filterEvents();
  }, [events, selectedDate, selectedCategory]);

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
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }

  async function fetchEvents() {
    if (!user?.selectedCityId) return;

    try {
      const res = await fetch(`/api/feed?cityId=${user.selectedCityId}&limit=100&q=event`);
      const data = await res.json();

      // Sort by newest
      const sortedEvents = (data.posts || []).sort(
        (a: Event, b: Event) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setEvents(sortedEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  }

  function filterEvents() {
    let filtered = [...events];

    // Filter by date
    if (selectedDate !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const thisWeek = new Date(today);
      thisWeek.setDate(thisWeek.getDate() + 7);

      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.createdAt);
        const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

        if (selectedDate === 'today') return eventDay.getTime() === today.getTime();
        if (selectedDate === 'tomorrow') return eventDay.getTime() === tomorrow.getTime();
        if (selectedDate === 'week') return eventDay <= thisWeek;

        return true;
      });
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((event) => event.category.id.toString() === selectedCategory);
    }

    setFilteredEvents(filtered);
  }

  if (loading || !user) {
    return (
      <>
        <Navigation />
        <div className="cv-shell py-6 md:py-8">
          <HeaderSkeleton />
          <FiltersSkeleton />
          <div className="space-y-4">
            <EventCardSkeleton count={5} />
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
        <section className="cv-card mb-8 p-6 md:p-8 bg-gradient-to-br from-[#c7683b] to-[#b04d1f] text-white">
          <p className="text-sm font-bold uppercase tracking-[0.14em] opacity-90">Happening Now</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight md:text-5xl">
            Events Near You
          </h1>
          <p className="mt-3 text-lg opacity-90">
            Discover what's happening in {user.selectedCity?.name}. Concerts, food festivals, workshops & more
          </p>
        </section>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Date Filters */}
          <div className="cv-card p-4">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.1em] text-[#8c7a5f]">
              When
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'All Events' },
                { value: 'today', label: '📅 Today' },
                { value: 'tomorrow', label: '📅 Tomorrow' },
                { value: 'week', label: '📅 This Week' },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedDate(filter.value)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    selectedDate === filter.value
                      ? 'bg-[#1f1d1a] text-[#f8f5ef] shadow-md'
                      : 'border border-neutral-900/12 bg-white text-[#4d453b] hover:bg-[#f9f6f0]'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filters */}
          <div className="cv-card p-4">
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.1em] text-[#8c7a5f]">
              Category
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  selectedCategory === 'all'
                    ? 'bg-[#1f1d1a] text-[#f8f5ef] shadow-md'
                    : 'border border-neutral-900/12 bg-white text-[#4d453b] hover:bg-[#f9f6f0]'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id.toString())}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                    selectedCategory === cat.id.toString()
                      ? 'bg-[#1f1d1a] text-[#f8f5ef] shadow-md'
                      : 'border border-neutral-900/12 bg-white text-[#4d453b] hover:bg-[#f9f6f0]'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <Link
                key={event.id}
                href={`/places/${event.place.id}`}
                className="group cv-card overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[#c89420]/30 flex flex-col md:flex-row"
              >
                {/* Event Image */}
                <div className="relative h-48 w-full flex-shrink-0 overflow-hidden bg-[#f1e8d4] md:h-auto md:w-64">
                  {event.mediaUrl ? (
                    <img
                      src={event.mediaUrl}
                      alt={event.caption}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-lg text-[#8c7a5f]">
                      No Image
                    </div>
                  )}

                  {/* Event Badge */}
                  <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-lg bg-[#c7683b] px-3 py-1.5 text-xs font-bold text-white">
                    🎉 Event
                  </div>
                </div>

                {/* Event Details */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="inline-block rounded-full bg-[#f4ecdc] px-2 py-1 text-xs font-semibold text-[#4d453b]">
                        {event.category.name}
                      </span>
                      <span className="text-xs text-[#8c7a5f]">
                        {new Date(event.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <h3 className="line-clamp-2 text-lg font-bold text-[#1f1d1a] group-hover:text-[#c89420]">
                      {event.caption}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-[#6a6258]">{event.place.name}</p>
                    {event.place.locality && (
                      <p className="text-xs text-[#8c7a5f]">📍 {event.place.locality}</p>
                    )}
                  </div>

                  {/* Event Meta */}
                  <div className="mt-4 flex items-center gap-4 border-t border-neutral-900/10 pt-4">
                    <div className="flex items-center gap-1 text-sm text-[#6a6258]">
                      <span>❤️</span>
                      <span>{event._count.likes} likes</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-[#6a6258]">
                      <span>💬</span>
                      <span>{event._count.comments} comments</span>
                    </div>
                    <div className="ml-auto text-sm font-semibold text-[#c89420]">
                      View Details →
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="cv-card flex h-48 flex-col items-center justify-center text-center">
              <p className="text-lg font-semibold text-[#1f1d1a]">No events found</p>
              <p className="mt-1 text-sm text-[#8c7a5f]">
                Try changing your filters or check back soon
              </p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
