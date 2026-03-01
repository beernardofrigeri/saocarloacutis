var imagens = [
    "img/aulaf75.webp",
    "img/g305.webp",
    "img/g733.webp"
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
// shopping cart helpers ------------------------------------------------
function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}
function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}
function addToCart(product) {
    if (!product || !product.id) return;
    let cart = getCart();
    let existing = cart.find(p => p.id === product.id);
    if (existing) {
        existing.qty = (existing.qty || 0) + 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    saveCart(cart);
    alert('Produto adicionado ao carrinho!');
}

// called by product pages if they still use the old onclick style
function adicionar_carrinho() {
    // this function is kept for backwards compatibility; it expects a button
    // with data-* attributes describing the product.
    let btn = event.currentTarget || null;
    if (!btn) return;
    let product = {
        id: btn.dataset.id,
        title: btn.dataset.title,
        price: parseFloat(btn.dataset.price),
        image: btn.dataset.image
    };
    addToCart(product);
}

// cart rendering ----------------------------------------------------------
function renderCart() {
    let container = document.getElementById('cart-items');
    let totalEl = document.getElementById('cart-total');
    let checkoutBtn = document.getElementById('checkout-btn');
    if (!container || !totalEl) return;
    let cart = getCart();
    container.innerHTML = '';
    if (cart.length === 0) {
        container.innerHTML = '<p>Seu carrinho está vazio.</p>';
        totalEl.textContent = 'R$ 0,00';
        if (checkoutBtn) checkoutBtn.style.display = 'none';
        return;
    }
    let total = 0;
    cart.forEach(item => {
        let itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <img src="${item.image || ''}" alt="${item.title}" width="60" height="60">
            <span class="cart-title">${item.title}</span>
            <input type="number" min="1" value="${item.qty}" data-id="${item.id}" class="cart-qty">
            <span class="cart-price">R$ ${(item.price || 0).toFixed(2)}</span>
            <button data-id="${item.id}" class="cart-remove">×</button>
        `;
        container.appendChild(itemEl);
        total += (item.price || 0) * item.qty;
    });
    totalEl.textContent = 'R$ ' + total.toFixed(2);    if (checkoutBtn) checkoutBtn.style.display = 'block';    // attach listeners
    container.querySelectorAll('.cart-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            removeFromCart(btn.dataset.id);
        });
    });
    container.querySelectorAll('.cart-qty').forEach(input => {
        input.addEventListener('change', () => {
            updateQuantity(input.dataset.id, parseInt(input.value, 10));
        });
    });
}

function removeFromCart(id) {
    let cart = getCart().filter(i => i.id !== id);
    saveCart(cart);
    renderCart();
}

function updateQuantity(id, qty) {
    if (qty < 1) return;
    let cart = getCart();
    let item = cart.find(i => i.id === id);
    if (item) {
        item.qty = qty;
        saveCart(cart);
        renderCart();
    }
}

// generic initializer ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // attach handlers to "add to cart" buttons that use data-* attributes
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            // try to build product info from dataset; if missing, fall back to DOM
            let title = btn.dataset.title || '';
            let price = btn.dataset.price ? parseFloat(btn.dataset.price) : NaN;
            let image = btn.dataset.image || '';
            let id = btn.dataset.id || '';
            
            // when info is missing, look at page structure
            if (!title) {
                const h3 = btn.closest('.produto-descricao')?.querySelector('h3');
                if (h3) title = h3.textContent.replace(':','').trim();
            }
            
            // Try multiple ways to find the price
            if (isNaN(price) || price === 0) {
                const strong = btn.closest('.produto-descricao')?.querySelector('strong') ||
                               btn.closest('div')?.querySelector('strong');
                if (strong) {
                    let txt = strong.textContent.replace(/[^0-9,\.]/g,'').replace(',','.');
                    price = parseFloat(txt) || 0;
                }
                // Also try to find price in parent divs
                if (isNaN(price) || price === 0) {
                    let parent = btn.closest('div');
                    if (parent) {
                        let allText = parent.textContent;
                        let priceMatch = allText.match(/R\$?\s*([0-9,\.]+)/);
                        if (priceMatch) {
                            let priceStr = priceMatch[1].replace(',', '.');
                            price = parseFloat(priceStr) || 0;
                        }
                    }
                }
            }
            
            // Try multiple ways to find the image
            if (!image) {
                image = btn.closest('.produto-descricao')?.querySelector('img')?.src ||
                        btn.closest('div')?.querySelector('img')?.src ||
                        document.getElementById('banner_produto')?.src || '';
            }
            
            if (!id) {
                id = title.toLowerCase().replace(/\s+/g,'_').replace(/[^a-z0-9_]/g,'');
            }
            
            let product = { id, title, price, image };
            addToCart(product);
        });
    });

    // if cart page present render it
    if (document.getElementById('cart-items')) {
        renderCart();
        setupCheckout();
    }
});

// Checkout functionality
function setupCheckout() {
    let checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', startCheckout);
    }
}

function startCheckout() {
    let cart = getCart();
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }
    
    // Show loading modal
    let modal = document.getElementById('loading-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'loading-modal';
        modal.className = 'loading-modal show';
        modal.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <p class="loading-text">Processando compra...</p>
        `;
        document.body.appendChild(modal);
    } else {
        modal.classList.add('show');
    }
    
    let progressFill = modal.querySelector('.progress-fill');
    let progress = 0;
    
    let interval = setInterval(() => {
        progress += Math.random() * 40;
        if (progress > 90) progress = 90;
        progressFill.style.width = progress + '%';
    }, 100);
    
    setTimeout(() => {
        clearInterval(interval);
        progressFill.style.width = '100%';
        
        setTimeout(() => {
            modal.classList.remove('show');
            localStorage.removeItem('cart');
            alert('Compra finalizada com sucesso! Obrigado pela compra.');
            location.reload();
        }, 500);
    }, 2000);
}

if (nextBtn) nextBtn.addEventListener('click', nextImage);
if (prevBtn) prevBtn.addEventListener('click', prevImage);
