import { SiteData } from '../types';

const API_BASE = '/api/site-data';

/**
 * Busca os dados atuais do site no servidor.
 * Retorna null se o servidor ainda não tiver nada salvo
 * (nesse caso o App.tsx continua usando os dados padrão/locais).
 */
export async function loadSiteDataRemote(): Promise<SiteData | null> {
  const res = await fetch(API_BASE, { method: 'GET' });
  if (res.status === 204) return null;
  if (!res.ok) throw new Error(`Erro ao carregar dados do servidor: ${res.status}`);
  return (await res.json()) as SiteData;
}

/**
 * Envia os dados editados no painel Admin para o servidor,
 * que grava em disco (data/site-data.json) e passa a valer
 * para todos os visitantes do site.
 *
 * O adminToken é a senha que o admin digitou no login — o servidor
 * confere isso antes de aceitar salvar qualquer coisa.
 */
export async function saveSiteDataRemote(data: SiteData, adminToken: string): Promise<void> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': adminToken,
    },
    body: JSON.stringify(data),
  });
  if (res.status === 401) throw new Error('Sessão de admin inválida ou expirada. Faça login novamente.');
  if (!res.ok) throw new Error(`Erro ao salvar dados no servidor: ${res.status}`);
}
