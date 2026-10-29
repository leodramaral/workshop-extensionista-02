/* Malha: duas esferas tangentes em wireframe, canvas. DESIGN.md, seções 8.13 e 10.3 */
(function () {
  const BAYER = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
  ];
  const ANEIS = 14;
  const MERIDIANOS = 10;
  const PASSOS = 28;
  const CELULA = 7;
  const CELULAS = 14;

  const estado = new WeakMap();

  function reduzido() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function projetar(x, y, z, cos, sin) {
    return [x * cos + z * sin, y];
  }

  function esfera(ctx, x0, R, cx, cy, t, cos, sin) {
    // anéis de latitude (círculos perpendiculares ao eixo X)
    for (let k = 1; k < ANEIS; k++) {
      const theta = (Math.PI * k) / ANEIS;
      const x = x0 + R * Math.cos(theta);
      const rho = R * Math.sin(theta);
      ctx.beginPath();
      for (let i = 0; i <= 48; i++) {
        const a = (i / 48) * Math.PI * 2;
        const [sx, sy] = projetar(x, rho * Math.cos(a), rho * Math.sin(a), cos, sin);
        if (i === 0) ctx.moveTo(cx + sx, cy + sy);
        else ctx.lineTo(cx + sx, cy + sy);
      }
      ctx.stroke();
    }
    // meridianos (giram em torno do eixo X)
    for (let j = 0; j < MERIDIANOS; j++) {
      const alfa = (j / MERIDIANOS) * Math.PI * 2 + t * 0.3;
      ctx.beginPath();
      for (let i = 0; i <= PASSOS; i++) {
        const theta = (i / PASSOS) * Math.PI;
        const x = x0 + R * Math.cos(theta);
        const y = R * Math.sin(theta) * Math.cos(alfa);
        const z = R * Math.sin(theta) * Math.sin(alfa);
        const [sx, sy] = projetar(x, y, z, cos, sin);
        if (i === 0) ctx.moveTo(cx + sx, cy + sy);
        else ctx.lineTo(cx + sx, cy + sy);
      }
      ctx.stroke();
    }
  }

  // imagem central em dithering Bayer, cintilando
  function imagem(ctx, cx, cy, t, cor) {
    const lado = CELULA * CELULAS;
    const x0 = cx - lado / 2;
    const y0 = cy - lado / 2;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x0 - 4, y0 - 4, lado + 8, lado + 8);
    ctx.fillStyle = cor;
    for (let j = 0; j < CELULAS; j++) {
      for (let i = 0; i < CELULAS; i++) {
        const dx = (i - CELULAS / 2 + 0.5) / (CELULAS / 2);
        const dy = (j - CELULAS / 2 + 0.5) / (CELULAS / 2);
        const valor = 0.75 - 0.45 * Math.hypot(dx, dy) + 0.2 * Math.sin(i * 0.9 + j * 0.6 + t * 1.5);
        const limiar = (BAYER[j & 3][i & 3] + 0.5) / 16;
        if (valor > limiar) ctx.fillRect(x0 + i * CELULA, y0 + j * CELULA, CELULA, CELULA);
      }
    }
  }

  function desenhar(canvas, t) {
    const s = estado.get(canvas);
    const { ctx, w, h } = s;
    const R = Math.min(w / 4 - 6, h / 2 - 24);
    const cx = w / 2;
    const cy = h / 2;
    const phi = 0.45 * Math.sin(t * 0.5);
    const cos = Math.cos(phi);
    const sin = Math.sin(phi);

    ctx.clearRect(0, 0, w, h);
    ctx.lineWidth = 2;
    ctx.strokeStyle = s.cor;
    ctx.globalAlpha = 0.5;
    esfera(ctx, -R, R, cx, cy, t, cos, sin);
    esfera(ctx, R, R, cx, cy, t, cos, sin);
    ctx.globalAlpha = 1;
    imagem(ctx, cx, cy, t, s.laranja);
  }

  function preparar(canvas) {
    const estilo = getComputedStyle(canvas);
    const s = {
      ctx: canvas.getContext('2d'),
      w: canvas.width,
      h: canvas.height,
      cor: estilo.color,
      laranja: getComputedStyle(document.documentElement).getPropertyValue('--c-orange').trim() || '#FF6100',
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
    const quadro = () => {
      s.t += 0.016;
      desenhar(canvas, s.t);
      s.raf = requestAnimationFrame(quadro);
    };
    s.raf = requestAnimationFrame(quadro);
  }

  function parar(canvas) {
    const s = estado.get(canvas);
    if (s && s.raf) {
      cancelAnimationFrame(s.raf);
      s.raf = null;
    }
  }

  window.Efeitos = window.Efeitos || {};
  // um quadro estático, usado no modo de impressão (?print-pdf)
  function quadro(canvas) {
    if (!estado.get(canvas)) preparar(canvas);
    desenhar(canvas, 0);
  }

  window.Efeitos.malha = { iniciar, parar, quadro };
})();
