import React from 'react';
import { Play, CheckCircle, Sparkles, Video, ArrowRight } from 'lucide-react';
import { PresentationConfig } from '../types';
import { getEmbedVideoUrl } from '../utils/helpers';

interface PresentationSectionProps {
  presentation: PresentationConfig;
}

export const PresentationSection: React.FC<PresentationSectionProps> = ({
  presentation,
}) => {
  if (!presentation.enabled) {
    return null;
  }

  const { isEmbed, url: videoSrc, isDirectVideo } = getEmbedVideoUrl(
    presentation.videoUrl
  );

  return (
    <section id="apresentacao-section" className="py-10 sm:py-16 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-indigo-50 text-indigo-700 border border-indigo-200/60 mb-3">
            <Video className="w-3.5 h-3.5 text-indigo-600" />
            <span>Vídeo de Apresentação Oficial</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {presentation.title}
          </h2>
          {presentation.subtitle && (
            <p className="mt-2 text-base sm:text-lg text-slate-600 font-medium">
              {presentation.subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Video Player Container */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl overflow-hidden shadow-xl bg-slate-950 border border-slate-800 aspect-video flex items-center justify-center">
              {isEmbed && videoSrc ? (
                <iframe
                  src={videoSrc}
                  title={presentation.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : isDirectVideo && videoSrc ? (
                <video
                  src={videoSrc}
                  controls
                  className="w-full h-full object-cover"
                  poster={presentation.imageUrl}
                >
                  Seu navegador não suporta a tag de vídeo.
                </video>
              ) : (
                <div className="text-center p-6 text-slate-400 flex flex-col items-center">
                  <div className="w-14 h-14 rounded-full bg-slate-800/80 flex items-center justify-center mb-3 text-emerald-400">
                    <Play className="w-7 h-7 fill-emerald-400 ml-1" />
                  </div>
                  <p className="text-sm font-semibold text-slate-200">
                    Apresentação em Vídeo
                  </p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Insira o link do YouTube ou MP4 no painel do administrador
                  </p>
                </div>
              )}
            </div>

            {/* Additional preview image if available */}
            {presentation.imageUrl && (
              <div className="mt-4 flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <img
                  src={presentation.imageUrl}
                  alt={presentation.title}
                  className="w-20 h-14 object-cover rounded-lg shrink-0 border border-slate-200"
                />
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-800 block">
                    Fotos em Alta Resolução
                  </span>
                  Veja fotos detalhadas e especificações técnicas completas abaixo.
                </div>
              </div>
            )}
          </div>

          {/* Description & Highlight Bullets */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <p className="text-slate-700 text-base sm:text-lg leading-relaxed mb-6 font-normal">
              {presentation.description}
            </p>

            {/* Highlights List */}
            {presentation.highlightPoints && presentation.highlightPoints.length > 0 && (
              <div className="space-y-3 mb-8">
                {presentation.highlightPoints.map((point, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="p-1 rounded-md bg-emerald-50 text-emerald-600 mt-0.5 shrink-0">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                    </span>
                    <span className="text-sm sm:text-base font-medium text-slate-800">
                      {point}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Action button */}
            {presentation.buttonText && (
              <div>
                <a
                  href={presentation.buttonLink || '#produtos'}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-base font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md hover:shadow-lg transition-all hover:translate-y-[-1px] w-full sm:w-auto"
                  id="presentation-cta-btn"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{presentation.buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
