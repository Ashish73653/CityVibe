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

export default function PlaceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [place, setPlace] = useState<Place | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any>({});
  const [newComment, setNewComment] = useState<{ [key: number]: string }>({});

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
      setComments({ ...comments, [postId]: data.comments });
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  }

  async function handleComment(postId: number) {
    const content = newComment[postId];
    if (!content) return;

    try {
      await fetch(`/api/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      setNewComment({ ...newComment, [postId]: '' });
      loadComments(postId);
      fetchPlace();
    } catch (error) {
      console.error('Failed to comment:', error);
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

  if (!place) {
    return (
      <>
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-600">Place not found</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{place.name}</h1>
              {place.locality && (
                <p className="text-gray-600">{place.locality}</p>
              )}
              {place.address && (
                <p className="text-sm text-gray-500">{place.address}</p>
              )}
            </div>
            <button
              onClick={handleSave}
              className={`px-4 py-2 rounded-md ${
                isSaved
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {isSaved ? 'Saved ❤️' : 'Save Place'}
            </button>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm">
              {place.category.name}
            </span>
            <span className="text-sm text-gray-600">
              {place.city.name}
              {place.city.state && `, ${place.city.state}`}
            </span>
          </div>

          {place.description && (
            <p className="text-gray-700 mb-4">{place.description}</p>
          )}

          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <span>📝 {place._count.posts} recommendations</span>
            <span>❤️ {place._count.savedBy} saves</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommendations</h2>

        {place.posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600 mb-4">No recommendations yet.</p>
            <Link
              href="/upload"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Be the first to recommend this place!
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {place.posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{post.user.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {post.budgetEstimate && (
                    <span className="text-green-600 font-medium">
                      ₹{post.budgetEstimate}
                    </span>
                  )}
                </div>

                <p className="text-gray-700 mb-4">{post.caption}</p>

                <div className="flex items-center space-x-6 mb-4 text-sm text-gray-600">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center space-x-1 hover:text-indigo-600"
                  >
                    <span>🤍</span>
                    <span>{post._count.likes}</span>
                  </button>
                  <button
                    onClick={() => loadComments(post.id)}
                    className="flex items-center space-x-1 hover:text-indigo-600"
                  >
                    <span>💬</span>
                    <span>{post._count.comments}</span>
                  </button>
                </div>

                {comments[post.id] && (
                  <div className="border-t pt-4 mt-4 space-y-3">
                    {comments[post.id].map((comment: any) => (
                      <div key={comment.id} className="text-sm">
                        <p className="font-medium">{comment.user.name}</p>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex space-x-2 mt-4">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={newComment[post.id] || ''}
                    onChange={(e) =>
                      setNewComment({ ...newComment, [post.id]: e.target.value })
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                  />
                  <button
                    onClick={() => handleComment(post.id)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700"
                  >
                    Post
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
