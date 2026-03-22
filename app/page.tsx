import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import Navigation from '@/components/Navigation';
import Link from 'next/link';

export default async function Home() {
  const user = await getSession();

  if (user) {
    redirect('/home');
  }

  return (
    <>
      <Navigation />
      <main className="flex-1">
        <div className="bg-gradient-to-b from-indigo-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                Discover Your City Like Never Before
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                CityVibe is your hyperlocal discovery platform for Tier 2 and Tier 3 Indian cities.
                Find the best food spots, cafes, study places, date ideas, and hidden gems through
                community recommendations.
              </p>
              <div className="flex justify-center space-x-4">
                <Link
                  href="/auth/signup"
                  className="bg-indigo-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-indigo-700"
                >
                  Get Started
                </Link>
                <Link
                  href="/auth/login"
                  className="bg-white text-indigo-600 px-8 py-3 rounded-md text-lg font-medium border-2 border-indigo-600 hover:bg-indigo-50"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What You Can Discover
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🍔</div>
              <h3 className="text-xl font-semibold mb-2">Food & Cafes</h3>
              <p className="text-gray-600">
                Find the best local restaurants, street food, and cozy cafes recommended by your community.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">Study Spots</h3>
              <p className="text-gray-600">
                Discover quiet cafes and libraries perfect for studying or working remotely.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">💑</div>
              <h3 className="text-xl font-semibold mb-2">Date Ideas</h3>
              <p className="text-gray-600">
                Explore romantic spots and fun activities perfect for couples and friends.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🏃</div>
              <h3 className="text-xl font-semibold mb-2">Sports & Activities</h3>
              <p className="text-gray-600">
                Find sports grounds, parks, and recreational areas for fitness and fun.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-semibold mb-2">Hidden Gems</h3>
              <p className="text-gray-600">
                Uncover lesser-known amazing places that only locals know about.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">Budget Options</h3>
              <p className="text-gray-600">
                Get budget estimates and find affordable hangout spots for students.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-indigo-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Explore?</h2>
            <p className="text-xl mb-8">
              Join CityVibe today and start discovering the best of your city!
            </p>
            <Link
              href="/auth/signup"
              className="bg-white text-indigo-600 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-100 inline-block"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
