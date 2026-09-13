export interface Env {
  // Arquivos estáticos gerados pelo "npm run build" (pasta dist/),
  // configurados em wrangler.toml na seção [assets].
  ASSETS: Fetcher;
  // Namespace do Cloudflare KV onde o site-data.json fica guardado
  // (substitui o data/site-data.json que existia no server.js/Express).
  SITE_DATA: KVNamespace;
  // Senha do painel Admin. Configure com:
  //   npx wrangler secret put ADMIN_TOKEN
  // Se não configurar, cai no padrão 'adm123' (mesmo valor do front-end).
  ADMIN_TOKEN?: string;
}

const KV_KEY = 'site-data';

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/site-data') {
      // GET: devolve os dados salvos no KV.
      // Se ainda não existir nada salvo, devolve 204 e o front usa o padrão.
      if (request.method === 'GET') {
        const raw = await env.SITE_DATA.get(KV_KEY);
        if (raw === null) {
          return new Response(null, { status: 204 });
        }
        return new Response(raw, {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // POST: recebe as edições do painel Admin (texto e imagens em base64)
      // e grava no KV, para valer para todo mundo que visitar o site.
      // Exige o cabeçalho x-admin-token com a senha certa.
      if (request.method === 'POST') {
        const tokenRecebido = request.headers.get('x-admin-token');
        const tokenEsperado = env.ADMIN_TOKEN || 'adm123';
        if (tokenRecebido !== tokenEsperado) {
          return jsonResponse({ error: 'Não autorizado' }, 401);
        }

        let data: unknown;
        try {
          data = await request.json();
        } catch {
          return jsonResponse({ error: 'Corpo inválido' }, 400);
        }
        if (!data || typeof data !== 'object') {
          return jsonResponse({ error: 'Corpo inválido' }, 400);
        }

        await env.SITE_DATA.put(KV_KEY, JSON.stringify(data));
        return jsonResponse({ ok: true });
      }

      return new Response('Method Not Allowed', { status: 405 });
    }

    // Qualquer outra rota: serve os arquivos estáticos do build (dist/).
    return env.ASSETS.fetch(request);
  },
};
