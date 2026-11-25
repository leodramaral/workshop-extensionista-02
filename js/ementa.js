/* Ementa: escala o canvas A4 (retrato ou paisagem) para a tela e liga a esfera. DESIGN.md, seção 19. */
(function () {
  const ementa = document.querySelector('.ementa');
  if (!ementa) return;

  // o tamanho do canvas vem do CSS (.ementa ou .ementa--paisagem), sem número repetido aqui
  const largura = ementa.offsetWidth;
  const altura = ementa.offsetHeight;
  const raiz = document.documentElement.style;
  raiz.setProperty('--ew', `${largura}px`);
  raiz.setProperty('--eh', `${altura}px`);

  function escalar() {
    const k = Math.min(window.innerWidth / largura, window.innerHeight / altura);
    raiz.setProperty('--k', k.toFixed(4));
  }
  window.addEventListener('resize', escalar);
  escalar();

  // esfera: anima na tela e congela o quadro na impressão
  const esfera = document.querySelector('[data-efeito="esfera"]');
  if (esfera && window.Efeitos && window.Efeitos.esfera) {
    window.Efeitos.esfera.iniciar(esfera);
    window.addEventListener('beforeprint', () => window.Efeitos.esfera.parar(esfera));
    window.addEventListener('afterprint', () => window.Efeitos.esfera.iniciar(esfera));
  }
})();
