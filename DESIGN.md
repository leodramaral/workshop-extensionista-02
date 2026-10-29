# DESIGN.md: fundação do site de apresentação

> Workshop de Desenvolvimento com IA. Slides servidos como site no GitHub Pages.
> Versão 1.9 · 2026-10-29 · Leandro Amaral

Este arquivo é a **fonte da verdade** do projeto. Ele vale para quem escreve código à mão e para agentes de IA (OpenCode, Claude, Copilot). Faça o `AGENTS.md` do repositório apontar para cá, com a linha: *"Antes de criar ou alterar qualquer slide, leia o DESIGN.md e siga-o à risca."*

Se algo aqui estiver errado ou faltando, **corrija este arquivo primeiro** e só depois o código. É a mesma regra de ouro que o workshop ensina.

---

## 1. Objetivo e escopo

- **O que é:** um site estático com as apresentações dos dois dias do workshop, construído com reveal.js e publicado no GitHub Pages.
- **Por que site e não PowerPoint:** a identidade visual depende de animação, CSS e efeitos em canvas, que se perdem em .pptx ou PDF.
- **De onde vem o conteúdo:** do documento *Roteiro Final, Workshop de Desenvolvimento com IA*. Este arquivo define só **forma e regras**. O roteiro define **o que** cada slide diz.
- **Fora do escopo:** backend, login, analytics e frameworks de UI (React, Vue etc.).

## 2. Stack e restrições

| Item | Decisão |
|---|---|
| Motor de slides | **reveal.js 6.0.1**, carregado do cdnjs. A versão é fixa e nunca vira `latest` |
| Build | **Nenhum.** HTML, CSS e JS puros, abertos direto no navegador |
| Tema do reveal.js | **Nenhum tema pronto.** Só `reset.css` e `reveal.css`; o tema é nosso (seção 6) |
| Plugins | `RevealNotes` (notas do apresentador) e `RevealHighlight` (código), só se houver código |
| Fontes | Google Fonts: Anybody, DM Sans e Space Mono |
| Hospedagem | GitHub Pages, a partir da branch `main`, pasta raiz |
| Navegadores-alvo | Chrome e Edge atuais (projetor do laboratório). Firefox e Safari só precisam funcionar razoavelmente |

URLs base (cdnjs, reveal.js 6.0.1):

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/6.0.1/reset.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/6.0.1/reveal.min.css">
<!-- NÃO carregar nada de /theme/ -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/6.0.1/reveal.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/6.0.1/plugin/notes.min.js"></script>
```

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Anybody:wdth,wght@50..150,100..900&family=DM+Sans:ital,wght@0,400..700;1,400..700&family=Space+Mono:wght@400;700&display=swap">
```

> **Atualizar o reveal.js:** trocar o número da versão em todos os links ao mesmo tempo, testar os dois dias inteiros e registrar a mudança no histórico (seção 16). A série 6.x mudou os caminhos de plugins em relação à 5.x, então nunca misture versões.

## 3. Estrutura de arquivos

```
/
├── index.html            # página inicial: título do workshop + links para Dia 1 e Dia 2
├── dia-1.html            # apresentação do Dia 1 (O jeito rápido)
├── dia-2.html            # apresentação do Dia 2 (O jeito maduro)
├── css/
│   ├── tokens.css        # variáveis: cores, tipografia, espaços, movimento (seção 5)
│   ├── base.css          # neutraliza padrões do reveal.js + estilos globais (seção 6)
│   ├── componentes.css   # peças reutilizáveis (seção 8)
│   ├── layouts.css       # esqueletos de slide (seção 9)
│   └── animacoes.css     # keyframes, fragments customizados, reduced-motion (seção 10)
├── js/
│   ├── main.js           # Reveal.initialize + liga/desliga efeitos por slide
│   └── efeitos/
│       ├── esfera.js     # esfera pontilhada (canvas)
│       └── flutuantes.js # quadrados flutuantes
├── assets/
│   ├── img/              # imagens e capturas (PNG/WebP/SVG)
│   └── svg/              # ilustrações e diagramas
├── .nojekyll             # evita o processamento Jekyll do GitHub Pages
├── AGENTS.md             # aponta para este DESIGN.md
└── DESIGN.md
```

Regras:

- **Uma apresentação por arquivo HTML.** Os slides ficam em `<section>` dentro de `.slides`, com um comentário antes de cada bloco do roteiro, por exemplo `<!-- 1.3 Harness -->`.
- **Nunca** coloque estilo inline nos slides. Exceções: posição de um elemento fixado num layout e variáveis CSS locais (`style="--delay: 200ms"`).
- Os arquivos CSS são carregados nesta ordem: `tokens` → `base` → `componentes` → `layouts` → `animacoes`.

## 4. Inicialização do reveal.js

`js/main.js`:

```js
Reveal.initialize({
  width: 1920,
  height: 1080,
  margin: 0,            // o respiro é responsabilidade do nosso layout
  minScale: 0.2,
  maxScale: 2.0,
  center: false,        // nada de centralização vertical automática
  hash: true,           // URL com o número do slide (#/3)
  slideNumber: 'c/t',
  showSlideNumber: 'speaker',
  controls: true,
  controlsLayout: 'bottom-right',
  progress: true,
  transition: 'fade',
  transitionSpeed: 'default',
  backgroundTransition: 'fade',
  autoAnimate: true,
  fragments: true,
  plugins: [RevealNotes]
});

// Efeitos pesados rodam só no slide visível (seção 10.4)
Reveal.on('ready', syncEffects);
Reveal.on('slidechanged', syncEffects);
```

O canvas é sempre **1920×1080**, e o reveal.js escala para a tela. Todas as medidas desta especificação estão nessa escala.

## 5. Tokens (`css/tokens.css`)

### 5.1 Cores

A paleta segue o site da Mux: carvão e cinza-esverdeado de base, com um acento principal âmbar e cinco cores de apoio (laranja, rosa, azul, verde e violeta). O quadriculado também vem da Mux.

