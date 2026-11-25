/* Ementa: liga a esfera do cabeçalho. DESIGN.md, seção 19.
   Com prefers-reduced-motion, o próprio efeito desenha um quadro só e para. */
(function () {
  const esfera = document.querySelector('[data-efeito="esfera"]');
  if (esfera && window.Efeitos && window.Efeitos.esfera) {
    window.Efeitos.esfera.iniciar(esfera);
  }
})();
