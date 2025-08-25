# OG Image Generator

Aplicação Next.js para criar imagens Open Graph personalizadas. Utiliza React, Tailwind CSS, Zustand e NextAuth para autenticação com múltiplos provedores. Pronta para implantação na Vercel.

## Tecnologias

- Next.js 15 (App Router)
- React 18
- Tailwind CSS
- Zustand para estado global
- NextAuth para autenticação
- Jest e Testing Library para testes

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
  - `Providers.tsx`: wrapper com SessionProvider
  - `AuthButtons.tsx`: botões de login/logout
  - `CanvasStage.tsx`: preview da imagem OG
  - `EditorControls.tsx`: formulário para editar conteúdo
  - `ExportControls.tsx`: exportação de PNG e metatags (export em desenvolvimento)
- `lib/`:
  - `authOptions.ts`: configuração do NextAuth
  - `editorStore.ts`: estado global com Zustand
- `types/next-auth.d.ts`: tipagens adicionais para sessão
- `tailwind.config.ts` e `postcss.config.js`: configuração de estilos

## Variáveis de Ambiente

O arquivo `.env.example` lista todas as variáveis necessárias. Copie para `.env.local` e complete com suas credenciais:

```bash
cp .env.example .env.local
```

Preencha cada chave com valores obtidos nos provedores OAuth (Google, GitHub, etc.) e defina um `NEXTAUTH_SECRET` forte.

## Roadmap e Recursos Futuros

- Exportação direta para PNG com alta resolução
- Presets automáticos de layout e cores ("Surpreenda‑me")
- Persistência das configurações no `localStorage`
- Página de login personalizada
- Melhorias no editor de logo (remoção de fundo e inversão de cores)
- Sanitização automática de SVGs de logo convertendo para PNG

## Licença

Projeto licenciado sob MIT. Consulte [LICENSE](LICENSE) para mais detalhes.