```css
:root {
  /* Base */
  --c-ink:        #151617;  /* texto sobre qualquer cor de acento; quase preto */
  --c-basalt:     #242628;  /* superfície escura principal (carvão); texto sobre claro */
  --c-basalt-2:   #3B3E42;  /* chips sobre basalt */
  --c-paper:      #E2E4DD;  /* fundo claro principal (cinza-esverdeado) */
  --c-sand:       #F4F6F4;  /* texto claro sobre escuro */
  --c-white:      #FFFFFF;  /* cartões claros */
  --c-line:       #C4C7BB;  /* bordas e hachuras sobre claro */
  --c-eggshell:   #C2CBD5;  /* texto secundário sobre escuro */
  --c-muted:      #4A525A;  /* texto secundário sobre claro */
  --c-muted-dark: #A3ACB6;  /* texto terciário sobre escuro */

  /* Acentos */
  --c-accent:     #FFB200;  /* acento principal (âmbar) */
  --c-tint:       #FFF1CC;  /* títulos sobre escuro */
  --c-orange:     #FF6100;  /* alerta / erro / "quebrou" */
  --c-pink:       #FA50B5;  /* marcador rosa; "zona de perda" */
  --c-blue:       #0091FF;  /* marcador azul; links e informação */
  --c-green:      #00BE43;  /* marcador verde; "funcionou" */
  --c-violet:     #A77BFF;  /* sexta cor de apoio; usada para dar cor própria ao 6º robô (Modelo) */

  /* Linhas utilitárias */
  --grid-line-light:  rgba(36, 38, 40, 0.07);
  --grid-line-dark:   rgba(244, 246, 244, 0.06);
  --grid-line-accent: rgba(36, 38, 40, 0.10);
  --frame-dark:       rgba(244, 246, 244, 0.25);
}
```

**Pares aprovados** (contraste WCAG medido; só use texto nestes pares):

| Texto | Fundo | Contraste | Uso |
|---|---|---|---|
| `--c-basalt` | `--c-paper` | 11.8:1 | texto padrão em slide claro |
| `--c-basalt` | `--c-white` | 15.2:1 | texto em cartão claro |
| `--c-muted` | `--c-paper` | 6.2:1 | legendas, fontes, rodapé |
| `--c-tint` | `--c-basalt` | 13.5:1 | títulos em slide escuro |
| `--c-sand` | `--c-basalt` | 14.0:1 | corpo em slide escuro |
| `--c-eggshell` | `--c-basalt` | 9.3:1 | texto secundário escuro |
| `--c-muted-dark` | `--c-basalt` | 6.6:1 | texto terciário escuro |
| `--c-accent` | `--c-basalt` | 8.4:1 | rótulos e destaques no escuro |
| `--c-ink` | `--c-accent` | 10.0:1 | texto em slide de acento e pílulas |
| `--c-ink` | `--c-orange` / `--c-pink` / `--c-blue` / `--c-green` / `--c-violet` | 6.0 / 5.9 / 5.6 / 7.3 / 6.0:1 | texto em chips e marcadores coloridos |
| `--c-orange`, `--c-green`, `--c-pink`, `--c-blue`, `--c-violet` | `--c-basalt` | 5.0 / 6.1 / 5.0 / 4.7 / 5.0:1 | texto de alerta ou rótulo colorido no escuro (a partir de 24px) |

**Proibido:** texto na cor de acento (ou de qualquer cor de apoio) sobre fundo claro (âmbar sobre paper: 1.4:1). No claro, essas cores só aparecem como **preenchimento** (pílula, chip, marcador, cartão destaque) com texto `--c-ink` por cima.

**Uso das cores de apoio:** laranja = problema ("quebrou"), verde = ok ("funcionou"), rosa e azul = categorias e marcadores. Cor nunca é o único sinal (seção 13): sempre há um rótulo de texto junto.

### 5.2 Tipografia

| Papel | Família | Peso | Largura | Caixa | Tracking |
|---|---|---|---|---|---|
| Display (capa, frase de efeito) | Anybody | 800 | `font-stretch: 125%` | MAIÚSCULAS | 0 |
| Título de slide (h2) | Anybody | 800 | 125% | MAIÚSCULAS | 0 |
| Título de cartão (h3) | Anybody | 700–800 | 125% | MAIÚSCULAS | 0 |
| Título longo (mais de 30 caracteres) | Anybody | 700 | 100% | Frase | −0.02em |
| Corpo | DM Sans | 400; ênfase 600 | — | Frase | 0 |
| Citação grande | DM Sans | 600 | — | Frase | −0.04em |
| Rótulo, chip, código, rodapé | Space Mono | 400 | — | MAIÚSCULAS | 0.08em |

```css
:root {
  --f-display: 'Anybody', 'Arial Black', sans-serif;
  --f-body:    'DM Sans', Arial, sans-serif;
  --f-mono:    'Space Mono', ui-monospace, monospace;

  /* Escala (canvas 1920×1080). Nada abaixo de 24px. */
  --t-display: 120px;  /* line-height 1.02 */
  --t-h1:      96px;   /* line-height 1.05 */
  --t-h2:      64px;   /* line-height 1.10 */
  --t-h3:      44px;   /* line-height 1.10 */
  --t-lead:    36px;   /* line-height 1.35 */
  --t-body:    28px;   /* line-height 1.45 */
  --t-label:   24px;   /* line-height 1.40 */
}
```

Regras:

- **No máximo 3 tamanhos por slide**, sem contar rótulos. Para dar ênfase, use peso, cor ou itálico, nunca um tamanho novo.
- **Estimativa de largura** do título largo em maiúsculas: cerca de 0,85 × tamanho da fonte por caractere. Uma linha de 1664px comporta uns 30 caracteres a 64px e uns 16 a 120px. Se não couber, quebre a linha com `<br>` num ponto natural ou use o título longo.
- Rótulos de seção ("eyebrow") vêm **entre colchetes**: `[ VISÃO GERAL ]`.

