# AGENTS.md: regras do projeto

> Oficina de Desenvolvimento com IA. Slides servidos como site no GitHub Pages.
> Leandro Amaral

Dois arquivos guiam o projeto, para quem escreve código à mão e para agentes de IA (OpenCode, Claude, Copilot):

- **`DESIGN.md`:** só o visual da apresentação. Antes de criar ou alterar qualquer slide, leia o DESIGN.md e siga-o à risca.
- **`AGENTS.md` (este arquivo):** todo o resto: notas, escopo, stack, arquivos, conteúdo e voz, uso das peças no deck, certificado e ementa (fora o visual), publicação, revisão e referências. O histórico de mudanças fica no Git.

Se algo estiver errado ou faltando, **corrija o arquivo certo primeiro** e só depois o código. É a mesma regra de ouro que a oficina ensina. Regra nova vai para o DESIGN.md só se for sobre o visual; o resto entra aqui.

---

## 1. Notas do apresentador

- O autor não usa as notas (`<aside class="notes">`) na apresentação. **Ignore-as:** não escreva, não atualize, não leve conteúdo para elas e não conte com elas para cobrir um tópico. O que precisa ser dito fica no slide ou sai.
- O Dia 1 não tem notas: todas foram removidas em 2026-11-26. No Dia 2 e na referência de UI, as que já existem continuam no HTML, mas não são mantidas e não servem de referência (nem os tempos `[N min]`).
- A tecla `S` continua abrindo a visão do apresentador (plugin Notes), com o próximo slide e o cronômetro.
- Se um tópico muito específico parecer precisar de nota, pare e discuta com o autor antes. Só ele define o que vai para as notas.

## 2. Objetivo e escopo

- **O que é:** um site estático com as apresentações dos dois dias da oficina, construído com reveal.js e publicado no GitHub Pages.
- **Por que site e não PowerPoint:** a identidade visual depende de animação, CSS e efeitos em canvas, que se perdem em .pptx ou PDF.
- **De onde vem o conteúdo:** do documento *Roteiro Final, Oficina de Desenvolvimento com IA*. O DESIGN.md e este arquivo definem **forma e regras**. O roteiro define **o que** cada slide diz.
- **Fora do escopo:** backend, login, analytics e frameworks de UI (React, Vue etc.).

## 3. Stack e restrições

| Item | Decisão |
|---|---|
| Motor de slides | **reveal.js 6.0.1**, carregado do cdnjs. A versão é fixa e nunca vira `latest` |
| Build | **Nenhum.** HTML, CSS e JS puros, abertos direto no navegador |
| Tema do reveal.js | **Nenhum tema pronto.** Só `reset.css` e `reveal.css`; o tema é o do DESIGN.md (seção 3) |
| Plugins | `RevealNotes` (notas do apresentador) e `RevealHighlight` (código), só se houver código |
| Fontes | Google Fonts: Anybody, DM Sans e Space Mono (link no DESIGN.md, seção 2.2) |
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

> **Atualizar o reveal.js:** trocar o número da versão em todos os links ao mesmo tempo, testar os dois dias inteiros e descrever a mudança na mensagem de commit. A série 6.x mudou os caminhos de plugins em relação à 5.x, então nunca misture versões. A configuração do `Reveal.initialize` está no DESIGN.md, seção 1.

## 4. Estrutura de arquivos

