import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navigation from '@/components/Navigation';
import { getSession } from '@/lib/auth';

const trustPoints = [
  '10,000+ local recommendations',
  '50+ city categories',
  'Built for Tier 2 and Tier 3 India',
  'Creator-driven discovery',
];

const whyCards = [
  {
    title: 'Real local recommendations',
    description: 'Discover places through short, honest posts from people who actually know your city.',
  },
  {
    title: 'Built for smaller cities',
    description: 'Designed for cities where generic discovery apps usually miss the real local gems.',
  },
  {
    title: 'Plans by mood and budget',
    description: 'From cheap date ideas to weekend hangouts, quickly find options that fit your plan.',
  },
  {
    title: 'Visual and fast to browse',
    description: 'Scan cards, save your picks, and build plans in minutes instead of endless searching.',
  },
];

const categoryCards = [
  { title: 'Food Spots', caption: 'Street food, cafes, and local must-try places', tone: 'from-[#f2d39f] to-[#f8edd9]', badge: 'Taste Map' },
  { title: 'Hidden Gems', caption: 'Lanes and corners locals love but apps ignore', tone: 'from-[#ccd5c1] to-[#eef2e8]', badge: 'Secret Picks' },
  { title: 'Date Ideas', caption: 'Cozy, aesthetic, and actually worth going to', tone: 'from-[#e8c3b5] to-[#f6e8e2]', badge: 'Date Ready' },
  { title: 'Study Cafes', caption: 'Quiet tables, plugs, and calm work-friendly vibes', tone: 'from-[#cad4df] to-[#ebf0f5]', badge: 'Work Calm' },
  { title: 'Events and Melas', caption: 'Festive picks and weekend city happenings nearby', tone: 'from-[#efb99f] to-[#faece4]', badge: 'Live Now' },
  { title: 'Budget Plans', caption: 'Under Rs. 300 ideas that still feel premium', tone: 'from-[#f4deaa] to-[#fcf4e2]', badge: 'Low Spend' },
  { title: 'Sports and Activities', caption: 'Grounds, courts, and city groups to stay active', tone: 'from-[#d0dbc4] to-[#edf3e5]', badge: 'Move More' },
  { title: 'Weekend Routes', caption: 'Short city loops built for half-day plans', tone: 'from-[#d3ddec] to-[#eef3fa]', badge: 'Weekend Plan' },
];

const cities = [
  { name: 'Krishnanagar', stats: '128 places · 34 events · 89 local videos', tags: 'Food · Melas · Cafes' },
  { name: 'Durgapur', stats: '176 places · 41 events · 105 local videos', tags: 'Hangouts · Date Plans · Sports' },
  { name: 'Siliguri', stats: '152 places · 27 events · 93 local videos', tags: 'Street Food · Parks · Hidden Gems' },
];

const featured = [
  { title: 'Best Momos Near College More', place: 'Krishnanagar', meta: 'Rs. 120 for two', by: 'Priya Das' },
  { title: 'Rooftop Cafe For Sunset Conversations', place: 'Durgapur', meta: 'Rs. 380 for two', by: 'Arjun Roy' },
  { title: 'Budget Study Cafe With Quiet Seating', place: 'Siliguri', meta: 'Rs. 220 per person', by: 'Mousumi Sen' },
];

const creators = [
  { name: 'Aditi Sen', city: 'Krishnanagar', specialty: 'Street Food, Cafes' },
  { name: 'Rohan Pal', city: 'Durgapur', specialty: 'Date Ideas, Weekend Plans' },
  { name: 'Neha Dutta', city: 'Siliguri', specialty: 'Study Spots, Hidden Gems' },
];