### 5.3 Espaço, grade e forma

```css
:root {
  --s-1: 8px;  --s-2: 16px; --s-3: 24px; --s-4: 32px;
  --s-5: 48px; --s-6: 64px; --s-7: 96px; --s-8: 128px;

  --slide-pad: 128px;       /* margem interna do slide → área útil 1664×824 */
  --slide-pad-bottom: 160px;/* quando o slide tem rodapé */
  --frame-inset: 64px;      /* moldura tracejada */
  --grid-cell: 48px;        /* quadriculado */

  --radius-0: 0;            /* padrão: cantos retos (Greptile) */
  --radius-pill: 999px;     /* pílulas (Mux) */
  --hatch: repeating-linear-gradient(45deg, var(--c-line) 0 2px, transparent 2px 9px);
}
```

- **Cantos retos são a regra.** O arredondamento fica só nas pílulas e nos pontos dos conectores.
- **Sem sombras.** A profundidade vem de hachura, borda de 1px e contraste de superfície.

### 5.4 Movimento

```css
:root {
  --ease-out:  cubic-bezier(0.2, 0.8, 0.2, 1);
  --ease-io:   cubic-bezier(0.65, 0, 0.35, 1);
  --d-fast:    200ms;   /* hover, cursor */
  --d-base:    450ms;   /* fragments, cartões */
  --d-slow:    900ms;   /* títulos blur-in, conectores */
  --stagger:   120ms;   /* atraso entre itens de uma sequência */
}
```

## 6. Neutralizar os padrões do reveal.js (`css/base.css`)

O `reveal.css` cuida do mecanismo (posição, escala, transições, fragments). Os padrões visuais que ele ainda aplica precisam ser anulados **no início** do `base.css`:

```css
.reveal-viewport { background: var(--c-paper); }

.reveal {
  font-family: var(--f-body);
  font-size: var(--t-body);
  color: var(--c-basalt);
}

.reveal .slides { text-align: left; }

.reveal .slides > section,
.reveal .slides > section > section {
  width: 1920px;
  height: 1080px;
  padding: var(--slide-pad);
  box-sizing: border-box;
  /* NÃO definir display aqui: o reveal.js controla display dos sections */
}

/* O layout vive num wrapper interno (ver aviso abaixo) */
.reveal .slides section > [class^="layout-"] {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.reveal h1, .reveal h2, .reveal h3, .reveal p, .reveal ul, .reveal ol {
  margin: 0;
  text-transform: none;
  text-shadow: none;
  letter-spacing: 0;
  word-wrap: normal;
}

.reveal ul, .reveal ol { padding-left: 1.2em; display: block; }
.reveal img { max-width: none; max-height: none; margin: 0; }
.reveal a { color: inherit; }

/* Controles e barra de progresso na nossa paleta */
.reveal .controls { color: var(--c-accent); }
.reveal .progress { color: var(--c-accent); height: 4px; }
```

> **Atenção à visibilidade:** o reveal.js esconde slides inativos com `display:none` e mostra o atual com `display:block`. Sempre que um layout precisar de `display:flex` ou `grid`, aplique na **classe do layout com `.present`** (ou num `<div class="frame">` interno que ocupe o slide inteiro), nunca force `display` em todos os `section`. O jeito mais seguro é um wrapper interno:
>
> ```html
> <section class="surface-light"><div class="layout-cover"> … </div></section>
> ```
>
> Assim o `section` continua sob controle do reveal.js, e o `div` cuida do layout (`width:100%; height:100%; display:flex`). **Siga este padrão em todos os slides.**

## 7. Superfícies (fundos de slide)

Cada slide tem **exatamente uma** classe de superfície no `section`. O quadriculado faz parte da superfície.

| Classe | Fundo | Texto | Quadriculado | Quando usar |
|---|---|---|---|---|
| `surface-light` | `--c-paper` | `--c-basalt` | `--grid-line-light` | **padrão de todo o deck**: capa, conteúdo, tabelas, cartões |
| `surface-dark` | `--c-basalt` | `--c-sand`; títulos `--c-tint` | `--grid-line-dark` | só abertura de bloco e demos ao vivo, para marcar o ritmo; **no máximo 1 a cada ~4 slides** |
| `surface-accent` | `--c-accent` | `--c-ink` | `--grid-line-accent` | frase de efeito; **no máximo 1 a cada ~10 slides** |

```css
.surface-light {
  background-color: var(--c-paper);
  background-image:
    linear-gradient(var(--grid-line-light) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid-line-light) 1px, transparent 1px);
  background-size: var(--grid-cell) var(--grid-cell);
}
/* surface-dark e surface-accent: mesmo padrão, trocando as variáveis */

/* Cada superfície também define variáveis de tema que os layouts consomem,
   para o mesmo layout funcionar em qualquer fundo (nunca escreva cor fixa
   de claro ou de escuro dentro de um layout): */
/* --s-title (títulos), --s-sub (subtítulo), --s-meta (texto de apoio mono),
   --s-rule (linha tracejada), --s-eyebrow (rótulo e losangos), --s-num (número
   grande), --s-dot e --s-glow (esfera e seu brilho) */
```

> Use `data-background-color` do reveal.js **junto** com a classe (`data-background-color="#242628"`) para que o fundo da viewport acompanhe a transição.

## 8. Componentes (`css/componentes.css`)

Cada componente tem uma classe. Variações usam modificador `--`. Os nomes de classe ficam em inglês, e conteúdo e comentários em português.

### 8.1 Eyebrow (rótulo de seção)

```html
<p class="eyebrow">[ VISÃO GERAL ]</p>
```

