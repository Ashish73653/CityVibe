'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { WelcomeLoadingScreen } from './WelcomeLoadingScreen';

const loadingItems = [
  { icon: 'CAFE', label: 'Finding Cafes' },
  { icon: 'DATE', label: 'Discovering Dates' },
  { icon: 'PLACE', label: 'Locating Places' },
  { icon: 'EVENT', label: 'Loading Events' },
  { icon: 'FOOD', label: 'Browsing Food' },
  { icon: 'EXPLORE', label: 'Exploring City' },
];

export function LoadingScreenProvider({ children }: { children: React.ReactNode }) {
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Hide welcome screen after first load
    if (isFirstLoad) {
      const timer = setTimeout(() => {
        setIsFirstLoad(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isFirstLoad]);

  useEffect(() => {
    // Show transition loader on route change
    setIsTransitioning(true);
    setCurrentIndex(0);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 2000); // Extended to 2 seconds to show multiple cycles

    return () => clearTimeout(timer);
  }, [pathname]);

  // Cycle through items while loading
  useEffect(() => {
    if (!isTransitioning) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % loadingItems.length);
    }, 300); // Cycle every 300ms for smooth transitions

    return () => clearInterval(interval);
  }, [isTransitioning]);

  return (
    <>
      {isFirstLoad && <WelcomeLoadingScreen />}
      
      {/* Route Transition Loader with Cycling Items */}
      {isTransitioning && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-white/40 backdrop-blur-md pointer-events-none animate-fade-in">
          <div className="flex flex-col items-center gap-6">
            {/* Animated Icon Box */}
            <div className="relative h-20 w-20 flex items-center justify-center">
              {loadingItems.map((item, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 flex items-center justify-center transition-all duration-300 transform ${
                    index === currentIndex
                      ? 'opacity-100 scale-100 rotate-0'
                      : 'opacity-0 scale-50 rotate-180'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <div className="font-black text-lg text-[#c89420] tracking-tighter">
                      {item.icon}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Label */}
            <div className="text-center">
              <p className="text-sm font-semibold text-[#1f1d1a] h-5 min-w-28">
                {loadingItems[currentIndex].label}
              </p>
            </div>

            {/* Animated Dots */}
            <div className="flex gap-2">
              {loadingItems.map((_, index) => (
                <div
                  key={index}
                  className={`transition-all duration-300 ${
                    index === currentIndex
                      ? 'h-2 w-6 bg-[#c89420] rounded-full'
                      : 'h-2 w-2 bg-[#c89420]/30 rounded-full'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {children}
    </>
  );
}
