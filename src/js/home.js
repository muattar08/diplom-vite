document.addEventListener('DOMContentLoaded', () => {
  const popularContainer = document.getElementById('popular-products');
  const sportContainer1 = document.getElementById('sport-clothes-products-1');
  const activeContainer1 = document.getElementById('active-products-1');
  const sportContainer2 = document.getElementById('sport-clothes-products-2');
  const activeContainer2 = document.getElementById('active-products-2');
  const showMoreBtn = document.getElementById('show-more-btn');

  const searchInput = document.getElementById('search-input');
  const suggestions = document.getElementById('suggestions');

  const allGoods = goods;
  const initialPopular = allGoods.slice(0, 15);
  const restPopular = allGoods.slice(15);

  renderProducts(initialPopular, popularContainer);

  showMoreBtn.addEventListener('click', () => {
    renderProducts(restPopular, popularContainer);
    showMoreBtn.remove();
  });

  renderProducts(allGoods.slice(0, 5), sportContainer1);
  renderProducts(allGoods.slice(5, 10), activeContainer1);
  renderProducts(allGoods.slice(10, 15), sportContainer2);
  renderProducts(allGoods.slice(15, 20), activeContainer2);

  // Поиск
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    suggestions.innerHTML = '';
    if (!query) {
      suggestions.classList.add('hidden');
      return;
    }

    const matches = goods.filter(g => g.title.toLowerCase().includes(query));
    if (matches.length === 0) {
      suggestions.classList.add('hidden');
      return;
    }

    matches.forEach(item => {
      const span = document.createElement('span');
      span.textContent = item.title;
      span.onclick = () => {
        window.location.href = `product.html?id=${item.id}`;
      };
      suggestions.appendChild(span);
    });

    suggestions.classList.remove('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-bar')) {
      suggestions.classList.add('hidden');
    }
  });
});

function renderProducts(products, container) {
  const favorites = getFavorites();

  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';

    const isFav = favorites.includes(product.id);
    const heartImg = isFav ? 'icons/heart2.png' : 'icons/heart.jpg';

    card.innerHTML = `
      <img src="${heartImg}" class="heart-icon ${isFav ? 'active' : ''}" data-id="${product.id}">
      <img src="${product.media[0]}" alt="${product.title}" class="product-image">
      <h3 class="product-title">${product.title}</h3>
      <p class="product-price">${product.price.toLocaleString('ru-RU')} сум</p>
      <img src="icons/Korzina.png" class="add-to-cart-icon" data-id="${product.id}" />
    `;

    container.appendChild(card);

    card.querySelector('.add-to-cart-icon').addEventListener('click', () => addToCart(product.id));

    const heart = card.querySelector('.heart-icon');
    heart.addEventListener('click', () => {
      toggleFavorite(product.id, heart);
    });

    card.querySelector('.product-image').addEventListener('click', () => {
      window.location.href = `product.html?id=${product.id}`;
    });

    card.querySelector('.product-title').addEventListener('click', () => {
      window.location.href = `product.html?id=${product.id}`;
    });
  });
}

function toggleFavorite(productId, heartIcon) {
  let favorites = getFavorites();

  if (favorites.includes(productId)) {
    favorites = favorites.filter(id => id !== productId);
    heartIcon.classList.remove('active');
    heartIcon.src = 'icons/heart.jpg';
  } else {
    favorites.push(productId);
    heartIcon.classList.add('active');
    heartIcon.src = 'icons/heart2.png';
  }

  saveFavorites(favorites);
}