Space Mono 24px, maiúsculas, tracking 0.08em, cor `--s-eyebrow` da superfície (`--c-basalt` no claro, `--c-accent` no escuro, `--c-ink` no âmbar). Opcionalmente leva cursor piscante: `<span class="cursor" aria-hidden="true"></span>`, um bloco de 14×30px com cor `--c-accent` e animação `blink` de 1s em `steps(1)`.

### 8.2 Chip

```html
<span class="chip">STEP 01 · DIA 1</span>
<span class="chip chip--accent">STEP 02 · DIA 2</span>
```

Space Mono 24px, padding `4px 14px`, cantos retos. Padrão: fundo `--c-basalt` com texto `--c-sand`. Em `surface-dark`: fundo `--c-basalt-2`. `chip--accent`: fundo `--c-accent` com texto `--c-ink`.

**Formas.** O chip pode ter pontas geométricas (mesmos `clip-path` do botão hexagonal, seção 8.4), com padding horizontal de 32px para o texto não encostar na ponta:

```html
<span class="chip chip--hex">STEP 01</span>   <!-- hexágono: pontas dos dois lados -->
<span class="chip chip--back">STEP 02</span>  <!-- ponta à esquerda, entalhe à direita -->
<span class="chip chip--arrow">STEP 03</span> <!-- seta para a direita -->
```

Formas combinam com as cores `chip--accent|orange|pink|blue|green|violet` (texto sempre `--c-ink`). **Glifos:** um marcador geométrico de 14px antes do texto, `<i class="glyph glyph--square|diamond|triangle glyph--accent" aria-hidden="true"></i>`. Círculo não entra: a regra de cantos retos só admite arredondar pílulas e nós de conector.

### 8.3 Pílula (Mux)

```html
<span class="pill">2 ENCONTROS · 190 MIN CADA</span>
```

Space Mono 24px, padding `10px 28px`, `border-radius: var(--radius-pill)`, fundo `--c-accent` com texto `--c-ink`. Variação `pill--outline`: fundo transparente com borda de 1px na cor do texto.

### 8.4 Botão hexagonal (Greptile)

Para links clicáveis (repositório, QR code, "ver exemplo"):

```css
.btn-hex {
  display: inline-flex; align-items: center;
  padding: 12px 36px;
  font: 500 var(--t-label)/1 var(--f-body);
  background: var(--c-accent); color: var(--c-ink);
  clip-path: polygon(16px 0, calc(100% - 16px) 0, 100% 50%,
                     calc(100% - 16px) 100%, 16px 100%, 0 50%);
  transition: filter var(--d-fast) var(--ease-out);
}
.btn-hex:hover { filter: brightness(1.08); }
.btn-hex--dark { background: var(--c-basalt); color: var(--c-sand); }
/* Par de botões (referência Greptile): `.btn-pair` > `.btn-hex.btn-hex--dark.btn-hex--back` + `.btn-hex` */
/* Seta para a esquerda (botão "voltar"): */
.btn-hex--back { clip-path: polygon(16px 0, 100% 0, calc(100% - 16px) 50%,
                                   100% 100%, 16px 100%, 0 50%); }
```

### 8.5 Cartão e moldura hachurada

```html
<div class="hatch">
  <article class="card"> … </article>
</div>
```

- `.hatch`: `padding: 12px; border: 1px solid var(--c-line); background: var(--hatch)`.
- `.card`: fundo `--c-white`, padding 44px, `display:flex; flex-direction:column; gap: var(--s-3)`.
- `.card--dark`: fundo `--c-basalt`, texto `--c-sand`, h3 `--c-tint`.
- `.card--accent`: fundo `--c-accent`, texto `--c-ink`. É o destaque do grupo, **no máximo 1 por slide**.
- Estrutura interna fixa: `chip` → `h3` → `p` (1 ou 2 linhas) → lista opcional (até 4 itens).

### 8.6 Moldura tracejada com losangos

Decoração de capa e de frase de efeito (Greptile):

```html
<div class="frame" aria-hidden="true">
  <i class="frame__diamond frame__diamond--tl"></i>
  <i class="frame__diamond frame__diamond--tr"></i>
  <i class="frame__diamond frame__diamond--bl"></i>
  <i class="frame__diamond frame__diamond--br"></i>
</div>
```

- `.frame`: `position:absolute; inset: var(--frame-inset); border: 1px dashed` (cor `--s-rule` da superfície).
- `.frame__diamond`: quadrado de 16px rotacionado 45°, centrado no canto, com a cor `--s-eyebrow` da superfície.

### 8.7 Conector com pontos (Mux)

Liga cartões ou etapas de um fluxo. É um SVG em camada absoluta sobre o layout:

```html
<svg class="connectors" viewBox="0 0 1920 1080" aria-hidden="true">
  <path class="connector" d="M640 442 H704" />
  <circle class="node" cx="704" cy="442" r="9" />
</svg>
```

- Traço de 2px `--c-basalt` (ou `--c-eggshell` no escuro), sem ponta de seta.
- Nó: círculo de 18px preenchido. O **último nó do fluxo** é `--c-accent` com borda basalt.
- Saltos de linha (fim de uma fileira para o início da seguinte) usam **traço tracejado** (`stroke-dasharray: 8 6`) em cotovelo.
- Os caminhos se desenham em sequência quando o slide fica ativo (seção 10.3).

### 8.8 Painel de gráfico/diagrama

`.hatch` > `.panel`, com fundo `--c-basalt` e padding 32px. Dentro vêm a legenda (marcador quadrado de 20px + rótulo mono), o SVG e uma linha de rótulos do eixo (Space Mono 24px, `justify-content: space-between`).

- Dentro do SVG: linhas de grade `--c-tint` a 15% de opacidade, curva principal `--c-tint` de 6px e marcadores **quadrados** (não círculos) de 24px.
- Textos de eixo e legenda ficam em HTML, nunca em `<text>` do SVG, para usar as fontes do projeto.

### 8.9 Cartão de código / diff (Greptile)