export default async function Home() {
  const user = await getSession();

  if (user) {
    redirect('/home');
  }

  return (
    <>
      <Navigation />
      <main className="flex-1 cv-enter">
        <section id="explore" className="cv-shell pt-8 pb-8 md:pt-12 md:pb-12">
          <div className="cv-card overflow-hidden border-neutral-900/15">
            <div className="grid gap-7 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-10">
              <div>
                <span className="cv-chip">Smart local discovery platform</span>
                <h1 className="mt-4 text-4xl font-black leading-tight text-[#1f1d1a] md:text-6xl">
                  Discover your city
                  <span className="block text-[#a8770f]">beyond the obvious.</span>
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-relaxed cv-muted md:text-lg">
                  Find food spots, hidden gems, local events, study cafes, and weekend plans through
                  real recommendations from people who actually know your city.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Link href="/auth/signup" className="cv-button-primary">
                    Start Exploring
                  </Link>
                  <Link href="/select-city" className="cv-button-secondary">
                    Browse Cities
                  </Link>
                </div>

                <div className="mt-5 rounded-2xl border border-neutral-900/10 bg-white p-2">
                  <input
                    aria-label="Search city or place"
                    className="w-full rounded-xl border border-neutral-900/10 px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-[rgba(200,148,32,0.2)]"
                    placeholder="Search cities, cafes, places, or events"
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] sm:grid-cols-4 sm:text-xs">
                  <span className="rounded-full border border-neutral-900/12 bg-white px-2.5 py-1.5 text-center font-semibold text-[#5a5045] sm:px-3">Food Spots</span>
                  <span className="rounded-full border border-neutral-900/12 bg-white px-2.5 py-1.5 text-center font-semibold text-[#5a5045] sm:px-3">Hidden Gems</span>
                  <span className="rounded-full border border-neutral-900/12 bg-white px-2.5 py-1.5 text-center font-semibold text-[#5a5045] sm:px-3">Events</span>
                  <span className="rounded-full border border-neutral-900/12 bg-white px-2.5 py-1.5 text-center font-semibold text-[#5a5045] sm:px-3">Weekend Plans</span>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -top-5 -right-5 h-24 w-24 rounded-full bg-[#d9a12a]/20 blur-2xl" />
                <div className="absolute -left-6 bottom-4 h-24 w-24 rounded-full bg-[#c7683b]/18 blur-2xl" />

                <div className="relative rounded-2xl border border-neutral-900/10 bg-gradient-to-br from-white to-[#f7efe0] p-4">
                  <div className="rounded-xl border border-neutral-900/10 bg-[#1f1d1a] p-4 text-[#f8f5ef]">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#e9d9b7]">Live Discovery</p>
                      <span className="rounded-full border border-[#f0dfbb]/35 px-2 py-0.5 text-[10px] font-bold">Trending</span>
                    </div>
                    <p className="mt-2 text-sm font-bold">Krishnanagar is hot this weekend</p>
                    <p className="text-sm text-[#d9cfbf]">Food lanes, fairground lights, and rooftop cafes.</p>
                  </div>

                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-neutral-900/10 bg-white p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7d7060]">City score</p>
                      <p className="mt-2 text-sm font-bold text-[#1f1d1a]">92% trusted local picks</p>
                      <p className="text-sm cv-muted">Verified by active contributors this week.</p>
                    </div>
                    <div className="rounded-xl border border-neutral-900/10 bg-white p-4">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7d7060]">Quick plan</p>
                      <p className="mt-2 text-sm font-bold text-[#1f1d1a]">4-stop evening route</p>
                      <p className="text-sm cv-muted">Cafe, walk, snack, and live music in one loop.</p>
                    </div>
                  </div>

                  <div className="mt-3 rounded-xl border border-neutral-900/10 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7d7060]">Brand lockup preview</p>
                    <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-[#f7f3ea] px-3 py-2">
                      <Image src="/CityVibe.png" alt="CityVibe icon" width={28} height={28} className="h-7 w-7 object-contain" />
                      <span className="text-sm font-black tracking-tight text-[#1f1d1a]">CityVibe</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="cv-shell pb-8">
          <div className="grid gap-3 rounded-2xl border border-neutral-900/10 bg-white p-4 md:grid-cols-4 md:p-5">
            {trustPoints.map((point) => (
              <div key={point} className="rounded-xl bg-[#f7f3ea] px-3 py-2 text-sm font-semibold text-[#3d382f]">
                {point}
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="cv-shell pb-12 md:pb-16">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <h2 className="cv-section-title text-[#1f1d1a]">Why CityVibe feels different</h2>
            <p className="text-sm font-semibold cv-muted">Local discovery, done right</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {whyCards.map((card) => (
              <article key={card.title} className="cv-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl md:p-6">
                <h3 className="text-lg font-extrabold text-[#1f1d1a]">{card.title}</h3>
                <p className="mt-2 text-sm leading-relaxed cv-muted md:text-base">{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="categories" className="cv-shell pb-12 md:pb-16">
          <h2 className="cv-section-title text-[#1f1d1a]">Explore by category</h2>
          <p className="mt-2 text-sm cv-muted md:text-base">What are you in the mood for?</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoryCards.map((category) => (
              <article key={category.title} className="group overflow-hidden rounded-2xl border border-neutral-900/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className={`h-28 bg-gradient-to-br ${category.tone} transition group-hover:scale-[1.02]`} />
                <div className="p-4">
                  <span className="inline-flex rounded-full border border-neutral-900/12 bg-[#f7f3ea] px-2.5 py-1 text-[11px] font-semibold text-[#615648]">
                    {category.badge}
                  </span>
                  <h3 className="text-lg font-extrabold text-[#1f1d1a]">{category.title}</h3>
                  <p className="mt-1 text-sm cv-muted">{category.caption}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="cities" className="cv-shell pb-12 md:pb-16">
          <h2 className="cv-section-title text-[#1f1d1a]">Explore popular cities</h2>
          <p className="mt-2 text-sm cv-muted md:text-base">Start with cities people love exploring.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {cities.map((city, index) => (
              <article key={city.name} className="cv-card overflow-hidden">
                <div className={`h-28 ${index === 0 ? 'bg-gradient-to-br from-[#eed8b0] to-[#f9f0dc]' : index === 1 ? 'bg-gradient-to-br from-[#d3dde7] to-[#edf2f7]' : 'bg-gradient-to-br from-[#e8c8bc] to-[#f7ebe7]'}`} />
                <div className="p-4">
                  <h3 className="text-lg font-extrabold text-[#1f1d1a]">{city.name}</h3>
                  <p className="mt-1 text-sm cv-muted">{city.stats}</p>
                  <span className="mt-2 inline-flex max-w-full rounded-full border border-neutral-900/12 bg-[#f7f3ea] px-2.5 py-1 text-xs font-semibold text-[#554d43]">
                    {city.tags}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="featured" className="cv-shell pb-12 md:pb-16">
          <h2 className="cv-section-title text-[#1f1d1a]">Trending now</h2>
          <p className="mt-2 text-sm cv-muted md:text-base">Recommendations locals actually love.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {featured.map((item, index) => (
              <article key={item.title} className="cv-card group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className={`h-36 ${index === 0 ? 'bg-gradient-to-br from-[#f0d8ae] to-[#fbf0df]' : index === 1 ? 'bg-gradient-to-br from-[#e6c3b4] to-[#f7e8e1]' : 'bg-gradient-to-br from-[#d4ddca] to-[#edf2e8]'}`} />
                <div className="p-4">
                  <h3 className="text-lg font-extrabold leading-tight text-[#1f1d1a]">{item.title}</h3>
                  <p className="mt-1 text-sm cv-muted">{item.meta} · {item.place}</p>
                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="rounded-full border border-neutral-900/12 bg-white px-2.5 py-1 font-semibold text-[#51493f]">Popular</span>
                    <span className="text-xs cv-muted">by {item.by}</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className="rounded-full border border-neutral-900/14 px-3 py-1 text-xs font-semibold text-[#51493f]">Save</button>
                    <button className="rounded-full border border-neutral-900/14 px-3 py-1 text-xs font-semibold text-[#51493f]">Share</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="cv-shell pb-12 md:pb-16">
          <h2 className="cv-section-title text-[#1f1d1a]">How CityVibe works</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <article className="cv-card p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8a7a63]">Step 1</p>
              <h3 className="mt-2 text-lg font-extrabold text-[#1f1d1a]">Choose your city</h3>
              <p className="mt-1 text-sm cv-muted">Explore recommendations built around where you are.</p>
            </article>
            <article className="cv-card p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8a7a63]">Step 2</p>
              <h3 className="mt-2 text-lg font-extrabold text-[#1f1d1a]">Discover places and events</h3>
              <p className="mt-1 text-sm cv-muted">Browse short local posts and category-driven recommendations.</p>
            </article>
            <article className="cv-card p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8a7a63]">Step 3</p>
              <h3 className="mt-2 text-lg font-extrabold text-[#1f1d1a]">Save and plan fast</h3>
              <p className="mt-1 text-sm cv-muted">Build your weekend, date, or study plan in minutes.</p>
            </article>
          </div>
        </section>

        <section id="creators" className="cv-shell pb-12 md:pb-16">
          <h2 className="cv-section-title text-[#1f1d1a]">Built by people who know the city</h2>
          <p className="mt-2 text-sm cv-muted md:text-base">Creators make every city feel alive.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {creators.map((creator, index) => (
              <article key={creator.name} className="cv-card p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full font-black ${index === 0 ? 'bg-[#f0d9ac] text-[#6d5113]' : index === 1 ? 'bg-[#d7e0ea] text-[#42515d]' : 'bg-[#ecd1c5] text-[#724632]'}`}>
                  {creator.name.charAt(0)}
                </div>
                <h3 className="text-lg font-extrabold text-[#1f1d1a]">{creator.name}</h3>
                <p className="text-sm cv-muted">{creator.city}</p>
                <p className="mt-2 text-sm text-[#4d453b]">{creator.specialty}</p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#8a7a63]">Verified contributor</p>
              </article>
            ))}
          </div>
        </section>

        <section className="cv-shell pb-10 md:pb-14">
          <div className="rounded-2xl border border-neutral-900/10 bg-gradient-to-r from-[#e2c37a] to-[#d5a33b] p-6 md:p-8">
            <h2 className="text-2xl font-black leading-tight text-[#1d1b18] md:text-4xl">Your city is more interesting than you think.</h2>
            <p className="mt-2 max-w-2xl text-sm text-[#3d3427] md:text-base">Ready to find your next favorite place? Start exploring your city today.</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link href="/auth/signup" className="rounded-xl bg-[#1f1d1a] px-5 py-2.5 text-center text-sm font-bold text-[#f8f5ef] hover:bg-black">Start Exploring</Link>
              <Link href="/auth/login" className="rounded-xl border border-[#3f3220]/30 bg-[#f6edd9] px-5 py-2.5 text-center text-sm font-bold text-[#2d271f]">Join as Creator</Link>
            </div>
          </div>
        </section>

        <footer className="border-t border-neutral-900/10 bg-white/70 py-10">
          <div className="cv-shell grid gap-6 md:grid-cols-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-lg bg-[#f7f3ea] px-3 py-2">
                <Image src="/CityVibe.png" alt="CityVibe" width={26} height={26} className="h-6 w-6 object-contain" />
                <p className="text-lg font-black text-[#1f1d1a]">CityVibe</p>
              </div>
              <p className="mt-2 text-sm cv-muted">Discover your city beyond the obvious.</p>
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#1f1d1a]">Product</p>
              <Link href="/" className="mt-2 block text-sm cv-muted hover:text-[#1f1d1a]">Explore</Link>
              <Link href="/categories" className="block text-sm cv-muted hover:text-[#1f1d1a]">Categories</Link>
              <Link href="/events" className="block text-sm cv-muted hover:text-[#1f1d1a]">Events</Link>
              <Link href="/creators" className="block text-sm cv-muted hover:text-[#1f1d1a]">Creators</Link>
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#1f1d1a]">Cities</p>
              <p className="mt-2 text-sm cv-muted">Krishnanagar</p>
              <p className="text-sm cv-muted">Durgapur</p>
              <p className="text-sm cv-muted">Siliguri</p>
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#1f1d1a]">Company</p>
              <Link href="/#about" className="mt-2 block text-sm cv-muted hover:text-[#1f1d1a]">About</Link>
              <p className="text-sm cv-muted">Privacy</p>
              <p className="text-sm cv-muted">Terms</p>
              <p className="text-sm cv-muted">Contact</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
