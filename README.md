# EY Attack Surface Mapping Agent — Apresentação Interativa

Apresentação 16:9 autocontida para execução local no browser. Não utiliza backend, chaves de API, autenticação, fontes externas, CDNs em runtime ou ficheiros exteriores ao repositório.

## 1. Requisitos

- Node.js 20.19+ or 22.12+
- npm 10+
- Browser moderno: Chrome, Edge, Firefox ou Safari

## 2. Instalação

```bash
git clone <repository>
cd ASM-Bot-Presentation
npm install
```

## 3. Execução local

```bash
npm run dev
```

Abrir o URL local apresentado no terminal. `npm start` é um alias equivalente.

## 4. Modo de ecrã inteiro

Premir `F` ou utilizar o comando de ecrã inteiro do browser. Premir `Esc` para sair. Para o melhor resultado, ocultar as barras do browser e utilizar um ecrã 16:9.

## 5. Controlos da apresentação

- `→`, `↓`, `Espaço`, `Page Down`: próximo passo ou slide
- `←`, `↑`, `Page Up`: passo ou slide anterior
- `Home` / `End`: primeiro / último slide
- `O`: abrir ou fechar a visão geral
- `F`: alternar o modo de ecrã inteiro
- Também são suportados o rato e gestos touch

Alguns diagramas técnicos são revelados progressivamente. O indicador principal avança apenas quando existe mudança de slide.

## 6. Build de produção

```bash
npm run build
npm run preview
```

Os ficheiros de produção são gerados em `dist/`. Todos os visuais utilizam HTML, CSS e SVG local, pelo que a apresentação não necessita de acesso à rede depois da instalação.
