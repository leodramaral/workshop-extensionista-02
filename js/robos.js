/* Robôs (mascotes) gerados em SVG inline. DESIGN.md, seção 8.12.
 *
 * Cada papel tem uma silhueta própria (um "arquétipo"), como nos mascotes da Mux:
 * monitor alto, gordinho com mãos flutuantes, monitor em pedestal, microfone com
 * fones, bola sobre esteira e orbe flutuante. A camada de pessoa (óculos, cabelo,
 * bigode, tatuagem, porte) só entra quando recebe um `traco`; sem ele o robô é neutro.
 *
 * Para trocar quem é qual robô, ou ajustar os traços, edite EQUIPE.
 */
(function () {
  const PAPEIS = {
    plan:    { cor: 'pink',   chip: 'chip--pink',   rotulo: 'Plan',      arq: 'plan' },
    build:   { cor: 'green',  chip: 'chip--green',  rotulo: 'Build',     arq: 'build' },
    harness: { cor: 'orange', chip: 'chip--orange', rotulo: 'Harness',   arq: 'harness' },
    agents:  { cor: 'blue',   chip: 'chip--blue',   rotulo: 'AGENTS.md', arq: 'agents' },
    skills:  { cor: 'amber',  chip: 'chip--accent', rotulo: 'Skills',    arq: 'skills' },
    modelo:  { cor: 'violet', chip: 'chip--violet', rotulo: 'Modelo',    arq: 'modelo' },
  };

  // Ordem do roteiro: Leandro, Kaio, Daniel, Gabriel, Joelson e Jackeline.
  // `papel` é a legenda curta; `traco` só vale na versão com traços de pessoa.
  const EQUIPE = [
    { robo: 'plan',    nome: 'Leandro',   papel: 'Propõe o plano',                 traco: { cabelo: 'regua', porte: 'largo' } },
    { robo: 'build',   nome: 'Kaio',      papel: 'Escreve e executa',              traco: { oculos: true, cabelo: 'crespo' } },
    { robo: 'harness', nome: 'Daniel',    papel: 'Ferramentas, loop e permissões', traco: { bigode: true, porte: 'alto' } },
    { robo: 'agents',  nome: 'Gabriel',   papel: 'Contexto fixo do projeto',       traco: { oculos: true, cabelo: 'medio', porte: 'maior' } },
    { robo: 'skills',  nome: 'Joelson',   papel: 'Capacidades extras',             traco: { oculos: true, tatuagem: 'zigzag' } },
    { robo: 'modelo',  nome: 'Jackeline', papel: 'Prevê o próximo token',          traco: { oculos: true, tatuagem: 'vinha' } },
  ];

  const TXT_CABELO = { regua: 'cabelo curto', crespo: 'cabelo crespo', medio: 'cabelo médio' };
  const EXTRA_LARGURA = { normal: 0, alto: 0, largo: 18, maior: 30 };

  let contador = 0;

  // ---------- peças compartilhadas ----------
  // corpo em dois tons (metade direita mais escura) com contorno
  function corpo(x, y, w, h, r, c) {
    const id = `k${c.id}-${c.n++}`;
    return `<defs><clipPath id="${id}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/></clipPath></defs>` +
      `<rect class="r-body" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>` +
      `<rect class="r-shade" x="${x + w / 2}" y="${y}" width="${w / 2}" height="${h}" clip-path="url(#${id})"/>` +
      `<rect class="r-outline r-line" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>`;
  }

  function pe(x, y, w, h) {
    let s = `<rect class="r-ink r-line" x="${x}" y="${y}" width="${w}" height="${h}" rx="5"/>`;
    for (let i = 1; i <= 3; i++) s += `<path class="r-thin" d="M${x + (w * i) / 4} ${y + h - 4} v-6"/>`;
    return s;
  }

  // tela com moldura dupla; `pilula` desliga o reflexo diagonal
  function tela(x, y, w, h, r, pilula) {
    const rr = r == null ? 6 : r;
    return `<rect class="r-bezel" x="${x - 5}" y="${y - 5}" width="${w + 10}" height="${h + 10}" rx="${rr + 4}"/>` +
      `<rect class="r-screen" x="${x}" y="${y}" width="${w}" height="${h}" rx="${rr}"/>` +
      (pilula ? '' : `<path class="r-shine" d="M${x} ${y} h30 l-30 30 z"/>`);
  }

  function parafusos(x, y, w, h) {
    return [[x + 9, y + 9], [x + w - 9, y + 9], [x + 9, y + h - 9], [x + w - 9, y + h - 9]]
      .map(([cx, cy]) => `<circle class="r-rline" cx="${cx}" cy="${cy}" r="3"/>`).join('');
  }

  function leds(x, y) {
    return [0, 1, 2].map((i) =>
      `<circle class="${i === 0 ? 'r-accent' : i === 1 ? 'r-fill2' : 'r-white'} r-line-fino" cx="${x + i * 12}" cy="${y}" r="3.5"/>`).join('');
  }

  function fendas(x, y, n, passo) {
    let s = '';
    for (let i = 0; i < n; i++) s += `<line class="r-fenda" x1="${x + i * passo}" y1="${y}" x2="${x + i * passo}" y2="${y + 14}"/>`;
    return s;
  }

  // mão de 3 dedos que acena
  function mao(cx, cy, lado) {
    return `<g class="r-arm r-arm--${lado < 0 ? 'e' : 'd'} r-arm--acena">` +
      `<circle class="r-accent r-line" cx="${cx}" cy="${cy}" r="10"/>` +
      `<circle class="r-accent r-line" cx="${cx - 7}" cy="${cy + 9}" r="4"/><circle class="r-accent r-line" cx="${cx}" cy="${cy + 12}" r="4"/><circle class="r-accent r-line" cx="${cx + 7}" cy="${cy + 9}" r="4"/></g>`;
  }

  // garra em C flutuante (sem braço); lado -1 abre para a direita, 1 para a esquerda
  function garra(cx, cy, lado) {
    const d = lado < 0 ? `M${cx + 8} ${cy - 14} a14 14 0 1 0 0 28` : `M${cx - 8} ${cy - 14} a14 14 0 1 1 0 28`;
    return `<path class="r-garra-borda" d="${d}"/><path class="r-garra" d="${d}"/>`;
  }

  // ---------- arquétipos: cada um devolve { fixo, s, bottom, anchors } ----------
  const ARQ = {
    // monitor alto: coluna lateral, tela de olho e painel inferior de onda
    plan(c) {
      const w = 140 + c.dx, x0 = 110 - w / 2;
      const sw = w - 80;
      let s = `<line class="r-line" x1="${x0 + 16}" y1="72" x2="${x0 + 16}" y2="42"/><rect class="r-accent r-line r-ping" x="${x0 + 8}" y="26" width="16" height="16"/>`;
      s += corpo(x0, 70, w, 204, 10, c);
      s += `<path class="r-thin" d="M${x0 + 2} 172 H${x0 + w - 2}"/>`;
      s += `<rect class="r-white r-line" x="${x0 + 12}" y="86" width="40" height="68" rx="5"/>`;
      s += `<path class="r-thin" d="M${x0 + 22} 100 h12 v22 h-12 M${x0 + 22} 136 h20"/>`;
      s += `<rect class="r-accent r-line" x="${x0 + 12}" y="158" width="14" height="10"/>`;
      s += tela(x0 + 66, 88, sw, 66, 8);
      s += `<ellipse class="r-stroke r-pulse" cx="${x0 + 66 + sw / 2}" cy="121" rx="22" ry="13"/><circle class="r-accent" cx="${x0 + 66 + sw / 2}" cy="121" r="6"/>`;
      // painel de onda: moldura, tela rosa e onda lisa correndo (recortada no painel)
      const pid = `k${c.id}-${c.n++}`;
      const px = x0 + 14, pw = w - 28;
      let onda = `M${px - 24} 216 q6 -22 12 0`;
      for (let i = 1; i < Math.ceil((pw + 48) / 12); i++) onda += ' t12 0';
      s += `<rect class="r-bezel" x="${x0 + 8}" y="182" width="${w - 16}" height="68" rx="9"/>`;
      s += `<defs><clipPath id="${pid}"><rect x="${px}" y="188" width="${pw}" height="56" rx="5"/></clipPath></defs>`;
      s += `<rect class="r-accent r-line" x="${px}" y="188" width="${pw}" height="56" rx="5"/>`;
      s += `<g clip-path="url(#${pid})"><g class="r-onda-move"><path class="r-onda" d="${onda}"/></g></g>`;
      s += leds(x0 + 22, 262) + fendas(x0 + w - 60, 255, 5, 8);
      s += parafusos(x0, 70, w, 204);
      return {
        fixo: pe(x0 + 8, 272, 46, 18) + pe(x0 + w - 54, 272, 46, 18),
        s, bottom: 290, sombra: 80,
        anchors: { cabeca: { x: x0, y: 70, w, h: 100 } },
      };
    },

    // gordinho: dois bulbos de olho, mostrador, tela e mãos flutuantes
    build(c) {
      const w = 176 + c.dx, x0 = 110 - w / 2;
      let s = `<rect class="r-shade r-line" x="${x0 - 12}" y="140" width="14" height="46" rx="5"/><rect class="r-shade r-line" x="${x0 + w - 2}" y="140" width="14" height="46" rx="5"/>`;
      s += corpo(x0, 92, w, 148, 18, c);
      s += `<g class="r-eye"><circle class="r-white r-line" cx="${x0 + 48}" cy="122" r="19"/><circle class="r-accent" cx="${x0 + 48}" cy="122" r="9"/></g>`;
      s += `<g class="r-eye"><circle class="r-white r-line" cx="${x0 + w - 48}" cy="122" r="19"/><circle class="r-accent" cx="${x0 + w - 48}" cy="122" r="9"/></g>`;
      s += tela(x0 + 46, 158, w - 92, 46, 6);
      s += `<path class="r-stroke r-pulse" d="M105 194 l11 -26"/><path class="r-stroke r-stroke--tenue" d="M${x0 + 58} 170 h18 M${x0 + w - 76} 192 h18"/>`;
      s += leds(x0 + 26, 226) + fendas(x0 + w - 56, 219, 5, 8);
      s += parafusos(x0, 92, w, 148);
      s += mao(x0 - 6, 250, -1) + mao(x0 + w + 6, 250, 1);
      return {
        fixo: pe(x0 + 26, 240, 40, 20) + pe(x0 + w - 66, 240, 40, 20),
        s, bottom: 260, sombra: 86,
        anchors: {
          cabeca: { x: x0, y: 92, w, h: 60 },
          olhos: [[x0 + 48, 122], [x0 + w - 48, 122]], rOculos: 24,
        },
      };
    },

    // humanoide alto com capacete, arnês em X (fivela com cadeado) e cinto de ferramentas:
    // "harness" lido de forma literal, a estrutura que prende e carrega as ferramentas
    harness(c) {
      const L = 40 + c.dy;
      const ly = 196;
      const id = `k${c.id}-${c.n++}`;
      const fixo =
        `<rect class="r-body r-line" x="68" y="${ly - 4}" width="22" height="${L + 4}"/><rect class="r-body r-line" x="130" y="${ly - 4}" width="22" height="${L + 4}"/>` +
        `<circle class="r-body r-line" cx="79" cy="${ly + L / 2}" r="8"/><circle class="r-rline" cx="79" cy="${ly + L / 2}" r="2.5"/>` +
        `<circle class="r-body r-line" cx="141" cy="${ly + L / 2}" r="8"/><circle class="r-rline" cx="141" cy="${ly + L / 2}" r="2.5"/>` +
        pe(57, ly + L, 42, 20) + pe(121, ly + L, 42, 20);
      let s = '';
      // braços e punhos
      s += `<rect class="r-body r-line" x="40" y="108" width="16" height="62" rx="8"/><rect class="r-body r-line" x="164" y="108" width="16" height="62" rx="8"/>`;
      s += `<circle class="r-accent r-line" cx="48" cy="178" r="10"/><circle class="r-accent r-line" cx="172" cy="178" r="10"/>`;
      // tronco com o arnês cruzado
      s += corpo(60, 100, 100, 96, 12, c);
      s += `<defs><clipPath id="${id}"><rect x="60" y="100" width="100" height="96" rx="12"/></clipPath></defs>`;
      s += `<g clip-path="url(#${id})"><path class="r-faixa" d="M52 98 L168 198 M168 98 L52 198"/><path class="r-pesponto" d="M52 98 L168 198 M168 98 L52 198"/></g>`;
      s += `<rect class="r-accent r-line r-ping" x="96" y="134" width="28" height="28" rx="6"/><circle class="r-screen" cx="110" cy="146" r="4.5"/><rect class="r-screen" x="108" y="148" width="4" height="9"/>`;
      s += parafusos(60, 100, 100, 96);
      // cinto e ferramentas penduradas
      s += `<rect class="r-ink r-line" x="58" y="184" width="104" height="14" rx="3"/><rect class="r-accent" x="104" y="187" width="12" height="8" rx="2"/>`;
      s += `<rect class="r-accent r-line" x="56" y="198" width="9" height="26" rx="3"/><circle class="r-accent r-line" cx="60.5" cy="230" r="9"/><rect class="r-screen" x="57.5" y="232" width="6" height="9"/>`;
      s += `<rect class="r-accent r-line" x="156" y="198" width="10" height="18" rx="3"/><path class="r-line" d="M161 216 v18"/>`;
      // pescoço, cabeça com viseira e capacete
      s += `<rect class="r-body r-line" x="98" y="90" width="24" height="12"/>`;
      s += corpo(76, 38, 68, 54, 10, c);
      s += `<rect class="r-screen r-line" x="84" y="50" width="52" height="24" rx="7"/>`;
      s += `<g class="r-eye"><circle class="r-accent" cx="98" cy="62" r="6"/></g><g class="r-eye"><circle class="r-accent" cx="122" cy="62" r="6"/></g>`;
      s += `<path class="r-fendas" d="M100 84 v5 M110 84 v5 M120 84 v5"/>`;
      s += `<path class="r-accent r-line" d="M70 42 a40 32 0 0 1 80 0 Z"/><rect class="r-accent r-line" x="64" y="40" width="92" height="8" rx="3"/>`;
      s += `<circle class="r-white r-line r-ping" cx="110" cy="16" r="6"/><path class="r-thin" d="M110 22 v8"/>`;
      return {
        fixo, s, bottom: ly + L + 20, sombra: 74,
        anchors: { bigode: { x: 110, y: 82 } },
      };
    },

    // microfone com fones: cápsula na cabeça, visor "< _ >" e garras em C
    agents(c) {
      const w = 160 + c.dx, x0 = 110 - w / 2;
      const cx = 110;
      let fixo = '';
      [x0 + 28, x0 + w - 68].forEach((x) => {
        fixo += `<path class="r-body r-line" d="M${x} 214 h40 a20 20 0 0 1 -40 0 Z"/>`;
      });
      let s = '';
      // tubos do fone (borda escura + miolo claro)
      const dE = `M${x0 + 14} 150 C${x0 - 16} 150 ${x0 - 12} 50 94 62`;
      const dD = `M${x0 + w - 14} 150 C${x0 + w + 16} 150 ${x0 + w + 12} 90 126 80`;
      s += `<path class="r-pipe-borda" d="${dE}"/><path class="r-pipe" d="${dE}"/><path class="r-pipe-borda" d="${dD}"/><path class="r-pipe" d="${dD}"/>`;
      s += `<line class="r-line" x1="${x0 + 2}" y1="128" x2="${x0 - 8}" y2="104"/><circle class="r-accent r-line r-ping" cx="${x0 - 9}" cy="98" r="6"/>`;
      s += corpo(x0, 116, w, 98, 28, c);
      s += tela(x0 + 16, 130, w - 32, 56, 24, true);
      const lx = x0 + 40, rx = x0 + w - 40;
      s += `<path class="r-stroke" d="M${lx + 8} 144 l-14 14 l14 14"/><path class="r-stroke" d="M${rx - 8} 144 l14 14 l-14 14"/>`;
      s += `<rect class="r-accent r-cursor" x="${cx - 5}" y="148" width="10" height="20"/>`;
      s += `<rect class="r-ink r-line" x="${cx - 22}" y="196" width="44" height="8" rx="4"/>`;
      s += `<circle class="r-accent r-line" cx="${x0 + 8}" cy="170" r="6"/><circle class="r-accent r-line" cx="${x0 + w - 8}" cy="170" r="6"/>`;
      // cápsula do microfone
      s += `<rect class="r-accent r-line" x="${cx - 18}" y="28" width="36" height="78" rx="18"/>`;
      s += `<path class="r-thin" d="M${cx - 12} 46 h24 M${cx - 12} 58 h24 M${cx - 12} 70 h24 M${cx - 12} 82 h24"/>`;
      s += `<rect class="r-body r-line" x="${cx - 24}" y="100" width="48" height="10" rx="3"/><rect class="r-body r-line" x="${cx - 6}" y="108" width="12" height="10"/>`;
      s += garra(x0 - 10, 232, -1) + garra(x0 + w + 10, 232, 1);
      return {
        fixo, s, bottom: 246, sombra: 84,
        anchors: {
          cabeca: { x: cx - 18, y: 28, w: 36, h: 78 },
          olhos: [[lx - 2, 158], [rx + 2, 158]], rOculos: 22,
        },
      };
    },

    // bola sobre esteira: olhos, painel de cartuchos e garras
    skills(c) {
      const cx = 110, cy = 172, r = 62;
      const id = `k${c.id}-${c.n++}`;
      let fixo = `<rect class="r-ink r-line" x="44" y="258" width="132" height="28" rx="14"/>`;
      [64, 92, 128, 156].forEach((x) => { fixo += `<circle class="r-body r-line" cx="${x}" cy="272" r="8"/>`; });
      fixo += `<rect class="r-body r-line" x="94" y="232" width="32" height="28"/>`;
      let s = `<rect class="r-body r-line" x="36" y="164" width="14" height="52" rx="7"/><rect class="r-body r-line" x="170" y="164" width="14" height="52" rx="7"/>`;
      s += `<defs><clipPath id="${id}"><circle cx="${cx}" cy="${cy}" r="${r}"/></clipPath></defs>`;
      s += `<circle class="r-body" cx="${cx}" cy="${cy}" r="${r}"/><rect class="r-shade" x="${cx}" y="${cy - r}" width="${r}" height="${r * 2}" clip-path="url(#${id})"/><circle class="r-outline r-line" cx="${cx}" cy="${cy}" r="${r}"/>`;
      s += `<path class="r-thin" d="M${cx - r + 6} 176 H${cx + r - 6}"/>`;
      s += `<line class="r-line" x1="110" y1="110" x2="110" y2="92"/><circle class="r-accent r-line r-ping" cx="110" cy="86" r="9"/>`;
      s += `<g class="r-eye"><circle class="r-white r-line" cx="86" cy="150" r="15"/><circle class="r-accent" cx="86" cy="150" r="7"/></g>`;
      s += `<g class="r-eye"><circle class="r-white r-line" cx="134" cy="150" r="15"/><circle class="r-accent" cx="134" cy="150" r="7"/></g>`;
      s += tela(70, 186, 80, 40, 5);
      for (let i = 0; i < 3; i++) {
        const x = 72 + i * 26;
        s += `<rect class="r-ranhura" x="${x}" y="189" width="22" height="34" rx="3"/>`;
        const cart = `<rect class="r-accent" x="${x + 2}" y="192" width="18" height="28" rx="2"/><rect class="r-screen" x="${x + 5}" y="195" width="12" height="3"/>`;
        s += i === 2 ? `<g class="r-insere">${cart}</g>` : cart;
      }
      s += garra(43, 232, -1) + garra(177, 232, 1);
      return {
        fixo, s, bottom: 286, sombra: 78,
        anchors: {
          olhos: [[86, 150], [134, 150]], rOculos: 20,
          bracos: [{ x: 36, y: 164, w: 14, h: 52 }, { x: 170, y: 164, w: 14, h: 52 }],
        },
      };
    },

    // orbe flutuante: cabeça e tronco em proporção, peito com rede neural, propulsor
    modelo(c) {
      let s = `<line class="r-line" x1="84" y1="58" x2="84" y2="38"/><circle class="r-accent r-line r-ping" cx="84" cy="31" r="7"/>`;
      s += `<line class="r-line" x1="136" y1="58" x2="136" y2="38"/><circle class="r-accent r-line r-ping" cx="136" cy="31" r="7"/>`;
      s += `<polygon class="r-accent r-pulse r-line" points="92,246 128,246 110,274"/><polygon class="r-white r-pulse" points="101,246 119,246 110,262"/>`;
      s += `<polygon class="r-ink r-line" points="80,232 140,232 130,248 90,248"/>`;
      s += `<rect class="r-body r-line" x="42" y="166" width="14" height="52" rx="7"/><rect class="r-body r-line" x="164" y="166" width="14" height="52" rx="7"/>`;
      s += `<rect class="r-body r-line" x="98" y="146" width="24" height="12"/>`;
      s += corpo(56, 156, 108, 78, 16, c);
      s += tela(68, 168, 84, 52, 6);
      const nos = [[84, 184], [106, 178], [130, 186], [92, 206], [116, 208], [138, 200]];
      [[0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5], [1, 3], [2, 4]].forEach(([a, b]) => {
        s += `<line class="r-link" x1="${nos[a][0]}" y1="${nos[a][1]}" x2="${nos[b][0]}" y2="${nos[b][1]}"/>`;
      });
      nos.forEach(([x, y], i) => { s += `<circle class="r-accent r-no" style="--i: ${i}" cx="${x}" cy="${y}" r="4.5"/>`; });
      s += parafusos(56, 156, 108, 78);
      s += corpo(50, 58, 120, 90, 42, c);
      s += `<g class="r-eye"><circle class="r-white r-line" cx="88" cy="100" r="15"/><circle class="r-accent" cx="88" cy="100" r="7"/></g>`;
      s += `<g class="r-eye"><circle class="r-white r-line" cx="132" cy="100" r="15"/><circle class="r-accent" cx="132" cy="100" r="7"/></g>`;
      s += `<circle class="r-accent" cx="68" cy="124" r="4.5"/><circle class="r-accent" cx="152" cy="124" r="4.5"/>`;
      s += `<path class="r-fendas" d="M100 128 v9 M108 128 v9 M116 128 v9 M124 128 v9"/>`;
      s += garra(49, 238, -1) + garra(171, 238, 1);
      return {
        fixo: '', s, bottom: 292, sombra: 44,
        anchors: {
          cabeca: { x: 50, y: 58, w: 120, h: 90 },
          olhos: [[88, 100], [132, 100]], rOculos: 20,
          bracos: [{ x: 42, y: 166, w: 14, h: 52 }, { x: 164, y: 166, w: 14, h: 52 }],
        },
      };
    },
  };

  // ---------- camada de pessoa ----------
  function cabelo(tipo, h) {
    if (tipo === 'regua') {
      return `<polygon class="r-cabelo" points="${h.x - 2},${h.y + 5} ${h.x + 3},${h.y - 14} ${h.x + h.w - 3},${h.y - 14} ${h.x + h.w + 2},${h.y + 5}"/>`;
    }
    if (tipo === 'crespo') {
      const n = Math.max(4, Math.round(h.w / 26));
      let s = '';
      for (let i = 0; i < n; i++) {
        const cx = h.x + 14 + (i * (h.w - 28)) / (n - 1);
        s += `<circle class="r-cabelo" cx="${cx}" cy="${h.y - 3 - (i % 2 ? 8 : 0)}" r="15"/>`;
        if (i < n - 1) s += `<circle class="r-cabelo" cx="${cx + (h.w - 28) / (n - 1) / 2}" cy="${h.y + 2}" r="13"/>`;
      }
      return s;
    }
    if (tipo === 'medio') {
      const { x, y, w } = h;
      const b = y + h.h * 0.9;
      return `<path class="r-cabelo" d="M${x - 3} ${y + 14} Q${x - 3} ${y - 16} ${x + w / 2} ${y - 16} Q${x + w + 3} ${y - 16} ${x + w + 3} ${y + 14} L${x + w + 3} ${b} L${x + w - 5} ${b} L${x + w - 5} ${y + 16} Q${x + w / 2} ${y + 4} ${x + 5} ${y + 16} L${x + 5} ${b} L${x - 3} ${b} Z"/>`;
    }
    return '';
  }

  function oculos(olhos, r) {
    let s = olhos.map(([x, y]) => `<circle class="r-oculos" cx="${x}" cy="${y}" r="${r}"/>`).join('');
    const [a, b] = olhos;
    s += `<path class="r-oculos-linha" d="M${a[0] + r} ${a[1]} H${b[0] - r} M${a[0] - r} ${a[1] - 2} l-12 -5 M${b[0] + r} ${b[1] - 2} l12 -5"/>`;
    return s;
  }

  function bigode(p) {
    const { x, y } = p;
    return `<path class="r-cabelo" d="M${x} ${y} C${x - 5} ${y - 7} ${x - 15} ${y - 7} ${x - 19} ${y} C${x - 12} ${y - 3} ${x - 5} ${y - 1} ${x} ${y + 4} Z"/>` +
      `<path class="r-cabelo" d="M${x} ${y} C${x + 5} ${y - 7} ${x + 15} ${y - 7} ${x + 19} ${y} C${x + 12} ${y - 3} ${x + 5} ${y - 1} ${x} ${y + 4} Z"/>`;
  }

  function tatuagem(tipo, r) {
    if (tipo === 'zigzag') {
      let s = '';
      [r.y + 10, r.y + 24, r.y + 38].forEach((y) => {
        s += `<path class="r-tat" d="M${r.x + 2} ${y} l${(r.w - 4) / 4} -4 l${(r.w - 4) / 4} 4 l${(r.w - 4) / 4} -4 l${(r.w - 4) / 4} 4"/>`;
      });
      return s;
    }
    if (tipo === 'vinha') {
      const m = r.x + r.w / 2;
      return `<path class="r-tat" d="M${m} ${r.y + 4} q-5 7 0 14 t0 14 t0 14"/><circle class="r-tat" cx="${m + 4}" cy="${r.y + 11}" r="1.6"/><circle class="r-tat" cx="${m - 4}" cy="${r.y + 25}" r="1.6"/><circle class="r-tat" cx="${m + 4}" cy="${r.y + 39}" r="1.6"/>`;
    }
    return '';
  }

  function pessoa(t, A) {
    let s = '';
    if (t.cabelo && A.cabeca) s += cabelo(t.cabelo, A.cabeca);
    if (t.oculos && A.olhos) s += oculos(A.olhos, A.rOculos || 20);
    if (t.bigode && A.bigode) s += bigode(A.bigode);
    if (t.tatuagem && A.bracos) A.bracos.forEach((r) => { s += tatuagem(t.tatuagem, r); });
    return s;
  }

  // ---------- montagem ----------
  function montarRobo(papel, traco, nome) {
    const cfg = PAPEIS[papel];
    if (!cfg) return '';
    const t = traco || null;
    const porte = (t && t.porte) || 'normal';
    const dx = EXTRA_LARGURA[porte] || 0;
    const dy = porte === 'alto' ? 34 : 0;
    const H = 300 + dy;
    const c = { cfg, t, dx, dy, id: ++contador, n: 0 };
    const a = ARQ[cfg.arq](c);
    const oy = H - 10 - a.bottom;

    const partes = [];
    if (t) {
      if (t.oculos) partes.push('óculos');
      if (t.cabelo) partes.push(TXT_CABELO[t.cabelo]);
      if (t.bigode) partes.push('bigode');
      if (t.tatuagem) partes.push('tatuagens nos braços');
      if (porte === 'alto') partes.push('mais alto que os outros');
      if (porte === 'largo' || porte === 'maior') partes.push('corpo mais largo');
    }
    const rotulo = t && nome
      ? `Robô de ${nome}, no papel ${cfg.rotulo}${partes.length ? ', com ' + partes.join(', ') : ''}`
      : `Robô do papel ${cfg.rotulo}`;

    return `<svg class="robot robot--${cfg.cor}" viewBox="-10 0 240 ${H}" role="img" aria-label="${rotulo}">` +
      `<ellipse class="r-sombra" cx="110" cy="${H - 5}" rx="${a.sombra || 80}" ry="7"/>` +
      `<g transform="translate(0 ${oy})">${a.fixo}<g class="bob">${a.s}${t ? pessoa(t, a.anchors) : ''}</g></g></svg>`;
  }

  function cartao(papel, traco, nome, legenda) {
    const cfg = PAPEIS[papel];
    const chipTexto = (nome || cfg.rotulo).toUpperCase();
    return `<article class="robot-card"><div class="robot-card__stage">${montarRobo(papel, traco, nome)}</div>` +
      `<span class="chip chip--hex ${cfg.chip}">${chipTexto}</span><p>${legenda}</p></article>`;
  }

  function montarTudo() {
    // robôs soltos (versão neutra, ou com traços se data-traco="on")
    document.querySelectorAll('[data-robo]').forEach((el) => {
      const papel = el.dataset.robo;
      const item = EQUIPE.find((e) => e.robo === papel);
      const com = el.dataset.traco === 'on' && item;
      el.innerHTML = montarRobo(papel, com ? item.traco : null, com ? item.nome : null);
    });
    // grades de 6 robôs: "papeis" (neutra) e "equipe" (com traços e nome em chip)
    document.querySelectorAll('[data-robos]').forEach((el) => {
      const com = el.dataset.robos === 'equipe';
      el.innerHTML = EQUIPE.map((e) =>
        cartao(e.robo, com ? e.traco : null, com ? e.nome : null, com ? `${PAPEIS[e.robo].rotulo}: ${e.papel.toLowerCase()}` : e.papel)
      ).join('');
    });
  }

  window.Robos = { PAPEIS, EQUIPE, montarRobo };
  montarTudo();
})();
