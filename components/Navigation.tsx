'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  selectedCityId: number | null;
  selectedCity: { id: number; name: string } | null;
}

const publicLinks = [
  { label: 'Explore', href: '#explore' },
  { label: 'Categories', href: '#categories' },
  { label: 'Events', href: '#featured' },
  { label: 'Cities', href: '#cities' },
  { label: 'Creators', href: '#creators' },
  { label: 'About', href: '#about' },
];

const appLinks = [
  { label: 'Explore', href: '/home' },
  { label: 'Categories', href: '/categories' },
  { label: 'Events', href: '/events' },
  { label: 'Cities', href: '/select-city' },
  { label: 'Creators', href: '/creators' },
  { label: 'About', href: '/' },
];

export default function Navigation() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, [pathname]);

  async function fetchUser() {
    try {
      const res = await fetch('/api/user/me');
      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  const links = user ? appLinks : publicLinks;

  return (
    <nav className="sticky top-0 z-30 border-b border-neutral-900/10 bg-[#f7f3ea]/85 backdrop-blur-md">
      <div className="cv-shell py-3">
        <div className="flex items-center justify-between gap-2 rounded-2xl border border-neutral-900/10 bg-white/90 px-3 py-2.5 shadow-lg shadow-black/5 sm:gap-3 sm:px-4 sm:py-3">
          <Link href="/" className="inline-flex min-w-0 items-center gap-2 rounded-xl px-1 py-1 sm:gap-2.5">
            <img
              src="/CityVibe.png"
              alt="CityVibe logo"
              className="h-10 w-10 flex-shrink-0 object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.18)] sm:h-12 sm:w-12"
            />
            <span className="min-w-0 leading-tight">
              <span className="block truncate text-base font-black tracking-tight text-[#1f1d1a] sm:text-lg">CityVibe</span>
              <span className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8a7a63] md:block">
                Discover beyond obvious
              </span>
            </span>
          </Link>

          {!loading && (
            <div className="hidden flex-wrap items-center gap-1 lg:flex">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-[#1f1d1a] text-[#f8f5ef] shadow-md shadow-black/20'
                        : 'text-[#4d453b] hover:bg-[#f0e6d6] active:bg-[#e5dbcc]'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-end gap-1.5 sm:gap-2">
            <label className="hidden items-center gap-2 rounded-full border border-neutral-900/12 bg-white px-3 py-1.5 text-sm text-neutral-500 transition-all duration-200 hover:border-neutral-900/20 hover:shadow-md md:inline-flex">
              <span>Search</span>
              <input
                aria-label="Search places"
                className="w-40 bg-transparent text-sm text-neutral-700 outline-none placeholder-neutral-400"
                placeholder="City, cafe, event"
              />
            </label>

            {!loading && user ? (
              <>
                {user.selectedCity && (
                  <Link
                    href="/select-city"
                    className="hidden rounded-full border border-neutral-900/12 bg-[#f4ecdc] px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-[#ede2cf] transition-colors duration-200 sm:inline-flex"
                  >
                    {user.selectedCity.name}
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-neutral-900/14 px-2.5 py-1.5 text-xs font-semibold text-neutral-700 transition-colors duration-200 hover:bg-neutral-100 sm:px-3.5 sm:text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="hidden rounded-full px-3 py-1.5 text-sm font-semibold text-neutral-700 transition-colors duration-200 hover:bg-neutral-100 sm:inline-flex">
                  Login
                </Link>
                <Link href="/auth/signup" className="cv-button-primary rounded-full px-3 py-1.5 text-xs transition-all duration-200 sm:px-4 sm:py-2 sm:text-sm">
                  Start Exploring
                </Link>
              </>
            )}
          </div>
        </div>

        {!loading && (
          <div className="mt-2 flex gap-1 overflow-x-auto pb-1 lg:hidden">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={`mobile-${link.label}`}
                  href={link.href}
                  className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#1f1d1a] text-[#f8f5ef] shadow-md shadow-black/20'
                      : 'border border-neutral-900/10 bg-white text-[#4d453b] hover:bg-[#f0e6d6]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
