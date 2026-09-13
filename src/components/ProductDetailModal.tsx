import React from 'react';
import { X, ShoppingCart, ExternalLink, QrCode, Play, Tag, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { formatCurrencyBRL, getEmbedVideoUrl } from '../utils/helpers';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onGoToPix: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onGoToPix,
}) => {
  if (!product) return null;

  const { isEmbed, url: videoSrc, isDirectVideo } = getEmbedVideoUrl(product.videoUrl);
  const hasVideo = Boolean(product.videoUrl && product.videoUrl.trim());

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl relative my-8 border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-md transition-colors"
          id="close-product-modal-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Media area: Video player OR Featured Image */}
        {hasVideo ? (
          <div className="bg-slate-950 aspect-video w-full flex items-center justify-center relative">
            {isEmbed && videoSrc ? (
              <iframe
                src={videoSrc}
                title={product.name}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : isDirectVideo && videoSrc ? (
              <video
                src={videoSrc}
                controls
                autoPlay
                className="w-full h-full object-contain"
                poster={product.imageUrl}
              />
            ) : (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            )}
          </div>
        ) : (
          <div className="bg-slate-100 aspect-16/9 sm:aspect-21/9 w-full overflow-hidden">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Modal content details */}
        <div className="p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.badge && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-900 text-white">
                  {product.badge}
                </span>
              )}
              {product.category && (
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {product.category}
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {product.name}
            </h2>

            <div className="mt-2 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {formatCurrencyBRL(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-slate-400 line-through">
                  De {formatCurrencyBRL(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Descrição do Produto
            </h4>
            <p className="text-slate-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
            <a
              href={product.buyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
              id="modal-direct-buy-link"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>Comprar Agora pelo Link</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <button
              onClick={() => {
                onClose();
                onGoToPix();
              }}
              className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-colors"
              id="modal-pay-with-pix-btn"
            >
              <QrCode className="w-5 h-5 text-emerald-600" />
              <span>Pagar com PIX</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
