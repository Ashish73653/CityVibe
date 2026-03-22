'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [name, setName] = useState('');
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
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Signup failed');
        setLoading(false);
        return;
      }

      router.push('/select-city');
    } catch {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  }

  return (
    <main className="cv-shell flex min-h-[calc(100vh-2rem)] items-center py-6 md:py-10">
      <div className="cv-card grid w-full overflow-hidden md:grid-cols-[1fr_1fr]">
        <section className="hidden bg-gradient-to-br from-[#d5a33b] to-[#be8821] p-9 text-[#2a2118] md:block">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#5a3f15]">Join CityVibe</p>
          <h1 className="mt-3 text-4xl font-black leading-tight">Local plans, real places, better weekends.</h1>
          <p className="mt-4 max-w-sm text-sm text-[#4d3b1f]">
            Build your city profile, discover underrated spots, and share recommendations that actually help people nearby.
          </p>
        </section>

        <section className="p-6 md:p-9">
          <div className="mb-7">
            <h2 className="text-3xl font-black tracking-tight text-[#1f1d1a]">Create account</h2>
            <p className="mt-2 text-sm cv-muted">
              Already registered?{' '}
              <Link href="/auth/login" className="font-bold text-[#a8770f] hover:text-[#8f650c]">
                Sign in here
              </Link>
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
            )}

            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-semibold text-[#302a23]">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="cv-field"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

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
                autoComplete="new-password"
                required
                className="cv-field"
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" disabled={loading} className="cv-button-primary mt-2 w-full disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
