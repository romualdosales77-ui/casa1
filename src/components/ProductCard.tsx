import React from 'react';
import { Play, ShoppingCart, ExternalLink, Eye, Tag } from 'lucide-react';
import { Product } from '../types';
import { formatCurrencyBRL } from '../utils/helpers';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenDetails,
}) => {
  const hasVideo = Boolean(product.videoUrl && product.videoUrl.trim());

  const discountPercentage =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null;

  return (
    <div
      id={`product-card-${product.id}`}
      className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:border-slate-300"
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100 cursor-pointer" onClick={() => onOpenDetails(product)}>
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=600&q=80'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-extrabold uppercase tracking-wider bg-slate-900/90 backdrop-blur-xs text-white shadow-xs">
            {product.badge}
          </div>
        )}

        {discountPercentage && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-md text-xs font-extrabold bg-rose-600 text-white shadow-xs">
            -{discountPercentage}%
          </div>
        )}

        {/* Has Video indicator button */}
        {hasVideo && (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-white/95 text-slate-800 backdrop-blur-xs shadow-xs flex items-center gap-1.5 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Ver Vídeo</span>
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category */}
          {product.category && (
            <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              <Tag className="w-3 h-3" />
              <span>{product.category}</span>
            </div>
          )}

          {/* Title */}
          <h3
            className="text-base sm:text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors cursor-pointer"
            onClick={() => onOpenDetails(product)}
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Description */}
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing and CTAs */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {formatCurrencyBRL(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                {formatCurrencyBRL(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Details/Video Modal Button */}
            <button
              onClick={() => onOpenDetails(product)}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors"
              id={`details-btn-${product.id}`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Detalhes</span>
            </button>

            {/* Buy link Button */}
            <a
              href={product.buyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs active:scale-98"
              id={`buy-btn-${product.id}`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Comprar</span>
              <ExternalLink className="w-3 h-3 opacity-75" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