```
/
├── index.html            # página inicial: título da oficina + dois cartões, um para cada dia
├── dia-1.html            # apresentação do Dia 1 (Vibe coding)
├── dia-2.html            # apresentação do Dia 2 (Spec-Driven Development)
├── referencia-ui.html    # deck de referência de UI (todas as peças); NÃO apagar, NÃO linkar: acesso só pela URL
├── certificado-b.html    # certificado de participação (seção 7; visual no DESIGN.md, seção 12)
├── ementa.html           # ementa da oficina, página para circular como link (seção 7); NÃO linkar na home
├── css/
│   ├── tokens.css        # variáveis: cores, tipografia, espaços, movimento (DESIGN 2)
│   ├── base.css          # neutraliza padrões do reveal.js + estilos globais (DESIGN 3)
│   ├── componentes.css   # peças reutilizáveis (DESIGN 5)
│   ├── layouts.css       # esqueletos de slide (DESIGN 6)
│   ├── animacoes.css     # keyframes, fragments customizados, reduced-motion (DESIGN 7)
│   ├── certificado.css   # certificado (DESIGN 12)
│   └── ementa.css        # ementa (DESIGN 13)
├── js/
│   ├── main.js           # Reveal.initialize + liga/desliga efeitos por slide
│   ├── robos.js          # robôs (mascotes) em SVG inline (DESIGN 5.12)
│   ├── certificado.js    # certificado
│   ├── ementa.js         # liga a esfera da ementa
│   └── efeitos/
│       ├── esfera.js     # esfera pontilhada (canvas): referência de UI, certificado e ementa
│       ├── codigo.js     # prompt que vira cascata de código (canvas): capa do Dia 1
│       ├── planta.js     # peças traçadas e construídas em sequência (canvas): capa do Dia 2
│       ├── malha.js      # duas esferas em wireframe (canvas): janela de contexto
│       ├── rede.js       # malha azul que respira (canvas): figura do MCP
│       └── flutuantes.js # quadrados flutuantes
├── assets/
│   ├── img/              # imagens e capturas (PNG/WebP/SVG); memes parados em img/memes/; prévia da ementa em img/ementa-og.png, com o molde img/ementa-og.html
│   ├── svg/              # ilustrações e diagramas
│   └── video/            # cenas de filme recortadas: .webm + .mp4 + pôster .png
├── .nojekyll             # evita o processamento Jekyll do GitHub Pages
├── AGENTS.md             # regras do projeto (tudo que não é visual)
└── DESIGN.md             # visual da apresentação
```

Regras:

- **Referência de UI:** `referencia-ui.html` não aparece na home nem em nenhum outro link.
- **Uma apresentação por arquivo HTML.** Os slides ficam em `<section>` dentro de `.slides`, com um comentário curto antes de cada slide que diz o tema, por exemplo `<!-- Harness: conceito -->`. O número do bloco do roteiro (1.2, 2.3…) não entra no código.

## 5. Conteúdo e voz

- Idioma **pt-BR**. Termos técnicos consagrados ficam em inglês (*prompt*, *harness*, *one-shot*, *vibe coding*).
- **O evento se chama "oficina", nunca "workshop"**: no slide, nos títulos de página, no certificado e na documentação (`[ OFICINA · 2 DIAS ]`, "Oficina de Desenvolvimento com IA", "participou da oficina"). Atenção ao gênero: **a** oficina. Pelo mesmo motivo, prática dos alunos é "mão na massa", não "hands-on": toda demo e toda prática usam o eyebrow `[ MÃO NA MASSA ]`.
- Os títulos são **substantivos ou frases curtas**, com a mesma gramática ao longo do deck. Nada de títulos de efeito do tipo "Não é X, é Y".
- O texto vem do roteiro.
- **O número do bloco do roteiro (1.2, 2.3…) não aparece no slide nem no código.** O eyebrow leva o tema (`[ TOKENS ]`, `[ HARNESS ]`). Motivo: o deck não percorre todos os blocos em ordem, e um número solto (abrir no 1.2 sem ter passado pelo 1.1) confunde a turma.
- **Nunca invente número, estatística ou citação.** Gráfico ilustrativo leva "ilustrativo" na legenda do painel. Gráfico que vem de um artigo usa os números da tabela publicada.
- **Tokens:** cortes e números vêm do tokenizer de verdade (o200k_base, o do GPT-4o), nunca inventados. Palavra solta é cortada diferente da mesma palavra no meio da frase; os exemplos do roteiro usam **espaço antes da palavra**.
- Para o público iniciante, o corpo tem no máximo 25 palavras por bloco. O detalhe fica na fala do apresentador, fora do slide.
- **Nada de data, horário ou duração do evento no slide:** nem na capa, nem na abertura de bloco, nem na home, nem em pílula. O cronograma muda e o slide não deve envelhecer junto. **Exceções:** a ementa (seção 7), que é convite e mostra o dia e o horário de início de cada encontro, nunca o horário de fim nem a duração; e a data de lançamento de modelos (mês/ano) como dado factual no panorama de modelos gratuitos do OpenCode.
- **Só cite no slide o que já existe.** Arquivo, link, repositório ou comando que a turma vai procurar precisa existir antes de entrar no slide. O que ainda está por fazer (por exemplo, o repositório da oficina previsto no roteiro) fica fora do slide; avise o autor da pendência.
- **Fatos de ferramenta são conferidos na documentação oficial:** comandos, atalhos, nomes de agentes e de modelos, onde ficam os arquivos. O que não se confirmar não entra no slide; avise o autor para conferir na máquina antes da aula.
- **Cada slide traz algo novo.** Uma ideia-chave do roteiro que não rende um slide com conteúdo próprio (por exemplo, uma frase de efeito que só resume a tabela anterior) entra no slide vizinho ou sai. Decida com o autor.
- **Meme e cena de filme:** o texto do slide explica o conceito; a cena é a metáfora visual, que o apresentador amarra na fala. Nada de "personagem X = conceito Y" no slide.
- **Slide de meme** (DESIGN 5.31): vem logo antes do slide que explica o assunto e abre a conversa; o slide seguinte responde.

