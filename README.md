# Workshop de Desenvolvimento com IA

## Stack

- **reveal.js 6.0.1**: motor dos slides, carregado do cdnjs com versão fixa. Usa só `reset.css` e `reveal.css`, sem tema pronto, e o plugin `RevealNotes` para as notas do apresentador.
- **HTML, CSS e JavaScript puros**: sem build, sem `package.json`, sem framework de UI.
- **CSS próprio** em `css/`: tokens de design, base, layouts, componentes e animações.
- **Canvas** em `js/efeitos/`: malha, esfera, planta, código e elementos flutuantes.
- **Google Fonts**: Anybody, DM Sans e Space Mono.
- **GitHub Pages**: publicação automática a partir da `main` (`.github/workflows/pages.yml`).

As regras visuais e de conteúdo dos slides estão no [DESIGN.md](DESIGN.md), a fonte da verdade do projeto.

## Como rodar

Não há nada para instalar. Na raiz do projeto, suba um servidor local:

```bash
python3 -m http.server 8000
```

Depois abra <http://localhost:8000>. A página inicial leva ao Dia 1 e ao Dia 2.

> Os slides também abrem direto pelo arquivo `index.html`, mas o servidor local é o recomendado. As fontes e o reveal.js vêm da internet, então é preciso estar online.

## Estrutura

```
index.html        home com os dois dias
dia-1.html        slides do Dia 1
dia-2.html        slides do Dia 2
certificado-b.html  certificado de participação
css/              tokens, base, layouts, componentes, animações
js/               main, robôs, certificado e efeitos em canvas
```
