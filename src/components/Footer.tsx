import React from 'react';
import { ShieldCheck, QrCode, Lock, Heart } from 'lucide-react';
import { SiteData } from '../types';

interface FooterProps {
  data: SiteData;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ data, onOpenAdmin }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-12 pb-8 mt-16 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-800">
          {/* Brand info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2 text-white font-extrabold text-base tracking-tight">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-sm">
                {data.storeName.charAt(0)}
              </div>
              <span>{data.storeName}</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              {data.storeTagline}
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-emerald-400 text-[11px] font-semibold border border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Transações Verificadas & Envio Seguro</span>
            </div>
          </div>

          {/* Quick Pix summary */}
          <div className="md:col-span-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>Chave PIX Cadastrada</span>
            </h4>
            <p className="text-xs text-slate-400">
              Titular: <strong className="text-slate-200">{data.pix.beneficiaryName}</strong>
            </p>
            <p className="font-mono text-xs text-emerald-400 bg-slate-800/80 p-2 rounded-lg border border-slate-700/60 truncate">
              {data.pix.keyValue}
            </p>
          </div>

          {/* Quick links & Admin button */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Acesso
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#pix-section" className="hover:text-emerald-400 transition-colors">
                  Área do PIX Oficial
                </a>
              </li>
              <li>
                <a href="#produtos" className="hover:text-emerald-400 transition-colors">
                  Catálogo de Produtos
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1.5 hover:text-white transition-colors text-slate-400 text-left"
                  id="footer-admin-link"
                >
                  <Lock className="w-3 h-3 text-slate-500" />
                  <span>Painel de Administração</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} {data.storeName}. Todos os direitos reservados.</p>
          <div className="flex items-center gap-2">
            <span>Pagamento Seguro via PIX</span>
            <span>•</span>
            <button
              onClick={onOpenAdmin}
              className="text-slate-400 hover:text-emerald-400 font-medium transition-colors"
            >
              Área do Vendedor
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
