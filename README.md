# OG Image Generator
> \uD83D\uDEA7 Projeto em desenvolvimento — contribuições são bem-vindas.

Aplicação Next.js para criar imagens Open Graph personalizadas. Usa React, Tailwind CSS, Zustand e NextAuth e está preparada para implantação na Vercel.

## Quickstart
Requisitos: Node.js 18+ e pnpm.

```bash
pnpm install
cp .env.local.example .env.local  # preencha com suas credenciais
pnpm dev
# acesse http://localhost:3000
```

## Features
- [x] Autenticação com Google e GitHub (NextAuth)
- [x] Avatar e menu de sessão persistente
- [ ] Provedores adicionais (Twitter, Facebook, Instagram)
- [x] Remoção de fundo, inversão B/W e máscara circular do logo
- [x] Editor com título, subtítulo e logo arrastável
- [x] Remoção de fundo, inversão B/W e máscara circular do logo (com loading)
- [ ] Upload de logo via drag-and-drop
- [x] Exportação de PNG em múltiplos tamanhos
- [x] Toasts para salvar, exportar e erros
- [x] Cor de fundo personalizável
- [ ] Presets automáticos de layout e cores
- [x] API de persistência do editor (CRUD)
- [x] Presets de dimensões do canvas

## How it works
Projeto construído com **Next.js 15** (App Router) e **React 18**. Os estilos são gerenciados com **Tailwind CSS** e o estado global com **Zustand**.
A autenticacão é feita via **NextAuth**, a remoção de fundo usa um **WebWorker** com modelo WASM e o estado do editor pode ser serializado e salvo em `/api/design`.


Os textos de título e subtítulo utilizam CSS `clamp()` e `text-wrap: balance`, mantendo legibilidade em diferentes tamanhos.

Estrutura principal:
- `app/` – rotas e páginas (editor em `app/(editor)/page.tsx`)
- `components/` – componentes reutilizáveis como `CanvasStage`, `AuthButtons` e `editor/*`
- `lib/` – configuração de auth, store do editor, helpers de imagem e metatags

### Atalhos de Teclado
- **Cmd/Ctrl+Z**: desfazer  
- **Cmd/Ctrl+Shift+Z**: refazer  
- **Cmd/Ctrl+C**: copiar metatags  
- **Cmd/Ctrl+S**: salvar  
- **Setas**: mover o logo  
- **Shift+Setas para cima/baixo**: redimensionar o logo

## Env Vars
Copie o arquivo `.env.local.example` para `.env.local` e preencha as chaves:

```bash
cp .env.local.example .env.local
```

Defina um `NEXTAUTH_SECRET` forte e configure credenciais dos provedores OAuth desejados. Variáveis opcionais (Twitter, Facebook, Instagram) omitem os botões de login se ausentes.  
As variáveis são validadas em tempo de execução por `lib/env.ts` usando [Zod](https://github.com/colinhacks/zod). Caso `NEXTAUTH_SECRET` não seja fornecido, um valor inseguro `dev-secret` é utilizado apenas em desenvolvimento.

Exemplo mínimo:

```env
NEXTAUTH_SECRET=seu-segredo
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

## Testing
Execute os testes unitários e verifique se a documentação está sincronizada:

```bash
pnpm lint       # ESLint
pnpm test       # Jest com cobertura
pnpm docs:guard # garante atualização de README/dev_doc/log
```

Os testes residem em `__tests__/` e cobrem utilitários e fluxos principais.

## Roadmap & Status
- [x] Bootstrap Next.js + Tailwind + Zustand
- [x] Autenticação Google e GitHub
- [x] Avatar e menu de sessão persistente
- [ ] Provedores Twitter e Facebook
- [x] Canvas com título, subtítulo e logo arrastável
- [ ] Upload de logo via drag-and-drop
- [x] Remoção de fundo, inversão B/W e loading do logo
- [ ] Hi‑DPI export (2×)
- [ ] Templates de layout e cores

## Known Issues
- Alguns sites bloqueiam a coleta de metadados; nesse caso o painel de Metadata exibe um toast de erro.
- A exportação falha se a origem da imagem não permitir CORS, mesmo com `crossOrigin="anonymous"`.

## Licença
Projeto licenciado sob MIT. Consulte [LICENSE](LICENSE) para mais detalhes.
