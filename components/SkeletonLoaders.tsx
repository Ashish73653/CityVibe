// Reusable skeleton loading components for smooth, graceful loading UI

export function CardSkeleton({ count = 1, className = '' }: { count?: number; className?: string }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={`cv-card overflow-hidden animate-pulse ${className}`}>
          <div className="h-40 bg-[#efe5cf]" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-2/3 rounded bg-[#f1e8d4]" />
            <div className="h-3 w-full rounded bg-[#f1e8d4]" />
            <div className="h-3 w-5/6 rounded bg-[#f1e8d4]" />
          </div>
        </div>
      ))}
    </>
  );
}

export function CategoryCardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="cv-card p-6 animate-pulse">
          <div className="h-32 rounded bg-[#f1e8d4]" />
          <div className="mt-4 space-y-2">
            <div className="h-4 w-2/3 rounded bg-[#f1e8d4]" />
            <div className="h-3 w-full rounded bg-[#f1e8d4]" />
            <div className="h-3 w-4/5 rounded bg-[#f1e8d4]" />
          </div>
        </div>
      ))}
    </>
  );
}

export function EventCardSkeleton({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="cv-card overflow-hidden animate-pulse">
          <div className="h-48 bg-[#f1e8d4]" />
          <div className="space-y-3 p-5">
            <div className="flex gap-2">
              <div className="h-6 w-24 rounded bg-[#f1e8d4]" />
              <div className="h-6 w-16 rounded bg-[#f1e8d4]" />
            </div>
            <div className="h-4 w-full rounded bg-[#f1e8d4]" />
            <div className="h-3 w-3/4 rounded bg-[#f1e8d4]" />
            <div className="flex gap-4 border-t border-neutral-900/10 pt-4">
              <div className="h-4 w-20 rounded bg-[#f1e8d4]" />
              <div className="h-4 w-20 rounded bg-[#f1e8d4]" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export function CreatorCardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="cv-card overflow-hidden animate-pulse">
          <div className="h-24 bg-[#f1e8d4]" />
          <div className="p-6">
            <div className="mb-4 -mt-12 h-20 w-20 rounded-xl bg-[#f1e8d4]" />
            <div className="space-y-2">
              <div className="h-4 w-3/4 rounded bg-[#f1e8d4]" />
              <div className="h-3 w-2/3 rounded bg-[#f1e8d4]" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 border-y border-neutral-900/10 py-4">
              <div className="h-8 rounded bg-[#f1e8d4]" />
              <div className="h-8 rounded bg-[#f1e8d4]" />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-lg bg-[#f1e8d4]" />
              ))}
            </div>
            <div className="mt-4 h-10 rounded-lg bg-[#f1e8d4]" />
          </div>
        </div>
      ))}
    </>
  );
}

export function ListItemSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="cv-card flex gap-4 overflow-hidden p-4 animate-pulse sm:p-5">
          <div className="h-32 w-32 flex-shrink-0 rounded-lg bg-[#f1e8d4]" />
          <div className="flex-1 space-y-3">
            <div className="h-4 w-3/4 rounded bg-[#f1e8d4]" />
            <div className="h-3 w-full rounded bg-[#f1e8d4]" />
            <div className="h-3 w-5/6 rounded bg-[#f1e8d4]" />
            <div className="flex gap-4 pt-2">
              <div className="h-4 w-20 rounded bg-[#f1e8d4]" />
              <div className="h-4 w-20 rounded bg-[#f1e8d4]" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export function HeaderSkeleton() {
  return (
    <div className="cv-card mb-8 p-6 animate-pulse md:p-8">
      <div className="mb-3 h-3 w-32 rounded bg-[#f1e8d4]" />
      <div className="mb-3 h-8 w-2/3 rounded bg-[#f1e8d4]" />
      <div className="h-4 w-full rounded bg-[#f1e8d4]" />
    </div>
  );
}

export function FiltersSkeleton() {
  return (
    <div className="mb-8 space-y-4 animate-pulse">
      <div className="cv-card p-4">
        <div className="mb-3 h-4 w-16 rounded bg-[#f1e8d4]" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-24 rounded-lg bg-[#f1e8d4]" />
          ))}
        </div>
      </div>
      <div className="cv-card p-4">
        <div className="mb-3 h-4 w-16 rounded bg-[#f1e8d4]" />
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 w-28 rounded-lg bg-[#f1e8d4]" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function FullPageLoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#f7f3ea]">
      <div className="flex flex-col items-center gap-4">
        {/* Animated loader */}
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 animate-pulse rounded-full border-4 border-[#f1e8d4]" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#c89420] border-r-[#c89420] animate-spin" />
          <div className="absolute inset-2 animate-pulse rounded-full bg-gradient-to-br from-[#d9a12a] to-[#ba8418]" />
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-[#1f1d1a]">Loading CityVibe</p>
          <p className="mt-1 text-sm text-[#8c7a5f]">Discovering your local gems...</p>
        </div>
      </div>
    </div>
  );
}
