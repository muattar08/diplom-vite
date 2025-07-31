// 📁 catalog.js

document.addEventListener('DOMContentLoaded', () => {
  const categoryList = document.getElementById('category-list');
  const productsContainer = document.getElementById('category-products');
  const popularContainer = document.getElementById('popular-products');
  const searchInput = document.getElementById('search-input');
  const suggestions = document.getElementById('suggestions');

  let openedCategory = null;
  const categories = [...new Set(goods.map(p => p.type))];

  categories.forEach(category => {
    const li = document.createElement('li');
    li.textContent = category;
    li.addEventListener('click', () => {
      if (openedCategory === category) {
        productsContainer.innerHTML = '';
        openedCategory = null;
      } else {
        const filtered = goods.filter(p => p.type === category);
        showProducts(filtered, productsContainer);
        openedCategory = category;
      }
    });
    categoryList.appendChild(li);
  });

  function showProducts(products, container) {
    container.innerHTML = '';
    products.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.dataset.id = product.id;
      card.innerHTML = `
        <img src="${product.media[0]}" class="product-image" alt="${product.title}">
        <img src="icons/${isProductFavorite(product.id) ? 'heart2.png' : 'heart.jpg'}" class="favorite-icon" data-id="${product.id}">
        <h3 class="product-title">${product.title}</h3>
        <p class="product-price">${product.price.toLocaleString('ru-RU')} сум</p>
        <img src="icons/Korzina.png" class="cart-icon" data-id="${product.id}" />
      `;
      card.addEventListener('click', () => {
        window.location.href = `product.html?id=${product.id}`;
      });
      container.appendChild(card);
    });

    markFavoriteHearts();
    setupButtons();
  }

  function setupButtons() {
    document.querySelectorAll('.favorite-icon').forEach(icon => {
      icon.onclick = (e) => {
        e.stopPropagation();
        const id = parseInt(icon.dataset.id);
        toggleFavorite(id, icon);
      };
    });

    document.querySelectorAll('.cart-icon').forEach(icon => {
      icon.onclick = (e) => {
        e.stopPropagation();
        const id = parseInt(icon.dataset.id);
        addToCart(id);
      };
    });
  }

  const popularGoods = goods.slice(0, 10);
  showProducts(popularGoods, popularContainer);

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
        showProducts([item], productsContainer);
        suggestions.classList.add('hidden');
        searchInput.value = '';
      };
      suggestions.appendChild(span);
    });

    suggestions.classList.remove('hidden');
  });
});
