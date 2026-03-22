'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navigation from '@/components/Navigation';

interface Place {
  id: number;
  name: string;
  cityId: number;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

type PlaceMode = 'existing' | 'new';

const suggestedTags = ['budget', 'date-night', 'study-friendly', 'street-food', 'family', 'weekend'];

export default function UploadPage() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);

  const [placeMode, setPlaceMode] = useState<PlaceMode>('existing');
  const [placeId, setPlaceId] = useState('');
  const [placeSearch, setPlaceSearch] = useState('');

  const [newPlaceName, setNewPlaceName] = useState('');
  const [newPlaceCategoryId, setNewPlaceCategoryId] = useState('');
  const [newPlaceLocality, setNewPlaceLocality] = useState('');
  const [newPlaceAddress, setNewPlaceAddress] = useState('');
  const [newPlaceDescription, setNewPlaceDescription] = useState('');

  const [caption, setCaption] = useState('');
  const [tags, setTags] = useState('');
  const [budgetEstimate, setBudgetEstimate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    bootstrap();
    loadDraft();
  }, []);

  useEffect(() => {
    const mode = searchParams.get('mode');
    const categoryId = searchParams.get('categoryId');

    if (mode === 'new') {
      setPlaceMode('new');
    }

    if (categoryId && !Number.isNaN(parseInt(categoryId, 10))) {
      setNewPlaceCategoryId(categoryId);
    }
  }, [searchParams]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    const draft = JSON.stringify({
      placeMode,
      placeId,
      placeSearch,
      newPlaceName,
      newPlaceCategoryId,
      newPlaceLocality,
      newPlaceAddress,
      newPlaceDescription,
      caption,
      tags,
      budgetEstimate,
    });
    localStorage.setItem('cv:uploadDraft', draft);
  }, [
    placeMode,
    placeId,
    placeSearch,
    newPlaceName,
    newPlaceCategoryId,
    newPlaceLocality,
    newPlaceAddress,
    newPlaceDescription,
    caption,
    tags,
    budgetEstimate,
  ]);

  async function bootstrap() {
    try {
      const userRes = await fetch('/api/user/me');
      const userData = await userRes.json();

      if (!userData.user || !userData.user.selectedCityId) {
        router.push('/select-city');
        return;
      }

      setSelectedCityId(userData.user.selectedCityId);

      const [placesRes, categoriesRes] = await Promise.all([
        fetch(`/api/places?cityId=${userData.user.selectedCityId}`),
        fetch('/api/categories'),
      ]);

      const [placesData, categoriesData] = await Promise.all([
        placesRes.json(),
        categoriesRes.json(),
      ]);

      setPlaces(placesData.places || []);
      setCategories(categoriesData.categories || []);
    } catch (err) {
      console.error('Failed to prepare upload form:', err);
    }
  }

  function loadDraft() {
    const rawDraft = localStorage.getItem('cv:uploadDraft');
    if (!rawDraft) return;

    try {
      const draft = JSON.parse(rawDraft) as {
        placeMode?: PlaceMode;
        placeId?: string;
        placeSearch?: string;
        newPlaceName?: string;
        newPlaceCategoryId?: string;
        newPlaceLocality?: string;
        newPlaceAddress?: string;
        newPlaceDescription?: string;
        caption?: string;
        tags?: string;
        budgetEstimate?: string;
      };

      if (draft.placeMode === 'existing' || draft.placeMode === 'new') {
        setPlaceMode(draft.placeMode);
      }
      setPlaceId(draft.placeId || '');
      setPlaceSearch(draft.placeSearch || '');
      setNewPlaceName(draft.newPlaceName || '');
      setNewPlaceCategoryId(draft.newPlaceCategoryId || '');
      setNewPlaceLocality(draft.newPlaceLocality || '');
      setNewPlaceAddress(draft.newPlaceAddress || '');
      setNewPlaceDescription(draft.newPlaceDescription || '');
      setCaption(draft.caption || '');
      setTags(draft.tags || '');
      setBudgetEstimate(draft.budgetEstimate || '');
    } catch {
      // Ignore malformed draft data
    }
  }

  function setSelectedFile(nextFile: File | null) {
    setFile(nextFile);

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }

    if (nextFile) {
      setPreviewUrl(URL.createObjectURL(nextFile));
    }
  }

  async function createPlaceIfNeeded(): Promise<number | null> {
    if (placeMode === 'existing') {
      return placeId ? parseInt(placeId, 10) : null;
    }

    if (!newPlaceName || !newPlaceCategoryId) {
      setError('Please provide new place name and category.');
      return null;
    }

    const res = await fetch('/api/places', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newPlaceName,
        categoryId: parseInt(newPlaceCategoryId, 10),
        locality: newPlaceLocality || undefined,
        address: newPlaceAddress || undefined,
        description: newPlaceDescription || undefined,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.error || 'Failed to create place');
      return null;
    }

    const createdPlace = data.place as Place;
    setPlaces((current) => [createdPlace, ...current]);
    return createdPlace.id;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!caption || !file) {
      setError('Please add a caption and media file.');
      return;
    }

    if (caption.trim().length < 12) {
      setError('Caption should be at least 12 characters to be useful.');
      return;
    }

    setLoading(true);

    try {
      const resolvedPlaceId = await createPlaceIfNeeded();
      if (!resolvedPlaceId) {
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('placeId', String(resolvedPlaceId));
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
        setError(data.error || 'Failed to upload recommendation');
        setLoading(false);
        return;
      }

      localStorage.removeItem('cv:uploadDraft');
      setSuccess(true);
      setTimeout(() => {
        router.push('/home');
      }, 1400);
    } catch {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  }

  const filteredPlaces = useMemo(() => {
    if (!placeSearch.trim()) return places;
    const query = placeSearch.toLowerCase();
    return places.filter((place) => place.name.toLowerCase().includes(query));
  }, [places, placeSearch]);

  const selectedPlaceName = places.find((place) => place.id.toString() === placeId)?.name;
  const isVideo = file?.type.startsWith('video/');

  return (
    <>
      <Navigation />
      <main className="cv-shell py-6 md:py-8 cv-enter">
        <section className="cv-card p-5 md:p-7">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8c7a5f]">Create recommendation</p>
              <h1 className="mt-1 text-3xl font-black tracking-tight text-[#1f1d1a]">Upload a new post</h1>
              <p className="mt-2 text-sm cv-muted">You can post to an existing place or create a new place instantly.</p>
            </div>
            <button
              onClick={() => {
                setPlaceMode('existing');
                setPlaceId('');
                setPlaceSearch('');
                setNewPlaceName('');
                setNewPlaceCategoryId('');
                setNewPlaceLocality('');
                setNewPlaceAddress('');
                setNewPlaceDescription('');
                setCaption('');
                setTags('');
                setBudgetEstimate('');
                setSelectedFile(null);
                localStorage.removeItem('cv:uploadDraft');
              }}
              className="rounded-xl border border-neutral-900/14 bg-white px-3 py-2 text-sm font-semibold text-[#4d453b]"
            >
              Clear draft
            </button>
          </div>

          {error && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          {success && <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">Recommendation posted successfully. Redirecting...</div>}

          <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div>
                <p className="mb-1.5 text-sm font-semibold text-[#302a23]">Where do you want to post?</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setPlaceMode('existing')}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${placeMode === 'existing' ? 'bg-[#1f1d1a] text-[#f8f5ef]' : 'border border-neutral-900/14 bg-white text-[#4d453b]'}`}
                  >
                    Existing place
                  </button>
                  <button
                    type="button"
                    onClick={() => setPlaceMode('new')}
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${placeMode === 'new' ? 'bg-[#1f1d1a] text-[#f8f5ef]' : 'border border-neutral-900/14 bg-white text-[#4d453b]'}`}
                  >
                    Add new place
                  </button>
                </div>
              </div>

              {placeMode === 'existing' ? (
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#302a23]">Select place *</label>
                  <input
                    value={placeSearch}
                    onChange={(e) => setPlaceSearch(e.target.value)}
                    placeholder="Search place"
                    className="cv-field"
                  />
                  <select
                    value={placeId}
                    onChange={(e) => setPlaceId(e.target.value)}
                    required={placeMode === 'existing'}
                    className="cv-field mt-2"
                  >
                    <option value="">Choose a place</option>
                    {filteredPlaces.map((place) => (
                      <option key={place.id} value={place.id}>
                        {place.name}
                      </option>
                    ))}
                  </select>
                  {filteredPlaces.length === 0 && (
                    <p className="mt-2 text-xs cv-muted">No place found. Switch to Add new place.</p>
                  )}
                  <button
                    type="button"
                    onClick={() => setPlaceMode('new')}
                    className="mt-3 rounded-lg border border-neutral-900/14 bg-white px-3 py-2 text-xs font-semibold text-[#4d453b]"
                  >
                    Can't find place? Create it now
                  </button>
                </div>
              ) : (
                <div className="space-y-3 rounded-xl border border-neutral-900/12 bg-[#fffdf8] p-4">
                  <label className="block text-sm font-semibold text-[#302a23]">New place name *</label>
                  <input
                    value={newPlaceName}
                    onChange={(e) => setNewPlaceName(e.target.value)}
                    className="cv-field"
                    placeholder="e.g., Lakeview Chai Point"
                    required={placeMode === 'new'}
                  />

                  <label className="block text-sm font-semibold text-[#302a23]">Category *</label>
                  <select
                    value={newPlaceCategoryId}
                    onChange={(e) => setNewPlaceCategoryId(e.target.value)}
                    className="cv-field"
                    required={placeMode === 'new'}
                  >
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>

                  <label className="block text-sm font-semibold text-[#302a23]">Locality</label>
                  <input
                    value={newPlaceLocality}
                    onChange={(e) => setNewPlaceLocality(e.target.value)}
                    className="cv-field"
                    placeholder="Area / neighborhood"
                  />

                  <label className="block text-sm font-semibold text-[#302a23]">Address</label>
                  <input
                    value={newPlaceAddress}
                    onChange={(e) => setNewPlaceAddress(e.target.value)}
                    className="cv-field"
                    placeholder="Landmark or full address"
                  />

                  <label className="block text-sm font-semibold text-[#302a23]">Place description</label>
                  <textarea
                    value={newPlaceDescription}
                    onChange={(e) => setNewPlaceDescription(e.target.value)}
                    className="cv-field"
                    rows={3}
                    placeholder="Short description of the place"
                  />
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#302a23]">Caption *</label>
                <textarea
                  rows={5}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="cv-field"
                  placeholder="What should someone know before visiting this place?"
                  required
                />
                <p className="mt-1 text-xs cv-muted">{caption.length} characters</p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#302a23]">Tags</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="cv-field"
                  placeholder="budget, cozy, rooftop"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  {suggestedTags.map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => {
                        if (!tags.includes(tag)) {
                          setTags(tags ? `${tags}, ${tag}` : tag);
                        }
                      }}
                      className="rounded-full border border-neutral-900/14 bg-white px-2.5 py-1 text-xs font-semibold text-[#4d453b]"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#302a23]">Budget estimate</label>
                <input
                  type="number"
                  min={0}
                  value={budgetEstimate}
                  onChange={(e) => setBudgetEstimate(e.target.value)}
                  className="cv-field"
                  placeholder="Approximate cost in Rs"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const droppedFile = e.dataTransfer.files?.[0] || null;
                  setSelectedFile(droppedFile);
                }}
                className={`rounded-2xl border-2 border-dashed p-4 transition ${isDragging ? 'border-[#a8770f] bg-[#f9f2e2]' : 'border-neutral-900/18 bg-white'}`}
              >
                <p className="text-sm font-semibold text-[#302a23]">Media *</p>
                <p className="mt-1 text-xs cv-muted">Drag and drop image/video or choose manually.</p>

                <input
                  type="file"
                  accept="image/*,video/*"
                  required={!file}
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="mt-3 w-full rounded-lg border border-neutral-900/12 px-3 py-2 text-sm"
                />

                {file && (
                  <div className="mt-3 rounded-xl border border-neutral-900/12 bg-[#f7f3ea] p-3 text-xs text-[#4d453b]">
                    <p className="font-semibold">{file.name}</p>
                    <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                )}

                {previewUrl && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-neutral-900/12 bg-black/5">
                    {isVideo ? (
                      <video src={previewUrl} className="h-48 w-full object-cover" controls />
                    ) : (
                      <img src={previewUrl} alt="Preview" className="h-48 w-full object-cover" />
                    )}
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-neutral-900/12 bg-[#fffdf9] p-4 text-sm">
                <p className="font-bold text-[#302a23]">Preview summary</p>
                <p className="mt-1 cv-muted">City ID: {selectedCityId || 'Not selected'}</p>
                <p className="cv-muted">
                  Place: {placeMode === 'existing' ? selectedPlaceName || 'Not selected' : newPlaceName || 'New place not filled'}
                </p>
                <p className="cv-muted">Budget: {budgetEstimate ? `Rs. ${budgetEstimate}` : 'Not added'}</p>
                <p className="cv-muted">Type: {file ? (isVideo ? 'Video post' : 'Image post') : 'No file selected'}</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="cv-button-primary w-full py-3 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Publishing...' : 'Publish recommendation'}
              </button>
            </div>
          </form>
        </section>
      </main>
    </>
  );
}
