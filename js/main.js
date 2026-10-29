Reveal.initialize({
  width: 1920,
  height: 1080,
  margin: 0,
  minScale: 0.2,
  maxScale: 2.0,
  center: false,
  hash: true,
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
  pdfSeparateFragments: false, // uma página por slide, já com todos os fragments visíveis
  plugins: [RevealNotes]
});

// Efeitos pesados rodam só no slide visível (DESIGN.md, seção 10.4)
function syncEffects() {
  const atual = Reveal.getCurrentSlide();
  document.querySelectorAll('[data-efeito]').forEach((el) => {
    const efeito = window.Efeitos && window.Efeitos[el.dataset.efeito];
    if (!efeito) return;
    if (atual && atual.contains(el)) efeito.iniciar(el);
    else efeito.parar(el);
  });
}

Reveal.on('ready', syncEffects);

// No PDF todos os slides são impressos de uma vez: desenha um quadro de cada efeito
Reveal.on('ready', () => {
  if (!Reveal.isPrintView()) return;
  document.querySelectorAll('[data-efeito]').forEach((el) => {
    const efeito = window.Efeitos && window.Efeitos[el.dataset.efeito];
    if (efeito && efeito.quadro) efeito.quadro(el);
  });
});
Reveal.on('slidechanged', syncEffects);
