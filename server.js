import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Na alwaysdata, o painel do site define as variáveis PORT e IP
// automaticamente — o app TEM que escutar nesses valores.
// Em local (sua máquina) elas não existem, então caem no padrão abaixo.
const PORT = process.env.PORT || 8080;
const IP = process.env.IP || '0.0.0.0';
const DATA_FILE = path.join(__dirname, 'data', 'site-data.json');

// Senha do painel Admin, conferida aqui no servidor também (além do
// React). Configure o valor real em uma variável de ambiente chamada
// ADMIN_TOKEN (no .env local ou no painel da alwaysdata em Environment
// Variables). Se não configurar nada, cai no padrão 'adm123' — que é o
// mesmo valor usado no front-end (AdminModal.tsx). Se trocar um, troque
// o outro também.
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'adm123';

// Limite maior no body porque as imagens do painel Admin viajam
// em base64 dentro do próprio JSON (fileToDataUrl).
app.use(express.json({ limit: '15mb' }));

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(null), 'utf-8');
  }
}
ensureDataFile();

// GET: devolve os dados salvos no servidor.
// Se ainda não existir nada salvo, devolve 204 e o front usa o padrão.
app.get('/api/site-data', (req, res) => {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const data = JSON.parse(raw);
    if (data === null) {
      return res.status(204).end();
    }
    res.json(data);
  } catch (err) {
    console.error('Erro ao ler site-data.json:', err);
    res.status(500).json({ error: 'Erro ao ler os dados' });
  }
});

// POST: recebe as edições do painel Admin (texto e imagens em base64)
// e grava no disco do servidor, para valer para todo mundo que visitar o site.
// Exige o cabeçalho x-admin-token com a senha certa — sem isso, ninguém
// de fora consegue sobrescrever os dados do site.
app.post('/api/site-data', (req, res) => {
  const tokenRecebido = req.get('x-admin-token');
  if (tokenRecebido !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Não autorizado' });
  }
  try {
    const data = req.body;
    if (!data || typeof data !== 'object') {
      return res.status(400).json({ error: 'Corpo inválido' });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    res.json({ ok: true });
  } catch (err) {
    console.error('Erro ao salvar site-data.json:', err);
    res.status(500).json({ error: 'Erro ao salvar os dados' });
  }
});

// Serve o build de produção (pasta "dist" gerada por "npm run build")
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, IP, () => {
  console.log(`Servidor rodando em ${IP}:${PORT}`);
});
