'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import Link from 'next/link';

interface Post {
  id: number;
  caption: string;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO';
  tags: string | null;
  budgetEstimate: number | null;
  createdAt: string;
  user: { id: number; name: string };
  place: { id: number; name: string; locality: string | null };
  category: { id: number; name: string; slug: string };
  _count: { likes: number; comments: number };
}

interface User {
  id: number;
  name: string;
  selectedCityId: number | null;
  selectedCity: { id: number; name: string } | null;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const router = useRouter();

  useEffect(() => {
    fetchUser();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (user?.selectedCityId) {
      fetchPosts();
    }
  }, [user, selectedCategory]);

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
      setCategories(data.categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }

  async function fetchPosts() {
    if (!user?.selectedCityId) return;

    try {
      const params = new URLSearchParams({
        cityId: user.selectedCityId.toString(),
        ...(selectedCategory && { categoryId: selectedCategory.toString() }),
      });

      const res = await fetch(`/api/feed?${params}`);
      const data = await res.json();
      setPosts(data.posts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLike(postId: number) {
    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
      const data = await res.json();

      if (data.liked) {
        setLikedPosts(new Set([...likedPosts, postId]));
      } else {
        const newLikedPosts = new Set(likedPosts);
        newLikedPosts.delete(postId);
        setLikedPosts(newLikedPosts);
      }

      fetchPosts();
    } catch (error) {
      console.error('Failed to like post:', error);
    }
  }

  if (loading || !user) {
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Discover {user.selectedCity?.name}
          </h1>
          <p className="text-gray-600">
            Explore the best places and recommendations in your city
          </p>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-md ${
              selectedCategory === null
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-md ${
                selectedCategory === category.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No posts found in this city yet.</p>
            <Link
              href="/upload"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Be the first to share a recommendation!
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Link href={`/places/${post.place.id}`}>
                  {post.mediaType === 'IMAGE' ? (
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">📷 Image</span>
                    </div>
                  ) : (
                    <div className="h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">🎥 Video</span>
                    </div>
                  )}
                </Link>
                <div className="p-4">
                  <Link href={`/places/${post.place.id}`}>
                    <h3 className="font-semibold text-lg mb-1 hover:text-indigo-600">
                      {post.place.name}
                    </h3>
                  </Link>
                  {post.place.locality && (
                    <p className="text-sm text-gray-600 mb-2">{post.place.locality}</p>
                  )}
                  <p className="text-gray-700 text-sm mb-3">{post.caption}</p>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="flex items-center space-x-1 hover:text-indigo-600"
                      >
                        <span>{likedPosts.has(post.id) ? '❤️' : '🤍'}</span>
                        <span>{post._count.likes}</span>
                      </button>
                      <span>💬 {post._count.comments}</span>
                    </div>
                    {post.budgetEstimate && (
                      <span className="text-green-600 font-medium">
                        ₹{post.budgetEstimate}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    by {post.user.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
