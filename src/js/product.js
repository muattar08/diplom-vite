document.addEventListener('DOMContentLoaded', () => {
  const productDetailsContainer = document.getElementById('product-details');
  const similarProductsContainer = document.getElementById('similar-products-container');

  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseFloat(urlParams.get('id'));

  if (productId) {
    const product = goods.find(item => item.id === productId);

    if (product) {
      renderProductDetails(product);
      renderSimilarProducts(product);
    } else {
      productDetailsContainer.innerHTML = '<p>Product not found.</p>';
    }
  } else {
    productDetailsContainer.innerHTML = '<p>No product ID provided.</p>';
  }

  function renderProductDetails(product) {
    const isFavorite = isProductFavorite(product.id);
    const heartSrc = isFavorite ? 'icons/heart2.png' : 'icons/heart.jpg';

    let priceHTML = `<span class="product-detail-price">${product.price.toLocaleString('ru-RU')} сум</span>`;
    if (product.isBlackFriday && product.salePercentage > 0) {
      const oldPrice = product.price / (1 - product.salePercentage / 100);
      priceHTML = `
        <span class="product-detail-old-price">${oldPrice.toLocaleString('ru-RU')} сум</span>
        <span class="product-detail-price product-detail-sale-price">${product.price.toLocaleString('ru-RU')} сум</span>
      `;
    }

    productDetailsContainer.innerHTML = `
      <div class="product-main-info">
        <div class="product-images">
          <img src="${product.media[0]}" alt="${product.title}" class="main-product-image">
          <div class="thumbnail-images">
            ${product.media.map(img => `<img src="${img}" alt="Thumbnail" class="thumbnail-image">`).join('')}
          </div>
        </div>
        <div class="product-info">
          <h1 class="product-detail-title">${product.title}</h1>
          <p class="product-detail-rating">Рейтинг: ${product.rating} / 5</p>
          <div class="product-price-section">${priceHTML}</div>
          <div class="product-description">
            <h2>Описание товара</h2>
            <p>${product.description || 'Нет описания.'}</p>
          </div>
          <div class="product-buttons">
            <button class="add-to-cart-btn" data-id="${product.id}">Добавить в корзину</button>
            <button class="add-to-fav-btn" data-id="${product.id}">
              <img src="${heartSrc}" class="heart-icon" data-id="${product.id}">
              Добавить в избранное
            </button>
          </div>
        </div>
      </div>
    `;

    document.querySelectorAll('.thumbnail-image').forEach(thumbnail => {
      thumbnail.addEventListener('click', () => {
        document.querySelector('.main-product-image').src = thumbnail.src;
      });
    });

    document.querySelector('.add-to-cart-btn').addEventListener('click', () => {
      addToCart(product.id);
      updateCartCount();
    });

    document.querySelector('.add-to-fav-btn').addEventListener('click', (e) => {
      const heartIcon = e.currentTarget.querySelector('.heart-icon');
      toggleFavorite(product.id, heartIcon);
    });
  }

  function renderSimilarProducts(currentProduct) {
    const similar = goods.filter(item => item.type === currentProduct.type && item.id !== currentProduct.id).slice(0, 5);

    similarProductsContainer.innerHTML = '';
    similar.forEach(product => {
      const isFavorite = isProductFavorite(product.id);
      const heartSrc = isFavorite ? 'icons/heart2.png' : 'icons/heart.jpg';

      const productCard = document.createElement('div');
      productCard.classList.add('product-card');

      let priceHTML = `<p class="product-price">${product.price.toLocaleString('ru-RU')} сум</p>`;
      if (product.isBlackFriday && product.salePercentage > 0) {
        const oldPrice = product.price / (1 - product.salePercentage / 100);
        priceHTML = `
          <p class="product-old-price">${oldPrice.toLocaleString('ru-RU')} сум</p>
          <p class="product-price product-sale-price">${product.price.toLocaleString('ru-RU')} сум</p>
        `;
      }

      productCard.innerHTML = `
        <div class="product-image-container">
          <img src="${product.media[0]}" alt="${product.title}" class="product-image">
          <img src="${heartSrc}" class="heart-icon" data-id="${product.id}">
        </div>
        <h3 class="product-title">${product.title}</h3>
        ${priceHTML}
        <img src="icons/Korzina.png" class="add-to-cart-icon" data-id="${product.id}" alt="Добавить в корзину">
      `;

      productCard.querySelector('.add-to-cart-icon').addEventListener('click', () => {
        addToCart(product.id);
        updateCartCount();
      });

      const heartIcon = productCard.querySelector('.heart-icon');
      heartIcon.addEventListener('click', () => {
        toggleFavorite(product.id, heartIcon);
      });

      productCard.querySelector('.product-image').addEventListener('click', () => {
        window.location.href = `product.html?id=${product.id}`;
      });

      productCard.querySelector('.product-title').addEventListener('click', () => {
        window.location.href = `product.html?id=${product.id}`;
      });

      similarProductsContainer.appendChild(productCard);
    });
  }

  function isProductFavorite(id) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.includes(id);
  }
});
