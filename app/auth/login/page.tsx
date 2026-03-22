'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        setLoading(false);
        return;
      }

      if (!data.user.selectedCityId) {
        router.push('/select-city');
      } else {
        router.push('/home');
      }
    } catch {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  }

  return (
    <main className="cv-shell flex min-h-[calc(100vh-2rem)] items-center py-6 md:py-10">
      <div className="cv-card grid w-full overflow-hidden md:grid-cols-[1fr_1fr]">
        <section className="hidden bg-gradient-to-br from-[#22201c] to-[#3a3227] p-9 text-[#f7f3ea] md:block">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#d9c8a4]">Welcome back</p>
          <h1 className="mt-3 text-4xl font-black leading-tight">Find what your city is really about.</h1>
          <p className="mt-4 max-w-sm text-sm text-[#e8dfcf]">
            Continue exploring local recommendations, trending places, and budget plans shared by creators near you.
          </p>
        </section>

        <section className="p-6 md:p-9">
          <div className="mb-7">
            <h2 className="text-3xl font-black tracking-tight text-[#1f1d1a]">Sign in</h2>
            <p className="mt-2 text-sm cv-muted">
              New to CityVibe?{' '}
              <Link href="/auth/signup" className="font-bold text-[#a8770f] hover:text-[#8f650c]">
                Create your account
              </Link>
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
            )}

            <div>
              <label htmlFor="email-address" className="mb-1.5 block text-sm font-semibold text-[#302a23]">
                Email
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="cv-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-[#302a23]">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="cv-field"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" disabled={loading} className="cv-button-primary mt-2 w-full disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
