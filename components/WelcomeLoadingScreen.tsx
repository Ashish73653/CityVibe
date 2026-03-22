'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export function WelcomeLoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#f7f3ea] via-[#fefdfb] to-[#f4ecdc] overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 h-full w-full rounded-full bg-gradient-to-br from-[#c89420]/10 to-transparent blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -left-1/2 h-full w-full rounded-full bg-gradient-to-tr from-[#6f7f8d]/5 to-transparent blur-3xl animate-pulse animation-delay-1000" />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center gap-8 text-center px-4">
        {/* Animated Logo */}
        <div className="relative flex items-center justify-center animate-bounce">
          <div className="absolute h-36 w-36 rounded-full bg-[#d9a12a]/18 blur-2xl" />
          <Image
            src="/CityVibe.png"
            alt="CityVibe logo"
            width={128}
            height={128}
            className="relative z-10 h-32 w-32 object-contain drop-shadow-[0_14px_26px_rgba(0,0,0,0.28)]"
            priority
          />
        </div>

        {/* Brand Name with animation */}
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight text-[#1f1d1a] md:text-5xl animate-fade-in">
            CityVibe
          </h1>
          <p className="text-lg text-[#8c7a5f] font-medium animate-fade-in animation-delay-200">
            Discover Your City
          </p>
        </div>

        {/* Loading dots */}
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-[#c89420] animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="h-2.5 w-2.5 rounded-full bg-[#c89420] animate-bounce" style={{ animationDelay: '0.2s' }} />
          <div className="h-2.5 w-2.5 rounded-full bg-[#c89420] animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>

        {/* Loading text */}
        <p className="text-sm text-[#8c7a5f] font-medium">Loading local gems...</p>
      </div>
    </div>
  );
}