Para mostrar prompts, specs e trechos de código: cabeçalho com o caminho do arquivo (Space Mono, `--c-muted-dark`) e linhas numeradas com marcadores `01-` e `01+`. Linhas removidas têm fundo `--c-pink` a 25%; adicionadas, `--c-green` a 25%. Fonte Space Mono 24px, no máximo 12 linhas por cartão. As linhas adicionadas podem aparecer uma a uma (animação `digita`, seção 10.3) e o bloco pode ganhar a borda `marching-ants` enquanto "processa".

### 8.10 Rodapé

`.footer`: linha fixa a `bottom: 64px`, Space Mono 24px, `--c-muted`, com fonte, número do bloco do roteiro (ex.: `2.2 · DOR 02`) ou link. O slide com rodapé usa `padding-bottom: var(--slide-pad-bottom)`.

### 8.11 Marcadores decorativos

Quadrados soltos de 12 a 24px em `--c-blue`, `--c-pink` ou `--c-accent`, com borda de 2px basalt quando sobre `surface-accent`. Use **no máximo 3 por slide**, sempre `aria-hidden`.

### 8.12 Robôs (mascotes)

Ilustrações planas em **SVG inline**, **geradas por `js/robos.js`** (sem build): uma camada base compartilhada mais uma configuração por robô. Inline porque a animação é por CSS, e CSS não alcança dentro de `<img>`. Os robôs são montados no carregamento da página, então também aparecem no `?print-pdf`.

**Silhuetas diversas (arquétipos).** Cada papel tem um **molde próprio**, como nos mascotes da Mux. Robôs com o mesmo formato são proibidos: dois robôs só podem repetir a cor, nunca a silhueta.

| Papel | Silhueta | Cor | Tela / marca |
|---|---|---|---|
| Plan | monitor alto e estreito, com coluna lateral | `--c-pink` | olho na tela; painel inferior com onda |
| Build | gordinho e baixo, dois bulbos de olho, mãos flutuantes | `--c-green` | `/` pulsando; mostrador |
| Harness | humanoide alto com capacete: arnês cruzado no peito (fivela com cadeado) e cinto com ferramentas penduradas | `--c-orange` | viseira com olhos; lâmpada do capacete e fivela pulsando |
| AGENTS.md | microfone na cabeça, fones e garras em C | `--c-blue` | visor `< _ >` com **cursor piscando** |
| Skills | bola sobre esteira, com garras | `--c-accent` (âmbar) | painel com 3 **cartuchos**, um encaixando |
| Modelo | orbe flutuante com propulsor | `--c-violet` | **rede de nós** pulsando |

- **Cada robô tem a própria cor** (6 robôs, 6 cores de apoio, incluindo o violeta). O corpo é sempre claro (`--c-sand`, metade direita `--c-muted-dark`) com **uma cor só**: nunca corpo escuro nem duas cores de apoio misturadas.
- **Nunca copie um mascote existente** (da Mux ou de qualquer marca): use o estilo como referência e invente o desenho a partir do conceito do papel. O Harness, por exemplo, é "a estrutura que prende e carrega as ferramentas", então vira um robô de capacete com arnês e cinto de ferramentas, e não um monitor em pedestal.
- Peças comuns: corpo em dois tons com contorno `--c-ink`, parafusos com fenda, tela com moldura dupla e reflexo, LEDs, ranhuras de alto-falante, antena (`quadrado`, `losango`, `bandeira`, esfera ou dupla), mãos de 3 dedos ou garras em C, e sombra no chão.
- **Acabamento fino (referência: ilustrações da Mux).** Três espessuras de traço, em variáveis no `.robot`: contorno do corpo `--r-sw-contorno` (2,5px), peças `--r-sw` (2px) e detalhes `--r-sw-fino` (1,25px). Detalhes de superfície gerados pelas peças comuns de `js/robos.js`: **hachura** diagonal fina na metade sombreada de baixo (`hachura`), **brilho** branco acompanhando o canto superior esquerdo (`brilho`), **emendas** de painel com mini-rebites (`emenda`), pontos de **luz** em olhos, antenas e LEDs (`luz`), reflexo de tela em duas linhas diagonais, solas e esteiras com elos. Cada arquétipo soma os próprios detalhes (juntas, anéis nos tubos, malha do microfone, ilhoses do cinto, etiquetas dos cartuchos) sem mudar a silhueta. A camada de pessoa segue o mesmo acabamento: fios no cabelo e no bigode, óculos com ponte em arco e reflexo nas lentes.
- Cada robô é alinhado pelo chão e tem o próprio tamanho (um gordinho é mais baixo que um monitor alto).

**Duas versões de cada robô** (decidimos depois qual usar):
- **Neutra:** só a identidade do papel; legenda é o papel, sem nome de pessoa.
- **Com traços de pessoa** (`traco` em `EQUIPE`; cada arquétipo declara onde ficam a cabeça, os olhos, o queixo e os braços, e a camada de pessoa se ancora ali): óculos, cabelo (`regua`, `crespo`, `medio`), bigode, tatuagens (`zigzag`, `vinha`) e porte (`largo`, `maior`, `alto`). "Mais alto" é um `viewBox` maior com a mesma largura em px, para os robôs ficarem alinhados pelo chão. A legenda passa a ser o nome em chip + o papel em uma linha. Sem cargo de apresentador ou monitor.
- Trocar de versão é trocar `data-traco="off|on"`; trocar quem é qual robô é editar `EQUIPE` em `js/robos.js` (único lugar).
- Os robôs são de metal: **cor de pele e etnia não são representadas**. Traço não descrito pela pessoa (por exemplo, cabelo) fica de fora; nada é inventado.

**Regras gerais.**
- **Exceção à regra de cantos retos:** ilustrações podem usar raio de até 8px.
- Sem `<text>` dentro do SVG. Cada SVG leva `role="img"` e `aria-label` gerado (papel, e nome e traços quando há).
- Legenda em chip HTML abaixo do robô, sobre uma linha de chão de 2px.
- Classes de animação: `.bob` (tronco e cabeça), `.r-eye`, `.r-arm--acena`, `.r-wave`, `.r-pulse`, `.r-cursor`, `.r-insere`, `.r-no`, `.r-ping`. Todas só rodam no slide ativo e param com `prefers-reduced-motion`.

