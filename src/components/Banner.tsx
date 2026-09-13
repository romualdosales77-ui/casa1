import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { BannerConfig } from '../types';

interface BannerProps {
  banner: BannerConfig;
}

export const Banner: React.FC<BannerProps> = ({ banner }) => {
  if (!banner.enabled || !banner.title.trim()) {
    return null;
  }

  const themeClasses = {
    emerald: 'bg-emerald-600 text-white border-b border-emerald-700',
    dark: 'bg-slate-900 text-white border-b border-slate-800',
    indigo: 'bg-indigo-600 text-white border-b border-indigo-700',
    slate: 'bg-slate-800 text-slate-100 border-b border-slate-700',
  }[banner.theme || 'emerald'];

  return (
    <div
      id="top-announcement-banner"
      className={`${themeClasses} transition-colors duration-300 relative py-2.5 px-4 sm:px-6`}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-full bg-white/15 shrink-0 inline-flex">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </span>
          <p className="text-xs sm:text-sm font-semibold tracking-wide">
            {banner.title}
          </p>
          {banner.subtitle && (
            <span className="hidden md:inline text-xs text-white/80 font-normal border-l border-white/20 pl-2">
              {banner.subtitle}
            </span>
          )}
        </div>

        {banner.link && banner.linkText && (
          <a
            href={banner.link}
            className="inline-flex items-center gap-1 text-xs font-bold text-white bg-white/15 hover:bg-white/25 px-3 py-1 rounded-full transition-all shrink-0 hover:translate-x-0.5"
            id="banner-cta-link"
          >
            <span>{banner.linkText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};
