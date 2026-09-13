import React from 'react';
import { ShieldCheck, QrCode, ShoppingBag, ExternalLink, Lock, CheckCircle2 } from 'lucide-react';
import { SiteData } from '../types';

interface NavbarProps {
  data: SiteData;
  isAdminLoggedIn: boolean;
  onOpenAdmin: () => void;
  onLogoutAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  data,
  isAdminLoggedIn,
  onOpenAdmin,
  onLogoutAdmin,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo and store title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-lg shadow-sm">
              <span className="bg-gradient-to-br from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                {data.storeName.charAt(0).toUpperCase() || 'V'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
                  {data.storeName}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verificado
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1 max-w-xs sm:max-w-md">
                {data.storeTagline}
              </p>
            </div>
          </div>

          {/* Quick navigation and admin access */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="#produtos"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200/80 shadow-2xs"
              id="nav-produtos-link"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              <span>Programas</span>
            </a>

            <a
              href="#apresentacao-section"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
              id="nav-video-link"
            >
              <span>Vídeo Demo</span>
            </a>

            <a
              href="#pix-section"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
              id="nav-pix-link"
            >
              <QrCode className="w-4 h-4 text-emerald-600" />
              <span>Área PIX</span>
            </a>

            {/* Admin access button */}
            {isAdminLoggedIn ? (
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/80 px-2.5 py-1.5 rounded-lg">
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1 text-xs font-bold text-amber-900 hover:text-amber-950 transition-colors"
                  id="admin-open-panel-btn"
                  title="Abrir Painel de Controle"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Painel</span>
                </button>
                <span className="text-amber-300">|</span>
                <button
                  onClick={onLogoutAdmin}
                  className="text-xs text-amber-700 hover:text-red-600 font-medium transition-colors"
                  id="admin-logout-btn"
                  title="Sair do modo administrador"
                >
                  Sair
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                id="admin-login-nav-btn"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
