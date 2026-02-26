var imagens = [
    "../../img/aulaf75.webp",
    "../../img/g305.webp",
    "../../img/g733.webp"
];
var descricoes = [
    { title: "Teclado Aula F75", text: "Teclado mecânico compacto, switches hot-swap e iluminação RGB. Perfeito para produtividade e jogos.", price: "R$ 249,00" },
    { title: "Mouse Logitech G305", text: "Mouse sem fio leve com sensor HERO e alta precisão — ótimo para gamers que buscam performance.", price: "R$ 199,00" },
    { title: "Headset Logitech G733", text: "Fone sem fio com iluminação RGB, excelente conforto e som imersivo.", price: "R$ 449,00" }
];
var links = [
    "html/teclados/aulaf75.html",
    "html/mouses/g305.html",
    "html/fones/g733.html"
];
var indice = 0;
var TRANSITION_MS = 150;
var banner = document.getElementById('banner');
var prevBtn = document.getElementById('button-retorno');
var nextBtn = document.getElementById('button-avanco');
var bannerTitle = document.getElementById('banner-title');
var bannerText = document.getElementById('banner-text');
var bannerPrice = document.getElementById('banner-price');
if (banner) {
    banner.style.transition = `opacity ${TRANSITION_MS}ms ease`;
    banner.style.opacity = '1';
}
// inicializa descrição junto com a imagem atual
function atualizarDescricao() {
    if (bannerTitle) bannerTitle.textContent = descricoes[indice].title || "";
    if (bannerText) bannerText.textContent = descricoes[indice].text || "";
    if (bannerPrice) bannerPrice.textContent = descricoes[indice].price || "";
}
var botaoMore = document.getElementById('banner-more');
    if (botaoMore) {
        botaoMore.onclick = function() {
            location.href = links[indice];
        };
    }
atualizarDescricao();
var isSwitching = false;
function animateButton(btn) {
    if (!btn) return;
    btn.classList.add('nav-anim');
    setTimeout(() => btn.classList.remove('nav-anim'), 180);
}
function mostrarImagem() {
    if (!banner) return;
    var proxima = imagens[indice];
    if (banner.dataset.target === proxima) return;
    banner.dataset.target = proxima;
    if (banner._onFade) {
        banner.removeEventListener('transitionend', banner._onFade);
        banner._onFade = null;
    }
    const onTransitionEnd = (e) => {
        if (e.propertyName !== 'opacity') return;
        banner.removeEventListener('transitionend', onTransitionEnd);
        banner._onFade = null;
        banner.src = proxima;
        // atualiza a descrição quando a imagem for trocada
        atualizarDescricao();
        requestAnimationFrame(() => requestAnimationFrame(() => banner.style.opacity = '1'));
    };
    banner._onFade = onTransitionEnd;
    banner.addEventListener('transitionend', onTransitionEnd);
    banner.style.opacity = '0';
    setTimeout(() => { isSwitching = false; }, TRANSITION_MS * 2 + 60);
}
function nextImage() {
    if (isSwitching) return;
    isSwitching = true;
    animateButton(nextBtn);
    indice = (indice + 1) % imagens.length;
    mostrarImagem();
}
function prevImage() {
    if (isSwitching) return;
    isSwitching = true;
    animateButton(prevBtn);
    indice = (indice - 1 + imagens.length) % imagens.length;
    mostrarImagem();
}
function adicionar_carrinho() {
    alert("Produto adicionado ao carrinho!");
}
if (nextBtn) nextBtn.addEventListener('click', nextImage);
if (prevBtn) prevBtn.addEventListener('click', prevImage);