### 8.13 Malha (wireframe em canvas)

Efeito de duas esferas tangentes em wireframe (anéis de latitude e meridianos que deslizam, com leve oscilação 3D), desenhado em canvas dentro de uma moldura `.hatch` > `.panel` clara. Linhas na cor `--c-blue` (lida do `color` do canvas) a ~50% de opacidade. No centro, uma imagem de 72px em dithering Bayer na cor `--c-orange`, e 2 a 3 `.mark` flutuando. Largura da figura: ~850px (`layout-text-figure`).

### 8.14 Selo

`<span class="stamp">VAGO</span>`: Anybody 800, 44px, caixa alta, fundo em cor de apoio (`--c-orange` para problema, `--c-green` para ok), texto `--c-ink`, borda de 4px `--c-ink`, rotação de −5°. Entra como fragment com a animação `stamp`. Texto colorido sobre fundo claro é proibido (seção 5.1), por isso o selo é sempre preenchido.

## 9. Layouts (`css/layouts.css`)

Cada slide usa **um** layout, num `div` wrapper que ocupa o slide inteiro. A área útil é de 1664×824 (ou 1664×792 com rodapé).

| Layout | Estrutura | Superfície típica |
|---|---|---|
| `layout-cover` | eyebrow (topo) · display + subtítulo + pílula (meio) · linha de rodapé tracejada (base) · esfera à direita | light |
| `layout-title` | eyebrow + h2 no topo, conteúdo livre abaixo (`gap: 64px`) | light |
| `layout-two-cards` | `layout-title` + 2 cartões lado a lado (`gap: 96px`) ligados por conector com nós | light |
| `layout-statement` | eyebrow (topo) · frase display em até 2 linhas · linha de apoio (base) · moldura + flutuantes | accent ou dark |
| `layout-text-figure` | `layout-title` + linha com texto (flex 1) e painel/figura (largura fixa de ~850px) | light |
| `layout-robots` | `layout-title` + 3 colunas, cada uma com robô sobre linha de chão e legenda (chip + 1 a 2 linhas). Variante `layout-robots--six`: 6 colunas, robô de 240px, legenda em 24px com até 3 linhas | light |
| `layout-code` | `layout-title` + cartão de código/diff (~1000px) e coluna lateral com chips e selos | light |
| `layout-steps` | `layout-title` + grade 3×2 (colunas de 512px, linhas de 276px, gap de 64px) + conectores em serpentina | light |
| `layout-table` | `layout-title` + tabela (Space Mono nos cabeçalhos, DM Sans 28px nas células, linhas de 1px `--c-line`) | light |
| `layout-quote` | aspas grandes `--c-accent`, citação DM Sans 600 48px, autor em chip | light |
| `layout-section` | abertura de bloco do roteiro: número grande (`1.3`) em Anybody, título e horário em mono, com barra `--c-accent` sob o número | dark |
| `layout-demo` | aviso de demo ao vivo: eyebrow `[ DEMO AO VIVO ]` com cursor piscante, título e o que observar | dark |

Regras:

- **O título fica sempre no topo**, na mesma posição em todos os slides do mesmo tipo. Nunca centralizado verticalmente.
- **Uma ideia por slide.** Listas com mais de 5 itens viram tabela, cartões ou dois slides.
- **Se o conteúdo não couber, divida o slide.** Nunca diminua a fonte.

## 10. Movimento (`css/animacoes.css` + `js/efeitos/`)

### 10.1 Transições entre slides

- Padrão: `fade`, configurado globalmente.
- `data-auto-animate` entre slides consecutivos que compartilham elementos (mesmo `data-id`). Por exemplo: uma etapa do SDD ganha destaque no slide seguinte.
- Proibido usar `zoom`, `convex` ou `concave`.

### 10.2 Fragments customizados

Os fragments do reveal.js recebem a classe `.visible` ao aparecer. Os nossos:

```css
/* Título surge desfocado → nítido (Greptile) */
.reveal .fragment.blur-in {
  opacity: 0; filter: blur(12px); transform: translateY(16px);
  transition: opacity var(--d-slow) var(--ease-out),
              filter  var(--d-slow) var(--ease-out),
              transform var(--d-slow) var(--ease-out);
}
.reveal .fragment.blur-in.visible { opacity: 1; filter: blur(0); transform: none; }

/* Item sobe suavemente */
.reveal .fragment.rise { opacity: 0; transform: translateY(24px);
  transition: all var(--d-base) var(--ease-out); }
.reveal .fragment.rise.visible { opacity: 1; transform: none; }

/* Marcador "carimba" (Greptile: keyframe stamp) */
.reveal .fragment.stamp.visible { animation: stamp var(--d-base) var(--ease-out) both; }
```

Também há **entrada automática** ao chegar no slide, sem clique: elementos com `.enter` animam quando o `section` ganha `.present`, com atraso escalonado por `style="--i: 0..n"` × `--stagger`. Use `.enter` para a decoração e o que é sempre visível, e fragment para o que o apresentador revela na hora.

### 10.3 Catálogo de animações

