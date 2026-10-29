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
Reveal.on('slidechanged', syncEffects);
