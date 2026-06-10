import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen text-[#fcf8f2] font-amiri bg-[#18130a] noise-bg parchment-vignette flex flex-col justify-center items-center p-6 text-center relative select-none">
      
      {/* Decorative center frame */}
      <div className="relative manuscript-card p-10 max-w-md w-full shadow-lg border border-[#d4af37]/20 bg-[#1e180f]">
        <div className="manuscript-card-inner" />
        
        {/* Decorative corner brackets */}
        <div className="bracket-tl" />
        <div className="bracket-tr" />
        <div className="bracket-bl" />
        <div className="bracket-br" />

        <div className="relative z-20 space-y-6">
          <h2 className="arabic-calligraphy text-2xl text-[#c9a84c] font-bold tracking-wide gold-glow leading-normal">
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
          </h2>

          <div className="flex justify-center text-[#d4af37]">
            <Heart className="w-12 h-12 stroke-[1] animate-pulse" />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold font-amiri text-[#d4af37]">Page Not Found</h1>
            <p className="font-raleway text-xs uppercase tracking-widest text-[#c9a84c]">
              404 Error
            </p>
          </div>

          <p className="text-sm text-[#c9a84c] font-light leading-relaxed">
            The invitation link you followed seems to be incorrect, expired, or has a typo. Please double check the spelling of your personal link, or ask the host for a valid URL link.
          </p>

          <div className="pt-4">
            <Link
              to="/dashboard"
              className="inline-block font-raleway text-xs uppercase tracking-widest bg-[#d4af37] text-[#1e180f] hover:bg-[#aa7c11] px-6 py-2.5 rounded transition-all hover:-translate-y-0.5 active:translate-y-0 shadow"
            >
              Go to Host Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
