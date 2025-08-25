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
- Remoção de fundo, inversão B/W e máscara circular do logo
- Controles de escala e centralização do logo

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
  - `EditorControls.tsx`: formulário para editar conteúdo
  - `editor/Inspector.tsx`: painel lateral com abas (Canvas, Text, Logo, Metadata, Presets, Export)
  - `MetadataPanel.tsx` e `PresetsPanel.tsx`: painéis reutilizados nas respectivas abas
  - `ExportControls.tsx`: exportação de PNG e metatags (export em desenvolvimento)

- `lib/`:
  - `authOptions.ts`: configuração do NextAuth
  - `editorStore.ts`: estado global com Zustand
- `types/next-auth.d.ts`: tipagens adicionais para sessão
- `tailwind.config.ts` e `postcss.config.js`: configuração de estilos

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

Preencha cada chave com valores obtidos nos provedores OAuth (Google, GitHub, etc.) e defina um `NEXTAUTH_SECRET` forte.

## Testes

Execute os testes unitários com cobertura e verifique se a documentação está atualizada:

```bash
pnpm test   # roda Jest com coleta de cobertura
pnpm docs:guard   # garante que docs/log, dev_doc ou README foram atualizados
```

## Roadmap e Recursos Futuros

- Exportação direta para PNG com alta resolução
- Presets automáticos de layout e cores ("Surpreenda‑me")
- Página de login personalizada
- Melhorias no editor de logo (inversão de cores)
- Arrastar e soltar de logo e outras melhorias


- **Desfazer:** Ctrl/Cmd + Z
- **Refazer:** Ctrl/Cmd + Shift + Z
- **Copiar metatags:** Ctrl/Cmd + C
- **Salvar preset:** Ctrl/Cmd + S        
## Licença

Projeto licenciado sob MIT. Consulte [LICENSE](LICENSE) para mais detalhes.
