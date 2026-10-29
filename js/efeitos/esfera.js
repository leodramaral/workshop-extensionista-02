/* Esfera pontilhada (dithering Bayer 4×4), canvas. DESIGN.md, seção 10.3 */
(function () {
  const TAMANHO = 560;
  const CELULA = 7;
  const PONTO = 5;
  const PASSO = 0.015;
  const BAYER = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
  ];

  const estado = new WeakMap();

  function desenhar(canvas, ctx, angulo) {
    const n = TAMANHO / CELULA;
    const luz = [Math.cos(angulo * 0.6) * 0.8, -0.45, Math.sin(angulo * 0.6) * 0.8 + 0.6];
    const norma = Math.hypot(...luz);
    luz[0] /= norma; luz[1] /= norma; luz[2] /= norma;
    const cosA = Math.cos(angulo), sinA = Math.sin(angulo);

    ctx.clearRect(0, 0, TAMANHO, TAMANHO);
    ctx.fillStyle = getComputedStyle(canvas).color;

    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        const x = ((i + 0.5) / n) * 2 - 1;
        const y = ((j + 0.5) / n) * 2 - 1;
        const r2 = x * x + y * y;
        if (r2 > 1) continue;
        const z = Math.sqrt(1 - r2);

        const lambert = Math.max(0, x * luz[0] + y * luz[1] + z * luz[2]);

        // gira a normal em torno do eixo Y para as faixas acompanharem a rotação
        const rx = x * cosA - z * sinA;
        const rz = x * sinA + z * cosA;
        const lon = Math.atan2(rx, rz);
        const lat = Math.asin(-y);
        const faixa = (Math.floor((lon * 6) / Math.PI) + Math.floor((lat * 6) / Math.PI)) & 1;

        const valor = 0.8 * lambert + 0.2 * faixa;
        const limiar = (BAYER[j & 3][i & 3] + 0.5) / 16;
        if (valor > limiar) {
          ctx.fillRect(i * CELULA + (CELULA - PONTO) / 2, j * CELULA + (CELULA - PONTO) / 2, PONTO, PONTO);
        }
      }
    }
  }

  function reduzido() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function preparar(canvas) {
    canvas.width = TAMANHO;
    canvas.height = TAMANHO;
    const s = { ctx: canvas.getContext('2d'), angulo: 0.6, raf: null };
    estado.set(canvas, s);
    return s;
  }

  function iniciar(canvas) {
    const s = estado.get(canvas) || preparar(canvas);
    if (s.raf) return;
    if (reduzido()) {
      desenhar(canvas, s.ctx, s.angulo);
      return;
    }
    const quadro = () => {
      s.angulo += PASSO;
      desenhar(canvas, s.ctx, s.angulo);
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
  window.Efeitos.esfera = { iniciar, parar };
})();
