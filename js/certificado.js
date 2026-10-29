/* Certificado: escala para a tela e preenche nome e datas. DESIGN.md, seção 18.
 *
 * Parâmetros de URL (opcionais): ?nome=Maria%20Silva&dia1=12/11/2026&dia2=19/11/2026
 */
(function () {
  const LARGURA = 1920;
  const ALTURA = 1358;
  const NOME_LONGO = 28;

  function escalar() {
    const k = Math.min(window.innerWidth / LARGURA, window.innerHeight / ALTURA);
    document.documentElement.style.setProperty('--k', k.toFixed(4));
  }
  window.addEventListener('resize', escalar);
  escalar();

  const p = new URLSearchParams(location.search);

  const nome = (p.get('nome') || '').trim();
  const elNome = document.querySelector('[data-slot="nome"]');
  if (elNome && nome) elNome.textContent = nome;
  if (elNome && elNome.textContent.length > NOME_LONGO) elNome.classList.add('cert__name--long');

  const d1 = p.get('dia1');
  const d2 = p.get('dia2');
  const elDatas = document.querySelector('[data-slot="datas"]');
  if (elDatas && d1 && d2) elDatas.textContent = `${d1} e ${d2}`;

  // esfera da proposta B: anima na tela e congela o quadro na impressão
  const esfera = document.querySelector('[data-efeito="esfera"]');
  if (esfera && window.Efeitos && window.Efeitos.esfera) {
    if (window.self !== window.top) {
      window.Efeitos.esfera.quadro(esfera);
    } else {
      window.Efeitos.esfera.iniciar(esfera);
    }
    window.addEventListener('beforeprint', () => window.Efeitos.esfera.parar(esfera));
    window.addEventListener('afterprint', () => window.Efeitos.esfera.iniciar(esfera));
  }
})();