| Nome | O quê | Onde |
|---|---|---|
| `blur-in` | título desfocado → nítido, 900ms | display e títulos de abertura |
| `blink` | cursor de bloco piscando, 1s em steps | eyebrow da capa e `layout-demo` |
| `float-square-1..3` | quadrados derivando (translate + rotate), 7 a 13s em loop | `layout-statement` |
| `draw` | conector se desenhando (`stroke-dashoffset` → 0), 600ms cada, em sequência | `layout-two-cards`, `layout-steps` |
| `marching-ants` | borda tracejada andando (`stroke-dashoffset: -10px`, loop) | destacar algo "em processamento" |
| `stamp` | escala 2→1 com leve rotação | marcador "quebrou", "ok" |
| `malha` | duas esferas tangentes em wireframe girando, em canvas, com imagem pixelada central | `layout-text-figure` |
| `bob` | robô flutua 5px, 3,2s em loop | `layout-robots` |
| `onda-move` | onda lisa da tela do robô Plan correndo, 1,2s linear em loop | `layout-robots` |
| `blink-eye` | olho do robô pisca (`scaleY`), 4s em loop | `layout-robots` |
| `wave` | mão do robô acena (±14°), 1,6s em loop | `layout-robots` |
| `cursor-r` | cursor do robô AGENTS.md piscando, 1s em `steps` | `layout-robots` |
| `insere` | cartucho do robô Skills deslizando para dentro da ranhura, 3s em loop | `layout-robots` |
| `no-pulse` | nós da rede do robô Modelo pulsando, escalonados por `--i` | `layout-robots` |
| `ping` | ponta da antena do robô crescendo 18%, em loop | `layout-robots` |
| `wave-run` | tracejado correndo na onda da tela do robô | `layout-robots` |
| `digita` | linha de código revelada da esquerda para a direita (`clip-path` + `steps()`), escalonada por `--i` | `layout-code` |
| `esfera` | esfera pontilhada (dithering Bayer 4×4) girando, em canvas, com brilho do acento | capa e encerramento |

Keyframes de referência, adaptados do CSS da Greptile:

```css
@keyframes blink { 50% { opacity: 0; } }
@keyframes float-square-1 {
  0%,100% { transform: translate(0,0) rotate(0); }
  25% { transform: translate(30px,-20px) rotate(15deg); }
  50% { transform: translate(-20px,30px) rotate(-10deg); }
}
@keyframes stamp {
  0% { opacity: 0; transform: scale(2) rotate(-15deg); }
  60% { opacity: 1; transform: scale(1) rotate(-5deg); }
  100% { transform: scale(1) rotate(-5deg); }
}
@keyframes draw { to { stroke-dashoffset: 0; } }
```

**Esfera** (`js/efeitos/esfera.js`): um canvas de 560×560 com grade de células de 7px. Para cada célula dentro do círculo, calcule a iluminação de Lambert com uma luz que gira, misture 20% de um padrão de faixas de longitude e latitude e acenda a célula se o valor passar o limiar da matriz Bayer 4×4. As células são quadrados de 5px na cor `--s-dot` da superfície (`--c-blue` no claro, `--c-tint` no escuro), lida do CSS do canvas, e o canvas leva `filter: drop-shadow(0 0 6px var(--s-glow))` (brilho azul no claro, âmbar no escuro). A rotação é de cerca de 0,015 rad por quadro.

### 10.4 Desempenho e acessibilidade do movimento

- **Animações em loop e canvas só rodam no slide ativo.** `syncEffects()` liga os efeitos do `Reveal.getCurrentSlide()` e pausa os demais (`cancelAnimationFrame`, `animation-play-state: paused`).
- Anime só `transform`, `opacity` e `filter`, nunca largura, altura ou posição.
- Respeite a preferência por menos movimento:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
  .reveal .fragment { filter: none !important; transform: none !important; }
}
```

E no JS: se `matchMedia('(prefers-reduced-motion: reduce)').matches`, a esfera desenha um quadro só e para.

## 11. Conteúdo e voz

- Idioma **pt-BR**. Termos técnicos consagrados ficam em inglês (*prompt*, *harness*, *one-shot*, *vibe coding*).
- Os títulos são **substantivos ou frases curtas**, com a mesma gramática ao longo do deck. Nada de títulos de efeito do tipo "Não é X, é Y".
- O texto vem do roteiro: cada slide começa com um comentário que aponta o bloco de origem (`<!-- 2.2 Dor 2 -->`).
- **Nunca invente número, estatística ou citação.** Gráficos ilustrativos levam no rodapé "ilustrativo".
- Para o público iniciante, o corpo tem no máximo 25 palavras por bloco. O detalhe vai para as notas.

## 12. Notas do apresentador

- Toda fala que não está no slide vai em `<aside class="notes">`, como último filho do `section`.
- A tecla `S` abre a visão do apresentador (plugin Notes), com notas, próximo slide e cronômetro.
- Em cada nota, comece com o tempo previsto do bloco, por exemplo `[4 min]`.

## 13. Acessibilidade

- Contraste: só os pares da seção 5.1.
- Todo `<img>` tem `alt`. Toda decoração (moldura, losangos, quadrados, esfera) tem `aria-hidden="true"`.
- SVGs informativos têm `role="img"` e `aria-label`.
- Cor nunca é o único sinal: "quebrou" e "funcionou" têm rótulo de texto, além da cor.
- Legível no fundo da sala: nada abaixo de 24px no canvas de 1920.

## 14. Publicação no GitHub Pages

1. O repositório público do workshop, com `index.html` na raiz da branch `main`.
2. Crie um `.nojekyll` vazio na raiz.
3. Em *Settings → Pages*, escolha *Deploy from a branch*, depois `main` e `/ (root)`.
4. A URL fica `https://<usuario>.github.io/<repositorio>/`. Gere o link curto e o QR code para o telão.
5. O material do Dia 2 pode ficar numa branch separada e ser mesclado na `main` só no segundo encontro, como prevê o roteiro.
6. **Plano B offline:** baixe uma cópia local do reveal.js 6.0.1 e das fontes para `vendor/` e mantenha um `index-offline.html` que aponte para ela, para o caso de a rede do laboratório falhar.
7. **PDF de backup:** abra a apresentação com `?print-pdf` no Chrome e imprima em PDF. As animações ficam congeladas, mas o conteúdo fica salvo.

## 15. O que evitar

