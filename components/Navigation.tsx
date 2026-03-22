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

  if (loading) {
    return (
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-indigo-600">CityVibe</span>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-indigo-600">
              CityVibe
            </Link>
            {user && (
              <>
                <Link
                  href="/home"
                  className={`text-gray-700 hover:text-indigo-600 ${
                    pathname === '/home' ? 'text-indigo-600 font-medium' : ''
                  }`}
                >
                  Home
                </Link>
                <Link
                  href="/upload"
                  className={`text-gray-700 hover:text-indigo-600 ${
                    pathname === '/upload' ? 'text-indigo-600 font-medium' : ''
                  }`}
                >
                  Upload
                </Link>
                <Link
                  href="/saved"
                  className={`text-gray-700 hover:text-indigo-600 ${
                    pathname === '/saved' ? 'text-indigo-600 font-medium' : ''
                  }`}
                >
                  Saved
                </Link>
                {user.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className={`text-gray-700 hover:text-indigo-600 ${
                      pathname === '/admin' ? 'text-indigo-600 font-medium' : ''
                    }`}
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.selectedCity && (
                  <Link
                    href="/select-city"
                    className="text-sm text-gray-600 hover:text-indigo-600"
                  >
                    {user.selectedCity.name}
                  </Link>
                )}
                <span className="text-sm text-gray-700">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-600 hover:text-indigo-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
