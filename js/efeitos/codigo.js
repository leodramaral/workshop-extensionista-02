/* Prompt vira código: um prompt curto é digitado e dispara uma cascata de código, com linhas
   com defeito piscando. Canvas. Capa do Dia 1. DESIGN.md, seção 10.3 */
(function () {
  const LARGURA = 640;
  const ALTURA = 620;
  const PROMPT = '> faz um sistema';
  const DIGITA = 1.4;           // segundos digitando o prompt
  const ENTER = 0.35;
  const JORRA = 2.6;            // segundos de cascata
  const MANTEM = 2.2;
  const SOME = 0.5;
  const CICLO = DIGITA + ENTER + JORRA + MANTEM + SOME;
  const LINHA = 30;             // altura de cada linha de código
  const VISIVEIS = 14;
  const TOTAL = 34;             // linhas geradas por ciclo
  const PAINEL = { x: 40, y: 150, w: 560, h: 450 };
  const CORES = ['tint', 'blue', 'pink', 'green', 'accent', 'eggshell'];

  const estado = new WeakMap();

  function reduzido() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function aleatorio(semente) {
    return function () {
      semente |= 0; semente = (semente + 0x6d2b79f5) | 0;
      let t = Math.imul(semente ^ (semente >>> 15), 1 | semente);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // linhas de "código": recuo + tokens coloridos; algumas com defeito
  function gerar() {
    const r = aleatorio(7);
    const linhas = [];
    let recuo = 0;
    for (let i = 0; i < TOTAL; i++) {
      const tokens = [];
      const n = 1 + Math.floor(r() * 4);
      for (let k = 0; k < n; k++) {
        tokens.push([24 + Math.floor(r() * 90), CORES[Math.floor(r() * CORES.length)]]);
      }
      linhas.push({ recuo, tokens, defeito: r() < 0.14 });
      recuo = Math.max(0, Math.min(3, recuo + (r() < 0.35 ? 1 : r() < 0.5 ? -1 : 0)));
    }
    return linhas;
  }

  function desenhar(canvas, s, tempo) {
    const ctx = s.ctx;
    const css = getComputedStyle(canvas);
    const cor = (nome) => css.getPropertyValue('--c-' + nome).trim();
    const t = tempo % CICLO;
    ctx.clearRect(0, 0, LARGURA, ALTURA);
    const sumir = t > CICLO - SOME ? 1 - (t - (CICLO - SOME)) / SOME : 1;
    ctx.globalAlpha = sumir;

    // cartão do prompt
    const enviado = t > DIGITA;
    const piscaEnter = t > DIGITA && t < DIGITA + ENTER;
    ctx.fillStyle = piscaEnter ? cor('accent') : cor('white');
    ctx.fillRect(40, 40, 560, 76);
    ctx.strokeStyle = cor('ink');
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, 560, 76);
    const letras = Math.min(PROMPT.length, Math.floor((t / DIGITA) * PROMPT.length));
    ctx.fillStyle = cor('basalt');
    ctx.font = '28px "Space Mono", monospace';
    ctx.textBaseline = 'middle';
    const texto = PROMPT.slice(0, letras);
    ctx.fillText(texto, 66, 79);
    if (!enviado || Math.floor(t * 2) % 2 === 0) {
      ctx.fillStyle = cor('accent');
      ctx.fillRect(68 + ctx.measureText(texto).width, 64, 14, 30);
    }

    // seta ligando prompt e código
    ctx.strokeStyle = cor('basalt');
    ctx.beginPath();
    ctx.moveTo(LARGURA / 2, 116);
    ctx.lineTo(LARGURA / 2, PAINEL.y);
    ctx.stroke();
    ctx.fillStyle = enviado ? cor('accent') : cor('basalt');
    ctx.fillRect(LARGURA / 2 - 8, 125, 16, 16);
    ctx.strokeRect(LARGURA / 2 - 8, 125, 16, 16);

    // painel de código
    ctx.fillStyle = cor('basalt');
    ctx.fillRect(PAINEL.x, PAINEL.y, PAINEL.w, PAINEL.h);
    const tj = t - DIGITA - ENTER;
    if (tj > 0) {
      const feitas = Math.min(TOTAL, Math.floor((tj / JORRA) * TOTAL));
      const primeira = Math.max(0, feitas - VISIVEIS);
      ctx.save();
      ctx.beginPath();
      ctx.rect(PAINEL.x, PAINEL.y, PAINEL.w, PAINEL.h);
      ctx.clip();
      for (let i = primeira; i < feitas; i++) {
        const l = s.linhas[i];
        const y = PAINEL.y + 18 + (i - primeira) * LINHA;
        const terminou = feitas === TOTAL;
        if (l.defeito && terminou && Math.floor(t * 3) % 2 === 0) {
          ctx.globalAlpha = sumir * 0.35;
          ctx.fillStyle = cor('orange');
          ctx.fillRect(PAINEL.x, y - 4, PAINEL.w, LINHA - 4);
          ctx.globalAlpha = sumir;
        }
        // número da linha como um quadradinho
        ctx.fillStyle = cor('muted-dark');
        ctx.fillRect(PAINEL.x + 18, y + 6, 10, 10);
        let x = PAINEL.x + 48 + l.recuo * 28;
        l.tokens.forEach(([w, c]) => {
          ctx.fillStyle = l.defeito && terminou ? cor('orange') : cor(c);
          ctx.fillRect(x, y + 4, w, 14);
          x += w + 12;
        });
      }
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  function preparar(canvas) {
    canvas.width = LARGURA;
    canvas.height = ALTURA;
    const s = { ctx: canvas.getContext('2d'), t: 0, raf: null, linhas: gerar() };
    estado.set(canvas, s);
    return s;
  }

  function iniciar(canvas) {
    const s = estado.get(canvas) || preparar(canvas);
    if (s.raf) return;
    if (reduzido()) {
      desenhar(canvas, s, CICLO - SOME - 0.1);
      return;
    }
    let anterior = null;
    const passo = (agora) => {
      if (anterior !== null) s.t += (agora - anterior) / 1000;
      anterior = agora;
      desenhar(canvas, s, s.t);
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

  // um quadro estático com o código já gerado, usado no modo de impressão (?print-pdf)
  function quadro(canvas) {
    const s = estado.get(canvas) || preparar(canvas);
    desenhar(canvas, s, CICLO - SOME - 0.1);
  }

  window.Efeitos = window.Efeitos || {};
  window.Efeitos.codigo = { iniciar, parar, quadro };
})();
