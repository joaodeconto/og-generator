# OG Image Generator

Aplicação Next.js para criar imagens Open Graph personalizadas. Utiliza React, Tailwind CSS, Zustand e NextAuth para autenticação com múltiplos provedores. Pronta para implantação na Vercel.

## Tecnologias

- Next.js 15 (App Router)
- React 18
- Tailwind CSS
- Zustand para estado global
- NextAuth para autenticação
- Remoção de fundo via WebWorker com modelo WASM
- Sistema de toasts para notificações e Error Boundary para capturar falhas
- Jest e Testing Library para testes

## Recursos

- Editor de logo com upload por arquivo, colagem ou URL
- Remoção de fundo, inversão B/W aprimorada e máscara circular do logo
- Controles de escala e posicionamento do logo com sliders X/Y
- Alinhamento de texto horizontal e vertical (esquerda/centro/direita, topo/centro/baixo)
- Sanitização de campos de metadados

## Instalação e Uso

Requisitos: Node.js 18+ e pnpm.

```bash
pnpm install
pnpm dev
# acesse http://localhost:3000
```

## Estrutura do Projeto

- `app/`: rotas e páginas no App Router
  - `layout.tsx`: estilos globais e SessionProvider
  - `page.tsx`: página principal com editor e preview
  - `api/auth/[...nextauth]/route.ts`: rota de autenticação NextAuth
- `components/`: componentes reutilizáveis
  - `Providers.tsx`: wrapper com SessionProvider e ToastProvider
  - `AuthButtons.tsx`: botões de login/logout
  - `CanvasStage.tsx`: preview da imagem OG
  - `editor/Toolbar.tsx`: ações de desfazer, refazer, exportar e copiar metatags
  - `editor/Inspector.tsx`: painel lateral com abas (Canvas, Text, Logo, Metadata, Presets, Export)
  - `MetadataPanel.tsx` e `PresetsPanel.tsx`: painéis reutilizados nas respectivas abas

- `lib/`:
  - `auth.ts`: configuração do NextAuth
  - `editorStore.ts`: estado global com Zustand
  - `meta.ts`: constrói e copia metatags OG/Twitter com sanitização de HTML
  - `types/next-auth.d.ts`: tipagens adicionais para sessão
  - `tailwind.config.ts` e `postcss.config.js`: configuração de estilos

## Sanitização de Entrada

Strings usadas em metatags passam por `escapeHtml` para evitar quebra de HTML e possíveis injeções.

```ts
import { buildMetaTags } from './lib/meta';

const tags = buildMetaTags({
  title: 'Tom & "Jerry" <3',
  description: 'It\'s > all & fun',
});
// content="Tom &amp; &quot;Jerry&quot; &lt;3" etc.
```

## Atalhos de Teclado

- **Cmd/Ctrl+Z**: desfazer
- **Cmd/Ctrl+Shift+Z**: refazer
- **Cmd/Ctrl+C**: copiar metatags
- **Cmd/Ctrl+S**: salvar
- **Setas**: mover o logo
- **Shift+Setas para cima/baixo**: redimensionar o logo

## Variáveis de Ambiente

O arquivo `.env.example` lista todas as variáveis necessárias. Copie para `.env.local` e complete com suas credenciais:

```bash
cp .env.example .env.local
```

Preencha cada chave com valores obtidos nos provedores OAuth (Google, GitHub, etc.) e defina um `NEXTAUTH_SECRET` forte. As credenciais de Twitter, Facebook e Instagram são **opcionais**; se ausentes, os botões de login desses provedores não aparecerão.

As variáveis são validadas em tempo de inicialização pelo arquivo `lib/env.ts` usando [Zod](https://github.com/colinhacks/zod). Caso `NEXTAUTH_SECRET` esteja ausente, um valor inseguro `dev-secret` é usado apenas para desenvolvimento; sempre configure um segredo real em produção. A aplicação exibirá erro e não iniciará caso qualquer outra variável **obrigatória** esteja ausente ou vazia.

Exemplo mínimo para desenvolvimento:

```env
NEXTAUTH_SECRET=seu-segredo
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

## Testes

Execute os testes unitários com cobertura e verifique se a documentação está atualizada:

```bash
pnpm test   # roda Jest com coleta de cobertura
pnpm docs:guard   # garante que docs/log, dev_doc ou README foram atualizados
```

## Roadmap e Recursos Futuros

- Presets automáticos de layout e cores ("Surpreenda‑me")
- Página de login personalizada
- Efeitos adicionais no editor de logo
- Arrastar e soltar de logo e outras melhorias

- **Desfazer:** Ctrl/Cmd + Z
- **Refazer:** Ctrl/Cmd + Shift + Z
- **Copiar metatags:** Ctrl/Cmd + C
- **Salvar preset:** Ctrl/Cmd + S
## Problemas Conhecidos

- Alguns sites bloqueiam a coleta de metadados; quando isso ocorre o painel de Metadata exibe um toast de erro.
- Exportação falhará se o servidor de origem da imagem não permitir CORS, ainda que os elementos usem `crossOrigin="anonymous"`.

## Licença

Projeto licenciado sob MIT. Consulte [LICENSE](LICENSE) para mais detalhes.
