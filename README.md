# OG Image Generator

Este repositório contém o esqueleto do **OG Image Studio**, uma aplicação Next.js que permite gerar imagens Open Graph personalizadas com layout profissional. O projeto utiliza **React**, **Tailwind CSS**, **Zustand** para gerenciamento de estado e **NextAuth** para autenticação via múltiplos provedores (Google, GitHub, LinkedIn, Twitter, Facebook e Instagram). Está preparado para implantação na Vercel.

## Instalação

  ```bash
  # Instale as dependências (requer Node.js 18+)
  npm install

  # Inicie o servidor de desenvolvimento
  npm run dev

  # Acesse em http://localhost:3000
  ```

## Configuração de Autenticação

O repositório inclui um arquivo `.env.example` que lista todas as variáveis de ambiente necessárias para os provedores de autenticação. Use-o como modelo para criar seu `.env.local`.

1. Copie o arquivo `.env.example` para `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Preencha as variáveis de ambiente com as credenciais dos provedores que você deseja habilitar. Para obter estas credenciais, crie apps/clientes nas plataformas correspondentes e configure a URL de callback para `http://localhost:3000/api/auth/callback/&lt;provider&gt;`.

3. Defina também `NEXTAUTH_SECRET` com um valor forte (pode ser gerado via `openssl rand -base64 32`).

## Estrutura do Projeto

- `app/`: utiliza a rota `App Router` do Next.js para páginas e API routes.
  - `layout.tsx`: carrega estilos globais e injeta o `SessionProvider`.
  - `page.tsx`: página principal com o editor e preview da imagem.
  - `api/auth/[...nextauth]/route.ts`: rota de autenticação do NextAuth.
- `components/`: componentes reutilizáveis.
  - `Providers.tsx`: wrapper com `SessionProvider`.
  - `AuthButtons.tsx`: botões de login/logout.
  - `CanvasStage.tsx`: preview da imagem OG.
  - `EditorControls.tsx`: formulário para editar título, subtítulo, tema, layout, banner e logo.
  - `ExportControls.tsx`: botões para exportar PNG e copiar metatags (export ainda não implementado).
- `lib/`:
  - `authOptions.ts`: configuração do NextAuth com provedores OAuth.
  - `editorStore.ts`: estado global do editor utilizando Zustand.
- `types/next-auth.d.ts`: estende os tipos do NextAuth para incluir `id` e `provider` na sessão.
- `tailwind.config.ts` e `postcss.config.js`: configuração do Tailwind.
- `.env.example`: exemplo de variáveis de ambiente necessárias; copie para `.env.local` e preencha com suas credenciais.

## Próximos Passos

- Implementar a exportação de PNG utilizando uma biblioteca como `html-to-image` ou um worker que renderize o canvas em 2× para nitidez.
- Adicionar persistência das configurações do editor via `localStorage`.
- Implementar a funcionalidade “Surpreenda‑me” para gerar presets aleatórios de cores e layouts.
- Criar página customizada de login ao invés da página padrão do NextAuth.
- Melhorar a experiência de edição do logo com remoção de fundo e inversão de cores em tempo real.

## Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo [LICENSE](LICENSE) para mais detalhes.