## 6. Uso das peças no deck

Onde as peças do DESIGN.md aparecem hoje. Os números de slide mudam quando slides entram ou saem: confira antes de citar.

- **Painel de gráfico `.chart` (DESIGN 5.8):** slide "Curva em U" do Dia 2, que também apresenta o estudo *Lost in the Middle*.
- **Barras de probabilidade (DESIGN 5.16):** slide 6 do Dia 1 (O próximo token) e slide 20 (Esforço de raciocínio), que usa as barras para os tokens de raciocínio de low a max, sem porcentagem.
- **Robô AGENTS.md (DESIGN 5.12):** sem uso nos decks desde a v1.35 (o AGENTS.md saiu da oficina), só na referência de UI.
- **Janela de contexto (DESIGN 5.17):** no Dia 1, só no slide 14 (Quem cuida da janela). O slide "Quando a janela enche" do bloco de tokens saiu na v1.34. A versão em história (5.27) segue no Dia 2.
- **Harness em volta do modelo (DESIGN 5.19):** fora do deck desde a v1.33. No slide 13 do Dia 1 (O que é harness), a cena de Ratatouille (5.29) ocupa o lugar da figura, e as 4 partes do harness vão numa lista com chip (5.30, primeiro uso da peça), nas cores que tinham na figura.
- **Arquivos na hora certa (DESIGN 5.26):** fora do deck desde a v1.36. O slide "Vários arquivos pequenos" saiu do Dia 2, porque mostrava os arquivos do SDD antes da hora. Desde a v1.38 cada arquivo tem um slide próprio, sem esta figura.
- **Slides de meme (DESIGN 5.31):** Dia 1, slides 19 (antes de "Esforço de raciocínio") e 23 (antes de "Planejar antes vale a pena?"); Dia 2, slide 1 (retomada).
- **`layout-code__row--center` (DESIGN 6):** slides de arquivo do Dia 2 (constituição, spec, plano e tarefas).
- **Fora do deck, mas no repositório:** a cena da Dory e a capa de "Como Se Fosse a Primeira Vez" (à espera de um lugar novo) e o meme `assets/img/memes/source-trust-me.png` (saiu na v1.45).

## 7. Certificado e ementa

O visual dos dois está no DESIGN.md (seções 12 e 13). Aqui fica o resto.

**Certificado** (`certificado-b.html`):

- **Parâmetros de URL:** `?nome=…&dia1=…&dia2=…`.
- **Pendente de confirmação:** datas, nome do projeto de extensão e da instituição, e carga horária (6h20 = 2 × 190 min, derivada do roteiro).

**Ementa** (`ementa.html`):

- Página de divulgação feita para **circular como link** (WhatsApp, e-mail, redes). Como a referência de UI, não aparece na home nem em nenhum link do deck. Das três propostas da v1.39, a escolhida foi a A.
- **Conteúdo:** título "Oficina de desenvolvimento com IA" (sem eyebrow, porque o título já diz "oficina"); os dois dias com os nomes Vibe coding e Spec-Driven Development; as tecnologias Python, Django, SQLite, Tailwind, Docker, OpenCode, Git e Spec Kit.
- **Datas:** dia e horário de início, nunca o de fim nem a duração (exceção da seção 5).
- **Spec Kit:** aparece como referência (a oficina faz o SDD à mão, no padrão dele), nunca como ferramenta que a turma vai instalar.
- **Prévia do link:** `<title>`, `meta description`, Open Graph (`og:title`, `og:description`, `og:url`, `og:image`) e `twitter:card` `summary_large_image`. A imagem `assets/img/ementa-og.png` fica abaixo de 300 KB, para o WhatsApp mostrar a prévia. As URLs de `og:url` e `og:image` são absolutas, no endereço do GitHub Pages. **Se o conteúdo mudar (datas, nomes dos dias), atualize o molde `assets/img/ementa-og.html` e capture de novo** numa janela de 1200×630.

