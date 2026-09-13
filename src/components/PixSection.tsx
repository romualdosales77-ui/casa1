import React, { useState } from 'react';
import {
  QrCode,
  Copy,
  Check,
  ShieldCheck,
  Zap,
  ArrowUpRight,
  Maximize2,
  X,
  MessageCircle,
} from 'lucide-react';
import { PixConfig } from '../types';

interface PixSectionProps {
  pix: PixConfig;
  contactWhatsapp?: string;
}

export const PixSection: React.FC<PixSectionProps> = ({ pix, contactWhatsapp }) => {
  const [copied, setCopied] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  if (!pix.enabled) {
    return null;
  }

  const handleCopyKey = async () => {
    try {
      await navigator.clipboard.writeText(pix.keyValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = pix.keyValue;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const keyTypeLabels: Record<string, string> = {
    telefone: 'Telefone / Celular',
    cpf: 'CPF',
    cnpj: 'CNPJ',
    email: 'E-mail',
    aleatoria: 'Chave Aleatória (EVP)',
  };

  const whatsappReceiptLink = contactWhatsapp
    ? `https://wa.me/${contactWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
        `Olá! Acabei de realizar o pagamento via PIX no valor do meu pedido. Segue o comprovante!`
      )}`
    : `https://wa.me/?text=${encodeURIComponent(
        `Olá! Acabei de realizar o pagamento via PIX no valor do meu pedido. Segue o comprovante!`
      )}`;

  return (
    <section id="pix-section" className="py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header tag */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-100 text-emerald-800 border border-emerald-300/60 mb-2">
            <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
            <span>Área Oficial de Pagamento</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {pix.title || 'Pague com PIX com Segurança'}
          </h2>
          {pix.discountNote && (
            <p className="mt-1.5 text-sm sm:text-base font-medium text-emerald-700 max-w-xl mx-auto">
              {pix.discountNote}
            </p>
          )}
        </div>

        {/* Highlighted PIX Card */}
        <div className="bg-gradient-to-b from-white to-slate-50 rounded-2xl border-2 border-emerald-500/80 shadow-lg shadow-emerald-500/5 overflow-hidden transition-all">
          {/* Top banner of the card */}
          <div className="bg-emerald-600 text-white px-6 py-3 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 font-bold text-sm tracking-wide">
              <QrCode className="w-5 h-5" />
              <span>CHAVE PIX OFICIAL & QR CODE</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-100 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-200" />
              <span>Aprovação Imediata 24/7</span>
            </div>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left side: QR Code Image highlighted */}
            <div className="md:col-span-5 flex flex-col items-center text-center">
              <div
                className="relative group bg-white p-3 rounded-2xl border border-slate-200 shadow-md hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setIsZoomOpen(true)}
                title="Clique para ampliar o QR Code"
                id="pix-qrcode-container"
              >
                {pix.qrCodeImageUrl ? (
                  <img
                    src={pix.qrCodeImageUrl}
                    alt="QR Code PIX para pagamento"
                    className="w-56 h-56 sm:w-60 sm:h-60 object-contain rounded-xl"
                  />
                ) : (
                  <div className="w-56 h-56 flex flex-col items-center justify-center bg-slate-50 rounded-xl text-slate-400 p-4">
                    <QrCode className="w-16 h-16 mb-2 text-slate-300" />
                    <span className="text-xs">QR Code não configurado</span>
                  </div>
                )}

                <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center text-white font-medium text-xs gap-1.5 backdrop-blur-[2px]">
                  <Maximize2 className="w-4 h-4" />
                  <span>Clique para Ampliar</span>
                </div>
              </div>

              <span className="mt-2.5 text-xs text-slate-500 flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5 text-emerald-600" />
                Escaneie a imagem com o app do seu banco
              </span>
            </div>

            {/* Right side: Key, Beneficiary and Actions */}
            <div className="md:col-span-7 flex flex-col justify-center space-y-4">
              {/* Chave PIX container */}
              <div className="bg-slate-100/90 border border-slate-200 rounded-xl p-4">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span>TIPO DE CHAVE: {keyTypeLabels[pix.keyType] || 'PIX'}</span>
                  <span className="text-emerald-700 font-bold">Chave de Destino</span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    readOnly
                    value={pix.keyValue}
                    className="w-full bg-white font-mono text-base sm:text-lg font-bold text-slate-900 px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 select-all"
                    id="pix-key-display-input"
                  />

                  <button
                    onClick={handleCopyKey}
                    className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg font-bold text-sm transition-all whitespace-nowrap shadow-sm active:scale-95 ${
                      copied
                        ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    }`}
                    id="copy-pix-key-btn"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copiar Chave</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Beneficiary Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="bg-white border border-slate-200 p-3 rounded-lg">
                  <p className="text-xs text-slate-500 font-medium">Nome do Titular / Beneficiário</p>
                  <p className="font-bold text-slate-800 truncate" title={pix.beneficiaryName}>
                    {pix.beneficiaryName || 'Vendedor Oficial'}
                  </p>
                </div>
                {pix.city && (
                  <div className="bg-white border border-slate-200 p-3 rounded-lg">
                    <p className="text-xs text-slate-500 font-medium">Cidade / Localização</p>
                    <p className="font-bold text-slate-800">{pix.city}</p>
                  </div>
                )}
              </div>

              {/* Instructions */}
              {pix.instructions && (
                <div className="text-xs sm:text-sm text-slate-600 bg-white/70 p-3 rounded-lg border border-slate-200/80 leading-relaxed">
                  <strong className="text-slate-800">Como pagar: </strong>
                  {pix.instructions}
                </div>
              )}

              {/* WhatsApp receipt confirmation button */}
              <div className="pt-2">
                <a
                  href={whatsappReceiptLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-colors"
                  id="whatsapp-confirm-pix-receipt"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Enviar Comprovante pelo WhatsApp</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal to Zoom QR Code */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setIsZoomOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 max-w-sm w-full text-center relative shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
              id="close-zoom-modal-btn"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              QR Code PIX
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Aponte a câmera do aplicativo do seu banco
            </p>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 inline-block mb-4">
              <img
                src={pix.qrCodeImageUrl}
                alt="QR Code PIX Ampliado"
                className="w-72 h-72 object-contain mx-auto"
              />
            </div>

            <p className="text-xs font-semibold text-slate-700 mb-1">
              {pix.beneficiaryName}
            </p>
            <p className="text-xs font-mono text-slate-500 bg-slate-100 py-1.5 px-2 rounded-md truncate">
              {pix.keyValue}
            </p>

            <button
              onClick={handleCopyKey}
              className="mt-4 w-full py-2 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-colors flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Chave Copiada com Sucesso!' : 'Copiar Chave'}</span>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
