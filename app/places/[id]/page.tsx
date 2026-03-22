'use client';

import { useState, useEffect, use } from 'react';
import Navigation from '@/components/Navigation';
import Link from 'next/link';

interface Place {
  id: number;
  name: string;
  locality: string | null;
  address: string | null;
  description: string | null;
  city: { id: number; name: string; state: string | null };
  category: { id: number; name: string; slug: string };
  posts: Array<{
    id: number;
    caption: string;
    mediaUrl: string;
    mediaType: 'IMAGE' | 'VIDEO';
    budgetEstimate: number | null;
    createdAt: string;
    user: { id: number; name: string };
    _count: { likes: number; comments: number };
  }>;
  _count: { posts: number; savedBy: number };
}

type Tab = 'overview' | 'recommendations';

export default function PlaceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [place, setPlace] = useState<Place | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Record<number, Array<{ id: number; content: string; user: { name: string } }>>>({});
  const [newComment, setNewComment] = useState<Record<number, string>>({});
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  useEffect(() => {
    fetchPlace();
  }, [id]);

  async function fetchPlace() {
    try {
      const res = await fetch(`/api/places/${id}`);
      const data = await res.json();

      if (res.ok) {
        setPlace(data.place);
        setIsSaved(data.isSaved);
      }
    } catch (error) {
      console.error('Failed to fetch place:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      await fetch(`/api/places/${id}/save`, { method: 'POST' });
      setIsSaved(!isSaved);
    } catch (error) {
      console.error('Failed to save place:', error);
    }
  }

  async function handleLike(postId: number) {
    try {
      await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
      fetchPlace();
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  }

  async function loadComments(postId: number) {
    try {
      const res = await fetch(`/api/posts/${postId}/comment`);
      const data = await res.json();
      setComments((current) => ({ ...current, [postId]: data.comments }));
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  }

  async function handleComment(postId: number) {
    const content = newComment[postId];
    if (!content?.trim()) return;

    try {
      await fetch(`/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      setNewComment((current) => ({ ...current, [postId]: '' }));
      loadComments(postId);
      fetchPlace();
    } catch (error) {
      console.error('Failed to comment:', error);
    }
  }

  function handleShare() {
    const shareUrl = window.location.href;
    if (navigator.share) {
      navigator.share({ title: place?.name || 'Place details', url: shareUrl }).catch(() => {});
      return;
    }

    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Link copied to clipboard');
    });
  }

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="cv-shell py-8">
          <div className="cv-card h-48 animate-pulse bg-[#f3e9d3]" />
        </div>
      </>
    );
  }

  if (!place) {
    return (
      <>
        <Navigation />
        <div className="cv-shell py-14 text-center">
          <p className="text-base cv-muted">Place not found</p>
          <Link href="/home" className="mt-3 inline-flex rounded-xl bg-[#1f1d1a] px-4 py-2 text-sm font-bold text-[#f8f5ef]">
            Back to home
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="cv-shell py-6 md:py-8 cv-enter">
        <section className="cv-card overflow-hidden">
          <div className="h-56 bg-gradient-to-br from-[#eed6ab] via-[#f7e9cf] to-[#e5c4b6] md:h-72" />
          <div className="p-5 md:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8c7a5f]">Place details</p>
                <h1 className="mt-1 text-3xl font-black text-[#1f1d1a] md:text-4xl">{place.name}</h1>
                <p className="mt-1 text-sm cv-muted">{place.locality || place.city.name}</p>
                {place.address && <p className="mt-1 text-sm cv-muted">{place.address}</p>}
              </div>

              <div className="flex flex-wrap gap-2">
                <button onClick={handleSave} className={`rounded-xl px-4 py-2 text-sm font-bold ${isSaved ? 'bg-[#1f1d1a] text-[#f8f5ef]' : 'cv-button-primary'}`}>
                  {isSaved ? 'Saved' : 'Save place'}
                </button>
                <button onClick={handleShare} className="rounded-xl border border-neutral-900/14 bg-white px-4 py-2 text-sm font-bold text-[#4d453b]">
                  Share
                </button>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name} ${place.city.name}`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-neutral-900/14 bg-white px-4 py-2 text-sm font-bold text-[#4d453b]"
                >
                  Open Maps
                </a>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-full bg-[#f3dfb1] px-2.5 py-1 font-bold text-[#6a4a0c]">{place.category.name}</span>
              <span className="rounded-full border border-neutral-900/14 bg-white px-2.5 py-1 font-semibold text-[#4d453b]">
                {place.city.name}{place.city.state ? `, ${place.city.state}` : ''}
              </span>
              <span className="rounded-full border border-neutral-900/14 bg-white px-2.5 py-1 font-semibold text-[#4d453b]">
                {place._count.posts} recommendations
              </span>
              <span className="rounded-full border border-neutral-900/14 bg-white px-2.5 py-1 font-semibold text-[#4d453b]">
                {place._count.savedBy} saves
              </span>
            </div>

            {place.description && <p className="mt-4 max-w-3xl text-sm leading-relaxed text-[#4b4338]">{place.description}</p>}
          </div>
        </section>

        <section className="mt-5 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${activeTab === 'overview' ? 'bg-[#1f1d1a] text-[#f8f5ef]' : 'border border-neutral-900/14 bg-white text-[#4d453b]'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`rounded-xl px-4 py-2 text-sm font-semibold ${activeTab === 'recommendations' ? 'bg-[#1f1d1a] text-[#f8f5ef]' : 'border border-neutral-900/14 bg-white text-[#4d453b]'}`}
          >
            Recommendations
          </button>
        </section>

        {activeTab === 'overview' && (
          <section className="mt-4 grid gap-4 md:grid-cols-3">
            <article className="cv-card p-4">
              <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#8c7a5f]">Best for</p>
              <p className="mt-2 text-sm text-[#4d453b]">Friends, date plans, and casual evening hangouts.</p>
            </article>
            <article className="cv-card p-4">
              <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#8c7a5f]">Budget level</p>
              <p className="mt-2 text-sm text-[#4d453b]">Mostly affordable with flexible spending options.</p>
            </article>
            <article className="cv-card p-4">
              <p className="text-xs font-bold uppercase tracking-[0.13em] text-[#8c7a5f]">Peak time</p>
              <p className="mt-2 text-sm text-[#4d453b]">Evenings and weekends usually have the best vibe.</p>
            </article>
          </section>
        )}

        {activeTab === 'recommendations' && (
          <section className="mt-4 space-y-4">
            {place.posts.length === 0 ? (
              <div className="cv-card p-8 text-center">
                <p className="text-base cv-muted">No recommendations yet.</p>
                <Link href="/upload" className="mt-3 inline-flex rounded-xl bg-[#1f1d1a] px-4 py-2 text-sm font-bold text-[#f8f5ef]">
                  Add first recommendation
                </Link>
              </div>
            ) : (
              place.posts.map((post) => (
                <article key={post.id} className="cv-card overflow-hidden">
                  <div className="grid gap-0 md:grid-cols-[220px_1fr]">
                    <div className="h-44 bg-gradient-to-br from-[#f1dcb2] via-[#f8eedd] to-[#cfdae7] md:h-full" />

                    <div className="p-4 md:p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold text-[#1f1d1a]">{post.user.name}</p>
                          <p className="text-xs cv-muted">{new Date(post.createdAt).toLocaleDateString()}</p>
                        </div>
                        {post.budgetEstimate && (
                          <span className="rounded-full bg-[#f3dfb1] px-2.5 py-1 text-xs font-bold text-[#6a4a0c]">
                            Rs. {post.budgetEstimate}
                          </span>
                        )}
                      </div>

                      <p className="mt-3 text-sm leading-relaxed text-[#4b4338]">{post.caption}</p>

                      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                        <button onClick={() => handleLike(post.id)} className="font-semibold text-[#3f382f] hover:text-[#8f650c]">
                          Like {post._count.likes}
                        </button>
                        <button onClick={() => loadComments(post.id)} className="font-semibold text-[#3f382f] hover:text-[#8f650c]">
                          Comments {post._count.comments}
                        </button>
                      </div>

                      {comments[post.id] && (
                        <div className="mt-3 space-y-2 rounded-xl border border-neutral-900/10 bg-[#fffdf8] p-3">
                          {comments[post.id].length === 0 && <p className="text-sm cv-muted">No comments yet.</p>}
                          {comments[post.id].map((comment) => (
                            <div key={comment.id} className="text-sm">
                              <p className="font-semibold text-[#302a23]">{comment.user.name}</p>
                              <p className="text-[#4b4338]">{comment.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-3 flex gap-2">
                        <input
                          type="text"
                          placeholder="Add a comment"
                          value={newComment[post.id] || ''}
                          onChange={(e) => setNewComment((current) => ({ ...current, [post.id]: e.target.value }))}
                          className="cv-field"
                        />
                        <button onClick={() => handleComment(post.id)} className="cv-button-primary px-4">
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </section>
        )}
      </main>
    </>
  );
}