## 8. Publicação no GitHub Pages

1. O repositório público da oficina, com `index.html` na raiz da branch `main`.
2. Crie um `.nojekyll` vazio na raiz.
3. Em *Settings → Pages*, escolha *Deploy from a branch*, depois `main` e `/ (root)`.
4. A URL fica `https://<usuario>.github.io/<repositorio>/`. Gere o link curto e o QR code para o telão.
5. O material do Dia 2 pode ficar numa branch separada e ser mesclado na `main` só no segundo encontro, como prevê o roteiro.
6. **Plano B offline:** baixe uma cópia local do reveal.js 6.0.1 e das fontes para `vendor/` e mantenha um `index-offline.html` que aponte para ela, para o caso de a rede do laboratório falhar.
7. **PDF de backup:** abra a apresentação com `?print-pdf` no Chrome e imprima em PDF. As animações ficam congeladas, mas o conteúdo fica salvo.

## 9. Revisão e critérios de aceitação

**Fluxo antes de cada commit:** toda mudança de conteúdo nos slides (texto, ordem, slide que entra ou sai) volta para o roteiro (`Workshop de Desenvolvimento com IA.md`, na raiz) antes do commit. O roteiro é a fonte do conteúdo, então ele precisa descrever o deck como ele está. Em seguida, confira os números de slide citados neste arquivo (seção 6). O roteiro nunca entra no commit.

Ao revisar e pedir ajustes, cite o slide pelo **número da URL** (`dia-1.html#/16` é o slide 16; a capa é o 0), não pelo bloco do roteiro. O número muda quando slides entram ou saem: confira antes de citar.

Um slide ou mudança só está **pronto** quando cumpre os critérios visuais do DESIGN.md (seção 10) e também:

- [ ] não há data, horário nem duração no slide;
- [ ] todo arquivo, link, comando e fato de ferramenta citado existe e foi conferido na fonte;
- [ ] há um comentário com o tema antes do slide, sem número de bloco do roteiro;
- [ ] o roteiro foi atualizado com a mudança, antes do commit;
- [ ] foi conferido no navegador **com recarga sem cache**: o `http.server` local não invalida CSS, e o navegador pode mostrar a versão antiga.

O que evitar, além do que o DESIGN.md lista (seção 9):

- Mudar a versão do reveal.js num arquivo só.
- Data, horário ou duração em qualquer slide.
- "Workshop" ou "hands-on" em qualquer texto exibido: use "oficina" e "mão na massa" (seção 5).
- Citar no slide um arquivo, link ou comando que não existe ou não foi conferido.
- Escrever ou mover conteúdo para as notas do apresentador (seção 1).

## 10. Referências

- reveal.js, documentação e configuração: https://revealjs.com/ e https://revealjs.com/config/
- reveal.js, notas de versão (mudanças da 6.0): https://github.com/hakimel/reveal.js/releases
- MCP, documentação oficial (arquitetura e a comparação com USB-C): https://modelcontextprotocol.io/docs/getting-started/intro e https://modelcontextprotocol.io/docs/learn/architecture. Marca oficial: `docs/logo/light.svg` em https://github.com/modelcontextprotocol/modelcontextprotocol
- OpenCode, documentação (agentes, permissões, comandos, skills, MCP): https://opencode.ai/docs
- Liu et al., *Lost in the Middle: How Language Models Use Long Contexts*, TACL 2023 (Stanford, UC Berkeley e Samaya AI): https://arxiv.org/abs/2307.03172. Valores do gráfico na Tabela 6 (20 documentos) e o closed-book na Tabela 1

Referências visuais (Greptile, Mux): DESIGN.md, seção 11.
