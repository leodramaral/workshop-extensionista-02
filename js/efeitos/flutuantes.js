/* Quadrados flutuantes: o movimento é CSS; aqui só ligamos e desligamos por slide. DESIGN.md, seção 7.3 e 7.4 */
(function () {
  function iniciar(el) { el.classList.add('is-active'); }
  function parar(el) { el.classList.remove('is-active'); }

  window.Efeitos = window.Efeitos || {};
  window.Efeitos.flutuantes = { iniciar, parar };
})();
