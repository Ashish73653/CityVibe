'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';

interface City {
  id: number;
  name: string;
  state: string | null;
}

export default function SelectCityPage() {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchCities();
  }, []);

  async function fetchCities() {
    try {
      const res = await fetch('/api/cities');
      const data = await res.json();
      setCities(data.cities);
    } catch (err) {
      setError('Failed to load cities');
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectCity() {
    if (!selectedCityId) {
      setError('Please select a city');
      return;
    }

    try {
      const res = await fetch('/api/user/select-city', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cityId: selectedCityId }),
      });

      if (!res.ok) {
        setError('Failed to select city');
        return;
      }

      router.push('/home');
    } catch (err) {
      setError('An error occurred');
    }
  }

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-600">Loading cities...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Select Your City
            </h2>
            <p className="text-gray-600">
              Choose your city to see local recommendations
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="bg-white shadow rounded-lg p-6">
            <div className="space-y-3">
              {cities.map((city) => (
                <label
                  key={city.id}
                  className="flex items-center p-4 border rounded-md cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="city"
                    value={city.id}
                    checked={selectedCityId === city.id}
                    onChange={() => setSelectedCityId(city.id)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-3 text-gray-900">
                    {city.name}
                    {city.state && (
                      <span className="text-gray-500 ml-1">({city.state})</span>
                    )}
                  </span>
                </label>
              ))}
            </div>

            <button
              onClick={handleSelectCity}
              disabled={!selectedCityId}
              className="mt-6 w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
