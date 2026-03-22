'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';

interface Post {
  id: number;
  caption: string;
  mediaUrl: string;
  isHidden: boolean;
  createdAt: string;
  user: { id: number; name: string; email: string };
  place: { id: number; name: string };
  city: { id: number; name: string };
  category: { id: number; name: string };
  _count: { likes: number; comments: number; reports: number };
}

interface Report {
  id: number;
  reason: string;
  createdAt: string;
  reporter: { id: number; name: string; email: string };
  post: {
    id: number;
    caption: string;
    mediaUrl: string;
    isHidden: boolean;
    user: { id: number; name: string };
  } | null;
}

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'reports'>('posts');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  async function fetchData() {
    try {
      if (activeTab === 'posts') {
        const res = await fetch('/api/admin/posts');

        if (res.status === 403) {
          router.push('/home');
          return;
        }

        const data = await res.json();
        setPosts(data.posts);
      } else {
        const res = await fetch('/api/admin/reports');

        if (res.status === 403) {
          router.push('/home');
          return;
        }

        const data = await res.json();
        setReports(data.reports);
      }
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  async function handleHidePost(postId: number) {
    try {
      await fetch(`/api/admin/posts/${postId}/hide`, { method: 'POST' });
      fetchData();
    } catch (err) {
      setError('Failed to hide post');
    }
  }

  async function handleDeletePost(postId: number) {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await fetch(`/api/admin/posts/${postId}/delete`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      setError('Failed to delete post');
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
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'posts'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Posts ({posts.length})
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'reports'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reports ({reports.length})
            </button>
          </nav>
        </div>

        {activeTab === 'posts' ? (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Post
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Place
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Stats
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {post.caption}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{post.user.name}</div>
                      <div className="text-xs text-gray-500">{post.user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{post.place.name}</div>
                      <div className="text-xs text-gray-500">{post.city.name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div>❤️ {post._count.likes}</div>
                      <div>💬 {post._count.comments}</div>
                      {post._count.reports > 0 && (
                        <div className="text-red-600">⚠️ {post._count.reports} reports</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          post.isHidden
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {post.isHidden ? 'Hidden' : 'Visible'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      {!post.isHidden && (
                        <button
                          onClick={() => handleHidePost(post.id)}
                          className="text-yellow-600 hover:text-yellow-700"
                        >
                          Hide
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      Reported by {report.reporter.name}
                    </p>
                    <p className="text-sm text-gray-500">{report.reporter.email}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {report.post && (
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        report.post.isHidden
                          ? 'bg-red-100 text-red-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {report.post.isHidden ? 'Hidden' : 'Visible'}
                    </span>
                  )}
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Reason:</p>
                  <p className="text-sm text-gray-900">{report.reason}</p>
                </div>

                {report.post && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Reported Post:</p>
                    <p className="text-sm text-gray-900 mb-2">{report.post.caption}</p>
                    <p className="text-xs text-gray-500">By {report.post.user.name}</p>
                    <div className="mt-4 space-x-2">
                      {!report.post.isHidden && (
                        <button
                          onClick={() => handleHidePost(report.post!.id)}
                          className="text-sm text-yellow-600 hover:text-yellow-700"
                        >
                          Hide Post
                        </button>
                      )}
                      <button
                        onClick={() => handleDeletePost(report.post!.id)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Delete Post
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
