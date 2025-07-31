function getCurrentUser() {
  const phone = localStorage.getItem("currentUserPhone");
  if (!phone) return null;
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  return users.find(u => u.phone === phone) || null;
}

function saveCurrentUserData(type, value) {
  const phone = localStorage.getItem("currentUserPhone");
  if (!phone) return;
  let users = JSON.parse(localStorage.getItem("users") || "[]");
  const userIndex = users.findIndex(u => u.phone === phone);
  if (userIndex === -1) return;
  users[userIndex][type] = value;
  localStorage.setItem("users", JSON.stringify(users));
}

function getFavorites() {
  return getCurrentUser()?.favorites || [];
}

function saveFavorites(favorites) {
  saveCurrentUserData("favorites", favorites);
}

function isProductFavorite(productId) {
  return getFavorites().includes(productId);
}

function toggleFavorite(productId, heartImg) {
  let favorites = getFavorites();

  if (favorites.includes(productId)) {
    favorites = favorites.filter(id => id !== productId);
    if (heartImg) {
      heartImg.classList.remove("favorited");
      heartImg.src = "icons/heart.jpg";
    }
  } else {
    favorites.push(productId);
    if (heartImg) {
      heartImg.classList.add("favorited");
      heartImg.src = "icons/heart2.png";
    }
  }

  saveFavorites(favorites);
}

function markFavoriteHearts() {
  const favorites = getFavorites();
  document.querySelectorAll('.heart-icon[data-id]').forEach(icon => {
    const productId = parseInt(icon.dataset.id);
    icon.src = favorites.includes(productId) ? 'icons/heart2.png' : 'icons/heart.jpg';
  });
}

function getCart() {
  return getCurrentUser()?.cart || [];
}

function saveCart(cart) {
  saveCurrentUserData("cart", cart);
}

function addToCart(productId) {
  const product = goods.find(p => p.id === productId);
  if (!product) {
    alert('Товар не найден!');
    return;
  }

  const cart = getCart();
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    if (existing.quantity < 10) existing.quantity++;
  } else {
    cart.push({ id: product.id, quantity: 1 });
  }

  saveCart(cart);
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const el = document.getElementById("cart-count");
  if (el) el.textContent = count > 0 ? `(${count})` : '';
}

document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  markFavoriteHearts();

  document.querySelectorAll(".add-to-cart-icon, .cart-icon").forEach(icon => {
    icon.addEventListener("click", () => {
      const productId = parseInt(icon.dataset.id);
      addToCart(productId);
    });
  });
});
