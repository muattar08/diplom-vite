document.addEventListener('DOMContentLoaded', () => {
  const favoritesContainer = document.getElementById('favorites-container');
  const emptyMessage = document.getElementById('empty-favorites');

  const favorites = getFavorites(); // Получаем избранное ТЕКУЩЕГО пользователя

  if (favorites.length === 0) {
    emptyMessage.classList.remove('hidden');
    favoritesContainer.classList.add('hidden');
    return;
  }

  emptyMessage.classList.add('hidden');
  favoritesContainer.classList.remove('hidden');

  const favoriteItems = goods.filter(product => favorites.includes(product.id));

  favoriteItems.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-image-container">
        <img src="${product.media[0]}" class="product-image" alt="${product.title}">
        <img src="icons/heart2.png" class="heart-icon active" data-id="${product.id}">
      </div>
      <h3 class="product-title">${product.title}</h3>
      <p class="product-price">${product.price.toLocaleString('ru-RU')} сум</p>
      <img src="icons/Korzina.png" class="add-to-cart-icon" data-id="${product.id}" alt="Добавить в корзину">
    `;

    favoritesContainer.appendChild(card);

    // Навигация на страницу товара
    card.querySelector('.product-image').addEventListener('click', () => {
      window.location.href = `product.html?id=${product.id}`;
    });
    card.querySelector('.product-title').addEventListener('click', () => {
      window.location.href = `product.html?id=${product.id}`;
    });

    // Удаление из избранного
    const heartIcon = card.querySelector('.heart-icon');
    heartIcon.addEventListener('click', () => {
      const updatedFavorites = favorites.filter(id => id !== product.id);
      saveFavorites(updatedFavorites);
      location.reload(); // перерисовка
    });

    // Добавление в корзину
    const cartIcon = card.querySelector('.add-to-cart-icon');
    cartIcon.addEventListener('click', () => {
      addToCart(product.id);
      updateCartCount();
    });
  });
});