- Carregar qualquer tema de `reveal.js/…/theme/`.
- A "cara de site de IA": gradiente roxo, cartões com sombra, emojis no lugar de ícones, texto genérico de marketing.
- Cantos arredondados fora das pílulas e dos nós, e sombras de qualquer tipo.
- Mais de um cartão `--accent` ou mais de 3 marcadores decorativos por slide.
- Texto em `<text>` de SVG, estilo inline de aparência, `!important` fora do bloco de reduced-motion.
- Mudar a versão do reveal.js num arquivo só.
- Animações que rodam fora do slide ativo.

## 16. Critérios de aceitação

Um slide ou mudança só está **pronto** quando:

- [ ] usa uma superfície (seção 7) e um layout (seção 9), sem estilo inline de aparência;
- [ ] todo texto está num par de contraste aprovado e com 24px ou mais;
- [ ] o título está na posição padrão do layout, sem pular entre slides do mesmo tipo;
- [ ] o conteúdo cabe em 1664×824 sem reduzir a fonte;
- [ ] decorações têm `aria-hidden`, imagens têm `alt` e gráficos têm `aria-label`;
- [ ] animações em loop param fora do slide ativo e somem com `prefers-reduced-motion`;
- [ ] há notas do apresentador com o tempo do bloco;
- [ ] o comentário de origem (bloco do roteiro) está presente;
- [ ] funciona em 1920×1080 e em 1366×768 (escala do reveal), no Chrome;
- [ ] o `?print-pdf` gera um PDF legível.

### Histórico

| Data | Mudança |
|---|---|
| 2026-10-29 | v1.0: fundação inicial (reveal.js 6.0.1, estilo Greptile + Mux) |
| 2026-10-29 | v1.1: paleta azul e violeta; tokens renomeados (`green`→`accent`, `lichen`→`tint`, `pollen`→`sky`, `orchid`→`lilac`) e `surface-green`→`surface-accent` |
| 2026-10-29 | v1.2: paleta inspirada no site da Mux (carvão, cinza-esverdeado, acento âmbar; laranja, rosa, azul e verde de apoio). Tokens: `lilac`→`pink`, `sky`→`blue`, `newt`→`orange`, `pond` removido, `green` (ok) novo; chips e marcadores coloridos |
| 2026-10-29 | v1.3: tema predominantemente claro (capa e quote passam a `surface-light`; `surface-dark` só em abertura de bloco e demos). Variáveis de tema por superfície (`--s-*`) para os layouts funcionarem em qualquer fundo. Esfera azul no claro |
| 2026-10-29 | v1.4: formas e glifos geométricos nos chips; par de botões; robôs (8.12); malha (8.13); selo (8.14); layouts `layout-robots` e `layout-code`; novas animações no catálogo; diff adicionado passa a verde |
| 2026-10-29 | v1.5: robôs passam a ser gerados por `js/robos.js` (cabeça e tronco, mais detalhes), 6 papéis (Plan, Build, Harness, AGENTS.md, Skills, Modelo), versões neutra e com traços de pessoa, layout de 6 colunas |
| 2026-10-29 | v1.6: robôs com silhuetas diversas (arquétipos por papel, como na Mux); Modelo deixa de ser escuro e passa a rosa; corpo sempre claro e com uma cor só |
| 2026-10-29 | v1.7: Harness redesenhado como pórtico com núcleo, ferramentas e cadeado (deixa de ser cópia do mascote da Mux); painel inferior do Plan com onda lisa; Modelo passa a violeta (sexta cor de apoio, `--c-violet`) para nenhum robô repetir cor |
| 2026-10-29 | v1.8: Harness vira humanoide alto com capacete, arnês em X e cinto de ferramentas; Modelo com cabeça e tronco em proporção |
| 2026-10-29 | v1.9: certificado de participação (seção 18), A4 paisagem; proposta B escolhida e exibida em tela cheia no deck |
| 2026-10-29 | v1.10: robôs com acabamento fino (8.12): hierarquia de traço 2,5 / 2 / 1,25px e detalhes de superfície (hachura, brilho, emendas com rebites, pontos de luz), na linha das ilustrações da Mux; silhuetas, cores e traços de pessoa inalterados |

## 17. Referências

- Greptile, site e guia de marca (paleta, tipografia, molduras hachuradas, botões hexagonais, animações): https://www.greptile.com/ e https://www.greptile.com/design
- Mux, site (quadriculado, títulos largos em caixa alta, conectores com nós, pílulas, cursor piscando): https://www.mux.com/
- reveal.js, documentação e configuração: https://revealjs.com/ e https://revealjs.com/config/
- reveal.js, notas de versão (mudanças da 6.0): https://github.com/hakimel/reveal.js/releases
- Protótipo visual (deck de 5 slides no Claude), que serviu de primeira validação deste estilo.

## 18. Certificado

Certificado de participação (proposta B, escolhida), em `certificado-b.html` com `css/certificado.css` e `js/certificado.js`. Reaproveita tokens, superfícies, chips, pílula, moldura, marcadores e esfera.

- **Canvas:** 1920×1358 (A4 paisagem), escalado para a janela. Impressão: `@page` A4 paisagem, 1 página, com fundos ligados.
- **Visual (escuro, faixa âmbar):** `surface-dark` com faixa `surface-accent` à esquerda (esfera pontilhada e 2 marcadores), cartões dos dois dias e duas linhas de assinatura em branco (sem nomes de pessoas).
- **No deck:** um slide em tela cheia logo após a capa (`layout-certfull`): iframe do certificado reduzido a 79,53% para ocupar a altura de 1080, centralizado sobre `surface-dark`, com botão "Abrir" para o tamanho real. Dentro do iframe a esfera fica parada.
- **Parâmetros de URL:** `?nome=…&dia1=…&dia2=…`. Nome com mais de 28 caracteres usa o título longo (seção 5.2).
- **Pendente de confirmação:** datas, nome do projeto de extensão e da instituição, e carga horária (6h20 = 2 × 190 min, derivada do roteiro).
