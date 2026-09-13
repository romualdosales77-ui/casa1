import React, { useState, useEffect } from 'react';
import { SiteData, Product } from './types';
import { loadSiteData, saveSiteData, resetSiteData } from './utils/helpers';
import { loadSiteDataRemote, saveSiteDataRemote } from './utils/api';
import { Navbar } from './components/Navbar';
import { Banner } from './components/Banner';
import { PixSection } from './components/PixSection';
import { PresentationSection } from './components/PresentationSection';
import { ProductList } from './components/ProductList';
import { SidebarUsefulLinks } from './components/SidebarUsefulLinks';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AdminModal } from './components/AdminModal';
import { Footer } from './components/Footer';
import { MessageCircle, Settings } from 'lucide-react';

export default function App() {
  // Primeiro pintamos com o que tiver em cache local (rápido),
  // e assim que possível trocamos pelo que estiver no servidor.
  const [siteData, setSiteData] = useState<SiteData>(() => loadSiteData());
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminToken, setAdminToken] = useState('');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Ao abrir o site, busca a versão oficial (do servidor) dos dados.
  // Isso é o que garante que TODO mundo veja a mesma coisa,
  // e não só quem editou no próprio navegador.
  useEffect(() => {
    let cancelled = false;

    loadSiteDataRemote()
      .then((remoteData) => {
        if (cancelled) return;
        if (remoteData) {
          setSiteData(remoteData);
          saveSiteData(remoteData); // atualiza o cache local também
        }
      })
      .catch((err) => {
        console.error('Não foi possível carregar os dados do servidor, usando cópia local:', err);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Salva as mudanças: atualiza a tela na hora (otimista),
  // guarda uma cópia local, e MANDA PARA O SERVIDOR de verdade.
  const handleSaveData = (newData: SiteData) => {
    setSiteData(newData);
    saveSiteData(newData);

    saveSiteDataRemote(newData, adminToken).catch((err) => {
      console.error('Falha ao salvar no servidor:', err);
      alert(
        'Não foi possível salvar as alterações no servidor. ' +
          'Elas ficaram só neste navegador por enquanto — verifique sua conexão/servidor e tente salvar de novo.',
      );
    });
  };

  const handleResetData = () => {
    const defaultData = resetSiteData();
    setSiteData(defaultData);
    saveSiteDataRemote(defaultData, adminToken).catch((err) => {
      console.error('Falha ao resetar dados no servidor:', err);
    });
  };

  const handleOpenPixSection = () => {
    const el = document.getElementById('pix-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Find a whatsapp link from usefulLinks if available
  const whatsappLink = siteData.usefulLinks.find((l) => l.icon === 'whatsapp')?.url;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-500 selection:text-white">
      {/* Top Configurable Banner */}
      <Banner banner={siteData.banner} />

      {/* Main Header / Navigation */}
      <Navbar
        data={siteData}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onLogoutAdmin={() => {
          setAdminToken('');
          setIsAdminLoggedIn(false);
        }}
      />

      {/* 1. O FOCO PRINCIPAL: Catálogo de Produtos e Programas Game Dev + Barra Lateral */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Main Column: Products Catalog */}
          <div className="lg:col-span-8 xl:col-span-8">
            <ProductList
              products={siteData.products}
              onOpenDetails={(product) => setSelectedProduct(product)}
            />
          </div>

          {/* Lateral Column: Useful Links & Support */}
          <div className="lg:col-span-4 xl:col-span-4">
            <div className="lg:sticky lg:top-24">
              <SidebarUsefulLinks
                links={siteData.usefulLinks}
                storeName={siteData.storeName}
              />
            </div>
          </div>
        </div>
      </main>

      {/* 2. EM SEGUIDA: Demonstração em Vídeo e Apresentação do Produto */}
      <PresentationSection presentation={siteData.presentation} />

      {/* 3. EM SEGUIDA: Área Destacada do PIX */}
      <PixSection
        pix={siteData.pix}
        contactWhatsapp={whatsappLink}
      />

      {/* Footer */}
      <Footer
        data={siteData}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Product Detail / Video Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onGoToPix={handleOpenPixSection}
      />

      {/* Admin Panel Modal (Protected by password 'senha') */}
      <AdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        siteData={siteData}
        onSaveData={handleSaveData}
        onResetData={handleResetData}
        isLoggedIn={isAdminLoggedIn}
        onLoginSuccess={(token) => {
          setAdminToken(token);
          setIsAdminLoggedIn(true);
        }}
        onLogout={() => {
          setAdminToken('');
          setIsAdminLoggedIn(false);
        }}
      />

      {/* Floating Action Button for Quick Admin or WhatsApp */}
      <div className="fixed bottom-5 right-5 z-30 flex flex-col items-end gap-2.5">
        {whatsappLink && (
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg hover:shadow-emerald-500/30 transition-all hover:scale-105 active:scale-95"
            title="Falar no WhatsApp"
            id="floating-whatsapp-btn"
          >
            <MessageCircle className="w-6 h-6" />
          </a>
        )}

        <button
          onClick={() => setIsAdminModalOpen(true)}
          className="px-3.5 py-2 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-1.5 shadow-md backdrop-blur-xs transition-all hover:scale-105 border border-slate-700"
          title="Abrir Painel Admin"
          id="floating-admin-btn"
        >
          <Settings className="w-3.5 h-3.5 text-amber-400" />
          <span>Admin</span>
        </button>
      </div>
    </div>
  );
}
