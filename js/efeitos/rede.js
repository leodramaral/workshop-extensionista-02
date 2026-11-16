/* Rede: malha azul que respira, em canvas, atrás da figura do MCP. DESIGN.md, seções 8.20, 8.22 e 10.3
   Linhas horizontais que se estreitam no centro (como o card "Greptile MCP") e verticais retas.
   O estreitamento abre e fecha devagar e as verticais deslizam. A cor vem do `color` do canvas. */
(function () {
  const LINHAS = 11;      // horizontais
  const PASSO_V = 52;     // espaço entre verticais
  const X0 = 90;          // borda esquerda da malha
  const X1 = 870;         // borda direita
  const MEIO = 250;       // linha central (y)
  const ALTURA = 176.5;   // distância da linha mais alta até o centro, na borda
  const SIGMA = 212;      // largura do estreitamento

  const estado = new WeakMap();

  function reduzido() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // y de uma linha horizontal (offset relativo ao centro) na posição x
  function y(offset, x, aperto, cx) {
    const d = (x - cx) / SIGMA;
    return MEIO + offset * (1 - aperto * Math.exp(-d * d));
  }

  function desenhar(canvas, t) {
    const s = estado.get(canvas);
    const { ctx, w, h } = s;
    const cx = w / 2;
    const aperto = 0.44 + 0.12 * Math.sin(t * 0.9);   // respira
    const desliza = (t * 10) % PASSO_V;                 // verticais andando

    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = s.cor;
    ctx.lineWidth = 1.5;

    // horizontais
    ctx.globalAlpha = 0.45;
    for (let i = 0; i < LINHAS; i++) {
      const offset = ((i - (LINHAS - 1) / 2) / ((LINHAS - 1) / 2)) * ALTURA;
      ctx.beginPath();
      for (let x = X0; x <= X1; x += 10) {
        const yy = y(offset, x, aperto, cx);
        if (x === X0) ctx.moveTo(x, yy);
        else ctx.lineTo(x, yy);
      }
      ctx.stroke();
    }

    // verticais: do topo à base da malha, somem perto das bordas
    for (let x = X0 + desliza; x <= X1; x += PASSO_V) {
      const borda = Math.min(x - X0, X1 - x) / 60;
      ctx.globalAlpha = 0.45 * Math.max(0, Math.min(1, borda));
      ctx.beginPath();
      ctx.moveTo(x, y(-ALTURA, x, aperto, cx));
      ctx.lineTo(x, y(ALTURA, x, aperto, cx));
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function preparar(canvas) {
    const s = {
      ctx: canvas.getContext('2d'),
      w: canvas.width,
      h: canvas.height,
      cor: getComputedStyle(canvas).color,
      t: 0,
      raf: null,
    };
    estado.set(canvas, s);
    return s;
  }

  function iniciar(canvas) {
    const s = estado.get(canvas) || preparar(canvas);
    if (s.raf) return;
    if (reduzido()) {
      desenhar(canvas, 0);
      return;
    }
    const passo = () => {
      s.t += 0.016;
      desenhar(canvas, s.t);
      s.raf = requestAnimationFrame(passo);
    };
    s.raf = requestAnimationFrame(passo);
  }

  function parar(canvas) {
    const s = estado.get(canvas);
    if (s && s.raf) {
      cancelAnimationFrame(s.raf);
      s.raf = null;
    }
  }

  // um quadro estático, usado no modo de impressão (?print-pdf)
  function quadro(canvas) {
    if (!estado.get(canvas)) preparar(canvas);
    desenhar(canvas, 0);
  }

  window.Efeitos = window.Efeitos || {};
  window.Efeitos.rede = { iniciar, parar, quadro };
})();
