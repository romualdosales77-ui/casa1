import React, { useState } from 'react';
import {
  X,
  Lock,
  Check,
  Plus,
  Trash2,
  Edit2,
  Save,
  RotateCcw,
  Sparkles,
  QrCode,
  Video,
  ShoppingBag,
  Link as LinkIcon,
  Eye,
  EyeOff,
  Upload,
  MessageCircle,
  Instagram,
  Send,
  Truck,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import {
  SiteData,
  Product,
  UsefulLink,
  PixKeyType,
  UsefulLinkIcon,
} from '../types';
import { fileToDataUrl, formatCurrencyBRL } from '../utils/helpers';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteData: SiteData;
  onSaveData: (newData: SiteData) => void;
  onResetData: () => void;
  isLoggedIn: boolean;
  onLoginSuccess: (adminToken: string) => void;
  onLogout: () => void;
}

type TabType = 'banner' | 'pix' | 'presentation' | 'products' | 'links' | 'settings';

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  siteData,
  onSaveData,
  onResetData,
  isLoggedIn,
  onLoginSuccess,
  onLogout,
}) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [formData, setFormData] = useState<SiteData>(siteData);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // State for adding/editing a product
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);

  // State for adding/editing a useful link
  const [editingLink, setEditingLink] = useState<UsefulLink | null>(null);
  const [isLinkFormOpen, setIsLinkFormOpen] = useState(false);

  // When opening, synchronize formData with current siteData
  React.useEffect(() => {
    setFormData(siteData);
  }, [siteData, isOpen]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === 'adm123') {
      setPasswordError(false);
      onLoginSuccess(passwordInput.trim());
      setPasswordInput('');
    } else {
      setPasswordError(true);
    }
  };

  const handleSaveAll = () => {
    onSaveData(formData);
    showToast('Alterações salvas com sucesso!');
  };

  const handleReset = () => {
    if (confirm('Tem certeza de que deseja restaurar os dados originais?')) {
      onResetData();
      showToast('Dados restaurados para o padrão.');
      onClose();
    }
  };

  // Image Upload Helper for PIX QR code
  const handlePixQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const dataUrl = await fileToDataUrl(file);
        setFormData((prev) => ({
          ...prev,
          pix: { ...prev.pix, qrCodeImageUrl: dataUrl },
        }));
        showToast('Imagem do QR Code carregada!');
      } catch (err) {
        alert('Erro ao carregar imagem');
      }
    }
  };

  // Image Upload Helper for Product
  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProduct) {
      try {
        const dataUrl = await fileToDataUrl(file);
        setEditingProduct((prev) => prev ? { ...prev, imageUrl: dataUrl } : null);
        showToast('Imagem do produto carregada!');
      } catch (err) {
        alert('Erro ao carregar imagem');
      }
    }
  };

  // Product Actions
  const handleOpenAddProduct = () => {
    setEditingProduct({
      id: `prod-${Date.now()}`,
      name: '',
      description: '',
      price: 0,
      originalPrice: undefined,
      imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
      videoUrl: '',
      buyLink: 'https://wa.me/5511987654321?text=Ol%C3%A1%2C%20quero%20adquirir%20este%20software',
      badge: 'Lançamento',
      category: 'Game Dev',
      active: true,
    });
    setIsProductFormOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    if (!editingProduct.name.trim()) {
      alert('Por favor, informe o nome do produto.');
      return;
    }

    setFormData((prev) => {
      const exists = prev.products.some((p) => p.id === editingProduct.id);
      let updatedProducts: Product[];
      if (exists) {
        updatedProducts = prev.products.map((p) =>
          p.id === editingProduct.id ? editingProduct : p
        );
      } else {
        updatedProducts = [editingProduct, ...prev.products];
      }
      const updated = { ...prev, products: updatedProducts };
      onSaveData(updated);
      return updated;
    });

    setIsProductFormOpen(false);
    setEditingProduct(null);
    showToast('Produto salvo!');
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Tem certeza de que deseja remover este produto?')) {
      setFormData((prev) => {
        const updated = {
          ...prev,
          products: prev.products.filter((p) => p.id !== id),
        };
        onSaveData(updated);
        return updated;
      });
      showToast('Produto excluído.');
    }
  };

  // Useful Link Actions
  const handleOpenAddLink = () => {
    setEditingLink({
      id: `link-${Date.now()}`,
      title: '',
      url: '',
      description: '',
      icon: 'whatsapp',
    });
    setIsLinkFormOpen(true);
  };

  const handleSaveLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;
    if (!editingLink.title.trim() || !editingLink.url.trim()) {
      alert('Informe o título e a URL do link.');
      return;
    }

    setFormData((prev) => {
      const exists = prev.usefulLinks.some((l) => l.id === editingLink.id);
      let updatedLinks: UsefulLink[];
      if (exists) {
        updatedLinks = prev.usefulLinks.map((l) =>
          l.id === editingLink.id ? editingLink : l
        );
      } else {
        updatedLinks = [...prev.usefulLinks, editingLink];
      }
      const updated = { ...prev, usefulLinks: updatedLinks };
      onSaveData(updated);
      return updated;
    });

    setIsLinkFormOpen(false);
    setEditingLink(null);
    showToast('Link útil salvo!');
  };

  const handleDeleteLink = (id: string) => {
    if (confirm('Deseja excluir este link útil?')) {
      setFormData((prev) => {
        const updated = {
          ...prev,
          usefulLinks: prev.usefulLinks.filter((l) => l.id !== id),
        };
        onSaveData(updated);
        return updated;
      });
      showToast('Link excluído.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Painel do Administrador</h2>
              <p className="text-xs text-slate-400">
                Gerencie banner, chave PIX, produtos, vídeo e links úteis
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isLoggedIn && (
              <button
                onClick={onLogout}
                className="text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
                id="admin-panel-logout-btn"
              >
                Sair
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              id="admin-panel-close-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast feedback */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 text-center flex items-center justify-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Password Gate */}
        {!isLoggedIn ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto my-auto">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4">
              <Lock className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 mb-2">
              Acesso Restrito ao Administrador
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Digite a senha de administrador configurada para editar o site.
            </p>

            <form onSubmit={handleLoginSubmit} className="w-full space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Digite a senha..."
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError(false);
                  }}
                  className={`w-full px-4 py-3 rounded-xl border text-center text-lg font-bold tracking-widest focus:outline-none focus:ring-2 ${
                    passwordError
                      ? 'border-red-500 focus:ring-red-500 bg-red-50/50'
                      : 'border-slate-300 focus:ring-emerald-500'
                  }`}
                  autoFocus
                  id="admin-password-input"
                />
                {passwordError && (
                  <p className="mt-1.5 text-xs font-medium text-red-600">
                    Senha incorreta.
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 px-6 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm"
                id="admin-login-submit-btn"
              >
                Acessar Painel
              </button>

            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
            {/* Left Nav Tabs */}
            <div className="w-full sm:w-56 bg-slate-50 border-r border-slate-200 p-3 sm:p-4 space-y-1.5 shrink-0 overflow-x-auto sm:overflow-y-auto">
              <button
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                  activeTab === 'products'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Produtos ({formData.products.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('pix')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                  activeTab === 'pix'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span>Área PIX</span>
              </button>

              <button
                onClick={() => setActiveTab('banner')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                  activeTab === 'banner'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Banner do Topo</span>
              </button>

              <button
                onClick={() => setActiveTab('presentation')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                  activeTab === 'presentation'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Vídeo Apresentação</span>
              </button>

              <button
                onClick={() => setActiveTab('links')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                  activeTab === 'links'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <LinkIcon className="w-4 h-4" />
                <span>Links Úteis ({formData.usefulLinks.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                <span>Configurações</span>
              </button>
            </div>

            {/* Right Tab Content */}
            <div className="flex-1 p-5 sm:p-6 overflow-y-auto max-h-[75vh]">
              {/* TAB: PRODUCTS */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Gerenciar Produtos para Venda
                      </h3>
                      <p className="text-xs text-slate-500">
                        Adicione imagens, vídeos, links de compra e descrições dos produtos
                      </p>
                    </div>

                    <button
                      onClick={handleOpenAddProduct}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
                      id="admin-add-product-btn"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Novo Produto</span>
                    </button>
                  </div>

                  {/* List of products */}
                  <div className="space-y-3">
                    {formData.products.map((prod) => (
                      <div
                        key={prod.id}
                        className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white shadow-2xs gap-3"
                      >
                        <img
                          src={prod.imageUrl}
                          alt={prod.name}
                          className="w-14 h-14 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm truncate">
                              {prod.name}
                            </span>
                            {prod.badge && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                                {prod.badge}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                            <span className="font-bold text-emerald-700">
                              {formatCurrencyBRL(prod.price)}
                            </span>
                            {prod.videoUrl && (
                              <span className="text-indigo-600 font-medium">
                                • Tem Vídeo
                              </span>
                            )}
                            {prod.category && (
                              <span className="text-slate-400">• {prod.category}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => {
                              setEditingProduct(prod);
                              setIsProductFormOpen(true);
                            }}
                            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                            title="Editar Produto"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                            title="Excluir Produto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: PIX */}
              {activeTab === 'pix' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Área Destacada do PIX
                      </h3>
                      <p className="text-xs text-slate-500">
                        Configure a imagem do QR Code e sua chave PIX
                      </p>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.pix.enabled}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            pix: { ...prev.pix, enabled: e.target.checked },
                          }))
                        }
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span className="text-xs font-bold text-slate-700">
                        Exibir Seção PIX
                      </span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Chave PIX
                      </label>
                      <input
                        type="text"
                        value={formData.pix.keyValue}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            pix: { ...prev.pix, keyValue: e.target.value },
                          }))
                        }
                        placeholder="Ex: seu telefone, CPF, CNPJ ou e-mail"
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Tipo de Chave
                      </label>
                      <select
                        value={formData.pix.keyType}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            pix: { ...prev.pix, keyType: e.target.value as PixKeyType },
                          }))
                        }
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="telefone">Telefone / Celular</option>
                        <option value="cpf">CPF</option>
                        <option value="cnpj">CNPJ</option>
                        <option value="email">E-mail</option>
                        <option value="aleatoria">Chave Aleatória (EVP)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nome do Titular / Beneficiário
                      </label>
                      <input
                        type="text"
                        value={formData.pix.beneficiaryName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            pix: { ...prev.pix, beneficiaryName: e.target.value },
                          }))
                        }
                        placeholder="Ex: Romualdo Sales"
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Cidade / Localização
                      </label>
                      <input
                        type="text"
                        value={formData.pix.city || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            pix: { ...prev.pix, city: e.target.value },
                          }))
                        }
                        placeholder="Ex: São Paulo - SP"
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  {/* QR Code image source & file upload */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <label className="block text-xs font-bold text-slate-800">
                      Imagem do QR Code PIX
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {formData.pix.qrCodeImageUrl ? (
                        <img
                          src={formData.pix.qrCodeImageUrl}
                          alt="QR Code Preview"
                          className="w-24 h-24 object-contain rounded-lg border border-slate-300 bg-white p-1"
                        />
                      ) : (
                        <div className="w-24 h-24 rounded-lg bg-slate-200 flex items-center justify-center text-slate-400">
                          <QrCode className="w-8 h-8" />
                        </div>
                      )}

                      <div className="flex-1 space-y-2 w-full">
                        <input
                          type="text"
                          value={formData.pix.qrCodeImageUrl}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              pix: { ...prev.pix, qrCodeImageUrl: e.target.value },
                            }))
                          }
                          placeholder="Cole a URL da imagem ou carregue abaixo..."
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />

                        <div>
                          <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors shadow-2xs">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Carregar Imagem do seu Aparelho / PC</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handlePixQrUpload}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nota de Destaque / Desconto
                    </label>
                    <input
                      type="text"
                      value={formData.pix.discountNote || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          pix: { ...prev.pix, discountNote: e.target.value },
                        }))
                      }
                      placeholder="Ex: Aprovação imediata e prioridade no envio!"
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Instruções de Pagamento
                    </label>
                    <textarea
                      rows={2}
                      value={formData.pix.instructions}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          pix: { ...prev.pix, instructions: e.target.value },
                        }))
                      }
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB: BANNER */}
              {activeTab === 'banner' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Banner de Destaque no Topo
                      </h3>
                      <p className="text-xs text-slate-500">
                        Você pode escrever um nome/anúncio ou removê-lo a qualquer momento
                      </p>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.banner.enabled}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            banner: { ...prev.banner, enabled: e.target.checked },
                          }))
                        }
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span className="text-xs font-bold text-slate-700">
                        Exibir Banner (Remover/Ativar)
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nome ou Texto Principal do Banner
                    </label>
                    <input
                      type="text"
                      value={formData.banner.title}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          banner: { ...prev.banner, title: e.target.value },
                        }))
                      }
                      placeholder="Ex: OFERTA EXCLUSIVA: Desconto no PIX hoje!"
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Subtexto ou Descrição Complementar
                    </label>
                    <input
                      type="text"
                      value={formData.banner.subtitle || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          banner: { ...prev.banner, subtitle: e.target.value },
                        }))
                      }
                      placeholder="Ex: Frete rápido e garantia em todos os pedidos."
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Estilo de Cor do Banner
                      </label>
                      <select
                        value={formData.banner.theme}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            banner: {
                              ...prev.banner,
                              theme: e.target.value as any,
                            },
                          }))
                        }
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="emerald">Verde Esmeralda</option>
                        <option value="dark">Preto Minimalista</option>
                        <option value="indigo">Índigo / Azul Moderno</option>
                        <option value="slate">Cinza Chumbo</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Texto do Botão (Opcional)
                      </label>
                      <input
                        type="text"
                        value={formData.banner.linkText || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            banner: { ...prev.banner, linkText: e.target.value },
                          }))
                        }
                        placeholder="Ex: Ver Produtos"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Link do Botão (Opcional)
                      </label>
                      <input
                        type="text"
                        value={formData.banner.link || ''}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            banner: { ...prev.banner, link: e.target.value },
                          }))
                        }
                        placeholder="Ex: #produtos"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: PRESENTATION */}
              {activeTab === 'presentation' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Área de Apresentação em Vídeo & Imagem
                      </h3>
                      <p className="text-xs text-slate-500">
                        Vídeo explicativo do produto em destaque com descrição e diferenciais
                      </p>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.presentation.enabled}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            presentation: {
                              ...prev.presentation,
                              enabled: e.target.checked,
                            },
                          }))
                        }
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                      />
                      <span className="text-xs font-bold text-slate-700">
                        Exibir Apresentação
                      </span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Link do Vídeo (YouTube, Vimeo, ou arquivo MP4)
                    </label>
                    <input
                      type="text"
                      value={formData.presentation.videoUrl}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          presentation: {
                            ...prev.presentation,
                            videoUrl: e.target.value,
                          },
                        }))
                      }
                      placeholder="Ex: https://www.youtube.com/watch?v=..."
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">
                      Suporta links comuns do YouTube, YouTube Shorts, Vimeo ou link direto para vídeo .mp4
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Título da Apresentação
                      </label>
                      <input
                        type="text"
                        value={formData.presentation.title}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            presentation: {
                              ...prev.presentation,
                              title: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Subtítulo
                      </label>
                      <input
                        type="text"
                        value={formData.presentation.subtitle}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            presentation: {
                              ...prev.presentation,
                              subtitle: e.target.value,
                            },
                          }))
                        }
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      URL da Imagem de Capa / Destaque
                    </label>
                    <input
                      type="text"
                      value={formData.presentation.imageUrl || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          presentation: {
                            ...prev.presentation,
                            imageUrl: e.target.value,
                          },
                        }))
                      }
                      placeholder="https://..."
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Descrição Detalhada
                    </label>
                    <textarea
                      rows={3}
                      value={formData.presentation.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          presentation: {
                            ...prev.presentation,
                            description: e.target.value,
                          },
                        }))
                      }
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB: USEFUL LINKS */}
              {activeTab === 'links' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Links Úteis da Barra Lateral
                      </h3>
                      <p className="text-xs text-slate-500">
                        Adicione links para WhatsApp, redes sociais, rastreamento e suporte
                      </p>
                    </div>

                    <button
                      onClick={handleOpenAddLink}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-xs"
                      id="admin-add-useful-link-btn"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Novo Link</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {formData.usefulLinks.map((link) => (
                      <div
                        key={link.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-2xs gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm truncate">
                              {link.title}
                            </span>
                            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase font-semibold">
                              {link.icon}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {link.url}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => {
                              setEditingLink(link);
                              setIsLinkFormOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                            title="Editar link"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteLink(link.id)}
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                            title="Excluir link"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: SETTINGS & BACKUP */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="pb-3 border-b border-slate-200">
                    <h3 className="text-base font-bold text-slate-900">
                      Configurações Gerais da Loja
                    </h3>
                    <p className="text-xs text-slate-500">
                      Altere o nome oficial e informações globais do site
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Nome da Loja / Marca
                      </label>
                      <input
                        type="text"
                        value={formData.storeName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            storeName: e.target.value,
                          }))
                        }
                        className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Slogan / Frase de Apresentação
                      </label>
                      <input
                        type="text"
                        value={formData.storeTagline}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            storeTagline: e.target.value,
                          }))
                        }
                        className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="pt-6 border-t border-slate-200">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Restauração de Dados
                      </h4>
                      <p className="text-xs text-slate-500 mb-3">
                        Deseja reiniciar com os produtos e informações de demonstração?
                      </p>
                      <button
                        onClick={handleReset}
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Restaurar Dados Originais</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Bottom Bar for Saving */}
        {isLoggedIn && (
          <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              Sessão de administrador ativa
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200/80 transition-colors"
              >
                Fechar
              </button>

              <button
                onClick={handleSaveAll}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
                id="admin-save-all-btn"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Tudo no Site</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sub-modal: Add / Edit Product */}
      {isProductFormOpen && editingProduct && (
        <div
          className="fixed inset-0 z-60 bg-slate-950/80 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={() => setIsProductFormOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                {editingProduct.id.startsWith('prod-') && editingProduct.name
                  ? 'Editar Produto'
                  : 'Adicionar Novo Produto'}
              </h3>
              <button
                onClick={() => setIsProductFormOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nome do Produto / Software *
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  placeholder="Ex: PixelForge Animator Pro 2026"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preço de Venda (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={editingProduct.price || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    placeholder="89.90"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Preço Original / De (Opcional)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editingProduct.originalPrice || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        originalPrice: e.target.value
                          ? parseFloat(e.target.value)
                          : undefined,
                      })
                    }
                    placeholder="149.90"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Product Image URL and Upload */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <label className="block text-xs font-bold text-slate-800">
                  Imagem do Produto (URL ou Arquivo)
                </label>
                <div className="flex items-center gap-3">
                  <img
                    src={editingProduct.imageUrl}
                    alt="Preview"
                    className="w-16 h-16 rounded-lg object-cover border border-slate-300 bg-white"
                  />
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      value={editingProduct.imageUrl}
                      onChange={(e) =>
                        setEditingProduct({
                          ...editingProduct,
                          imageUrl: e.target.value,
                        })
                      }
                      placeholder="https://..."
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir foto do dispositivo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProductImageUpload}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Vídeo do Produto (Link do YouTube, Vimeo ou .mp4)
                </label>
                <input
                  type="text"
                  value={editingProduct.videoUrl || ''}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      videoUrl: e.target.value,
                    })
                  }
                  placeholder="Ex: https://www.youtube.com/watch?v=..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Purchase / External Link */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Link de Compra / WhatsApp / Checkout *
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.buyLink}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      buyLink: e.target.value,
                    })
                  }
                  placeholder="https://wa.me/... ou link do checkout de pagamento"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Categoria
                  </label>
                  <input
                    type="text"
                    value={editingProduct.category}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        category: e.target.value,
                      })
                    }
                    placeholder="Ex: Animação 2D, Shaders & VFX, Level Design, Áudio"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Selo de Destaque / Badge
                  </label>
                  <input
                    type="text"
                    value={editingProduct.badge || ''}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        badge: e.target.value,
                      })
                    }
                    placeholder="Ex: Mais Vendido, Oferta, Destaque"
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Descrição Completa do Produto
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.description}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      description: e.target.value,
                    })
                  }
                  placeholder="Descreva as qualidades, especificações e diferenciais do produto..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProductFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                  id="submit-product-form-btn"
                >
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sub-modal: Add / Edit Useful Link */}
      {isLinkFormOpen && editingLink && (
        <div
          className="fixed inset-0 z-60 bg-slate-950/80 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={() => setIsLinkFormOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-bold text-slate-900">
                {editingLink.title ? 'Editar Link Útil' : 'Novo Link Útil'}
              </h3>
              <button
                onClick={() => setIsLinkFormOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLink} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Título do Link *
                </label>
                <input
                  type="text"
                  required
                  value={editingLink.title}
                  onChange={(e) =>
                    setEditingLink({ ...editingLink, title: e.target.value })
                  }
                  placeholder="Ex: Falar no WhatsApp"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL / Endereço do Link *
                </label>
                <input
                  type="text"
                  required
                  value={editingLink.url}
                  onChange={(e) =>
                    setEditingLink({ ...editingLink, url: e.target.value })
                  }
                  placeholder="https://wa.me/55... ou https://instagram.com/..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ícone
                </label>
                <select
                  value={editingLink.icon}
                  onChange={(e) =>
                    setEditingLink({
                      ...editingLink,
                      icon: e.target.value as UsefulLinkIcon,
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="whatsapp">WhatsApp (Suporte / Atendimento)</option>
                  <option value="instagram">Instagram</option>
                  <option value="telegram">Telegram</option>
                  <option value="truck">Rastreamento / Entrega</option>
                  <option value="shield">Garantia / Segurança</option>
                  <option value="mail">E-mail</option>
                  <option value="help">Dúvidas Frequentes</option>
                  <option value="link">Link Genérico</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pequena Descrição
                </label>
                <input
                  type="text"
                  value={editingLink.description || ''}
                  onChange={(e) =>
                    setEditingLink({
                      ...editingLink,
                      description: e.target.value,
                    })
                  }
                  placeholder="Ex: Atendimento rápido de segunda a sábado"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsLinkFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                  id="submit-useful-link-btn"
                >
                  Salvar Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
