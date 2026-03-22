'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';

interface Place {
  id: number;
  name: string;
  cityId: number;
  categoryId: number;
}

export default function UploadPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [placeId, setPlaceId] = useState('');
  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [budgetEstimate, setBudgetEstimate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchPlaces();
  }, []);

  async function fetchPlaces() {
    try {
      const userRes = await fetch('/api/user/me');
      const userData = await userRes.json();

      if (!userData.user || !userData.user.selectedCityId) {
        router.push('/select-city');
        return;
      }

      const feedRes = await fetch(`/api/feed?cityId=${userData.user.selectedCityId}&limit=100`);
      const feedData = await feedRes.json();

      const uniquePlaces = new Map<number, Place>();
      feedData.posts.forEach((post: any) => {
        if (!uniquePlaces.has(post.place.id)) {
          uniquePlaces.set(post.place.id, {
            id: post.place.id,
            name: post.place.name,
            cityId: post.cityId,
            categoryId: post.categoryId,
          });
        }
      });

      setPlaces(Array.from(uniquePlaces.values()));
    } catch (err) {
      console.error('Failed to fetch places:', err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!placeId || !caption || !file) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('placeId', placeId);
      formData.append('caption', caption);
      formData.append('file', file);
      if (tags) formData.append('tags', tags);
      if (budgetEstimate) formData.append('budgetEstimate', budgetEstimate);

      const res = await fetch('/api/posts', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to upload post');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/home');
      }, 2000);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  }

  return (
    <>
      <Navigation />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Upload Recommendation
        </h1>

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-md bg-green-50 p-4">
              <p className="text-sm text-green-800">
                Post uploaded successfully! Redirecting...
              </p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="place" className="block text-sm font-medium text-gray-700 mb-2">
                Place *
              </label>
              <select
                id="place"
                required
                value={placeId}
                onChange={(e) => setPlaceId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">Select a place</option>
                {places.map((place) => (
                  <option key={place.id} value={place.id}>
                    {place.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
                Image or Video *
              </label>
              <input
                type="file"
                id="file"
                accept="image/*,video/*"
                required
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-2">
                Caption *
              </label>
              <textarea
                id="caption"
                required
                rows={4}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Share your experience..."
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags (optional)
              </label>
              <input
                type="text"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="e.g., cozy, affordable, must-try"
              />
            </div>

            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                Budget Estimate (optional)
              </label>
              <input
                type="number"
                id="budget"
                value={budgetEstimate}
                onChange={(e) => setBudgetEstimate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Approximate cost in ₹"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Uploading...' : 'Upload Post'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
