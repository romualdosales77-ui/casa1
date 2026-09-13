import React from 'react';
import {
  MessageCircle,
  Instagram,
  Send,
  ExternalLink,
  HelpCircle,
  Truck,
  ShieldCheck,
  Mail,
  Star,
  Link as LinkIcon,
  PhoneCall,
  Clock,
  Check,
} from 'lucide-react';
import { UsefulLink, UsefulLinkIcon } from '../types';

interface SidebarUsefulLinksProps {
  links: UsefulLink[];
  storeName: string;
}

export const SidebarUsefulLinks: React.FC<SidebarUsefulLinksProps> = ({
  links,
  storeName,
}) => {
  const renderIcon = (icon: UsefulLinkIcon) => {
    switch (icon) {
      case 'whatsapp':
        return <MessageCircle className="w-5 h-5 text-emerald-600" />;
      case 'instagram':
        return <Instagram className="w-5 h-5 text-pink-600" />;
      case 'telegram':
        return <Send className="w-5 h-5 text-sky-600" />;
      case 'truck':
        return <Truck className="w-5 h-5 text-amber-600" />;
      case 'shield':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'mail':
        return <Mail className="w-5 h-5 text-indigo-600" />;
      case 'star':
        return <Star className="w-5 h-5 text-amber-500" />;
      case 'help':
        return <HelpCircle className="w-5 h-5 text-purple-600" />;
      default:
        return <LinkIcon className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <aside className="space-y-6" id="sidebar-useful-links">
      {/* Useful Links Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
              Links Úteis
            </h3>
            <p className="text-xs text-slate-500">
              Canais diretos e atendimento
            </p>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
            {links.length} canais
          </span>
        </div>

        {links.length > 0 ? (
          <div className="space-y-2.5">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target={link.url.startsWith('#') ? '_self' : '_blank'}
                rel={link.url.startsWith('#') ? undefined : 'noopener noreferrer'}
                className="group flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/40 transition-all text-slate-700 hover:text-slate-900"
                id={`useful-link-${link.id}`}
              >
                <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-white group-hover:shadow-xs transition-all shrink-0">
                  {renderIcon(link.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-emerald-800 truncate">
                      {link.title}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                  </div>
                  {link.description && (
                    <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                      {link.description}
                    </p>
                  )}
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-4">
            Nenhum link adicionado ainda. Configure no painel admin.
          </p>
        )}
      </div>

      {/* Trust & Guarantee Box */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Compra 100% Segura</span>
        </div>

        <h4 className="text-sm font-bold leading-snug">
          Garantia e compromisso {storeName}
        </h4>

        <div className="space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Chave PIX conferida e aprovada na hora</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Código de rastreamento enviado via WhatsApp</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Suporte humanizado direto com o vendedor</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Atendimento Diário
          </span>
          <span className="text-emerald-400 font-semibold">Envio Rápido</span>
        </div>
      </div>
    </aside>
  );
};
