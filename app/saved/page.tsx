'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Link from 'next/link';

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

export default function SavedPage() {
  const [savedPlaces, setSavedPlaces] = useState<SavedPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchSavedPlaces();
  }, []);

  async function fetchSavedPlaces() {
    try {
      const res = await fetch('/api/user/saved');
      const data = await res.json();

      if (res.status === 401) {
        router.push('/auth/login');
        return;
      }

      setSavedPlaces(data.savedPlaces);
    } catch (error) {
      console.error('Failed to fetch saved places:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleUnsave(placeId: number) {
    try {
      await fetch(`/api/places/${placeId}/save`, { method: 'POST' });
      setSavedPlaces(savedPlaces.filter((sp) => sp.place.id !== placeId));
    } catch (error) {
      console.error('Failed to unsave place:', error);
    }
  }

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-600">Loading...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Saved Places</h1>

        {savedPlaces.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 mb-4">You haven't saved any places yet.</p>
            <Link
              href="/home"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Explore places to save
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedPlaces.map((saved) => (
              <div key={saved.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <Link href={`/places/${saved.place.id}`}>
                    <h3 className="font-semibold text-lg hover:text-indigo-600">
                      {saved.place.name}
                    </h3>
                  </Link>
                  <button
                    onClick={() => handleUnsave(saved.place.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Remove from saved"
                  >
                    ✕
                  </button>
                </div>

                {saved.place.locality && (
                  <p className="text-sm text-gray-600 mb-2">{saved.place.locality}</p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                    {saved.place.category.name}
                  </span>
                  <span>{saved.place._count.posts} posts</span>
                </div>

                {saved.place.description && (
                  <p className="text-sm text-gray-700 mb-3">
                    {saved.place.description}
                  </p>
                )}

                <p className="text-xs text-gray-500">
                  {saved.place.city.name}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
