/* Planta: composição abstrata de peças; primeiro as cotas, depois cada peça é traçada e
   construída em sequência, com um marcador levando a vez de uma peça para a próxima.
   Canvas. Capa do Dia 2. DESIGN.md, seção 10.3 */
(function () {
  const LARGURA = 640;
  const ALTURA = 620;
  // peças, na ordem de construção: [x, y, largura, altura, cor]
  const PECAS = [
    [60, 70, 520, 60, 'blue'],
    [60, 150, 140, 400, 'violet'],
    [220, 150, 360, 170, 'pink'],
    [410, 340, 170, 210, 'accent'],
    [220, 340, 170, 100, 'eggshell'],
    [220, 460, 170, 90, 'green'],
  ];

  function reduzido() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function limita(v) {
    return Math.min(Math.max(v, 0), 1);
  }

  function suave(f) {
    return f < 0.5 ? 2 * f * f : 1 - Math.pow(-2 * f + 2, 2) / 2;
  }

  function centro([x, y, w, h]) {
    return [x + w / 2, y + h / 2];
  }

  // retângulo traçado aos poucos, como uma caneta percorrendo o perímetro
  function traca(ctx, x, y, w, h, p) {
    let resta = 2 * (w + h) * p;
    let cx = x;
    let cy = y;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    for (const [dx, dy] of [[w, 0], [0, h], [-w, 0], [0, -h]]) {
      const len = Math.abs(dx + dy);
      const f = Math.min(resta / len, 1);
      cx += dx * f;
      cy += dy * f;
      ctx.lineTo(cx, cy);
      resta -= len;
      if (resta <= 0) break;
    }
    ctx.stroke();
  }

  // cota: linha com marcas nas pontas
  function cota(ctx, x1, y1, x2, y2) {
    const vertical = x1 === x2;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    [[x1, y1], [x2, y2]].forEach(([x, y]) => {
      if (vertical) { ctx.moveTo(x - 8, y); ctx.lineTo(x + 8, y); }
      else { ctx.moveTo(x, y - 8); ctx.lineTo(x, y + 8); }
    });
    ctx.stroke();
  }

  function quadrado(ctx, x, y, lado, preenche, borda) {
    ctx.fillStyle = preenche;
    ctx.fillRect(x - lado / 2, y - lado / 2, lado, lado);
    ctx.strokeStyle = borda;
    ctx.lineWidth = 2;
    ctx.strokeRect(x - lado / 2, y - lado / 2, lado, lado);
  }

  const P = {
    COTAS: 0.9,
    LEVA: 0.45,                 // marcador indo até a próxima peça
    TRACA: 0.55,
    CONSTROI: 0.45,
    MANTEM: 2.2,
    SOME: 0.5,
  };
  P.ETAPA = P.LEVA + P.TRACA + P.CONSTROI;
  P.CICLO = P.COTAS + PECAS.length * P.ETAPA + P.MANTEM + P.SOME;

  function desenharPlanta(canvas, ctx, tempo) {
    const css = getComputedStyle(canvas);
    const cor = (nome) => css.getPropertyValue('--c-' + nome).trim();
    const t = tempo % P.CICLO;
    ctx.clearRect(0, 0, LARGURA, ALTURA);
    const alfa = t > P.CICLO - P.SOME ? 1 - (t - (P.CICLO - P.SOME)) / P.SOME : 1;
    ctx.globalAlpha = alfa;

    // 1. cotas: mede antes de construir
    const pc = suave(limita(t / P.COTAS));
    ctx.strokeStyle = cor('muted');
    ctx.lineWidth = 1.5;
    cota(ctx, 60, 40, 60 + 520 * pc, 40);
    cota(ctx, 30, 70, 30, 70 + 480 * pc);

    // 2. caminho já percorrido entre as peças (fio tracejado)
    ctx.strokeStyle = cor('basalt');
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);
    for (let i = 1; i < PECAS.length; i++) {
      const inicio = P.COTAS + i * P.ETAPA;
      const f = suave(limita((t - inicio) / P.LEVA));
      if (f === 0) break;
      const [ax, ay] = centro(PECAS[i - 1]);
      const [bx, by] = centro(PECAS[i]);
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(ax + (bx - ax) * f, ay + (by - ay) * f);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // 3. peças: traçado tracejado, depois construção em degraus, depois contorno firme
    PECAS.forEach(([x, y, w, h, c], i) => {
      const inicio = P.COTAS + i * P.ETAPA + P.LEVA;
      const pt = limita((t - inicio) / P.TRACA);
      if (pt === 0) return;
      const pb = limita((t - inicio - P.TRACA) / P.CONSTROI);
      if (pb > 0) {
        ctx.fillStyle = cor(c);
        ctx.fillRect(x, y, w, h * (Math.floor(pb * 6) / 6));
      }
      ctx.lineWidth = 2;
      if (pb === 1) {
        ctx.strokeStyle = cor('ink');
        ctx.strokeRect(x, y, w, h);
      } else {
        ctx.setLineDash([10, 6]);
        ctx.strokeStyle = css.color;
        traca(ctx, x, y, w, h, pt);
        ctx.setLineDash([]);
      }
    });

    // 4. marcador âmbar: leva a vez de uma peça para a próxima
    const etapa = Math.floor((t - P.COTAS) / P.ETAPA);
    if (t > P.COTAS && etapa < PECAS.length) {
      const f = suave(limita((t - P.COTAS - etapa * P.ETAPA) / P.LEVA));
      const [bx, by] = centro(PECAS[etapa]);
      const [ax, ay] = etapa === 0 ? [bx, by - 60] : centro(PECAS[etapa - 1]);
      quadrado(ctx, ax + (bx - ax) * f, ay + (by - ay) * f, 18, cor('accent'), cor('ink'));
    }
    ctx.globalAlpha = 1;
  }

  function criar(desenhar, parado) {
    const estado = new WeakMap();

    function preparar(canvas) {
      canvas.width = LARGURA;
      canvas.height = ALTURA;
      const s = { ctx: canvas.getContext('2d'), t: 0, raf: null };
      estado.set(canvas, s);
      return s;
    }

    function iniciar(canvas) {
      const s = estado.get(canvas) || preparar(canvas);
      if (s.raf) return;
      if (reduzido()) {
        desenhar(canvas, s.ctx, parado);
        return;
      }
      let anterior = null;
      const passo = (agora) => {
        if (anterior !== null) s.t += (agora - anterior) / 1000;
        anterior = agora;
        desenhar(canvas, s.ctx, s.t);
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
      const s = estado.get(canvas) || preparar(canvas);
      desenhar(canvas, s.ctx, parado);
    }

    return { iniciar, parar, quadro };
  }

  window.Efeitos = window.Efeitos || {};
  window.Efeitos.planta = criar(desenharPlanta, P.CICLO - P.SOME - 0.1);
})();
