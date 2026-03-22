'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function RouteTransitionLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Track route changes
    const handleStart = () => {
      setIsLoading(true);
    };

    const handleStop = () => {
      // Delay to show loader briefly
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    };

    // Listen to route changes (NextJS specific)
    // This is a simple workaround using a listener pattern
    const startTransition = () => setIsLoading(true);
    
    // Listen for navigation events
    window.addEventListener('popstate', startTransition);
    
    return () => {
      window.removeEventListener('popstate', startTransition);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/0 backdrop-blur-sm pointer-events-none">
      <div className="flex flex-col items-center gap-4">
        {/* Modern Loading Spinner */}
        <div className="relative h-12 w-12">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#c89420] border-r-[#c89420] animate-spin" />
          
          {/* Middle ring */}
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-[#d9a12a] animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
          
          {/* Center dot */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-[#d9a12a] to-[#ba8418] animate-pulse" />
        </div>

        <p className="text-sm font-medium text-[#1f1d1a]">Navigating...</p>
      </div>
    </div>
  );
}

// Hook to programmatically trigger loader
export function useRouteTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);

  const push = async (href: string) => {
    setIsTransitioning(true);
    // Simulate transition delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsTransitioning(false);
  };

  return { isTransitioning, push };
}
