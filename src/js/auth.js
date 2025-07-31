// ✅ auth.js — строгая изоляция пользователя по номеру телефона

document.addEventListener('DOMContentLoaded', () => {
  const authForm = document.getElementById('auth-form');
  const phoneNumberInput = document.getElementById('phone-number');
  const authMessage = document.getElementById('auth-message');

  // Очистим предыдущего пользователя при открытии страницы
  localStorage.removeItem('currentUserPhone');

  authForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const phoneNumber = phoneNumberInput.value.trim();

    if (phoneNumber) {
      localStorage.setItem('currentUserPhone', phoneNumber);

      // Загрузка всех пользователей
      let users = JSON.parse(localStorage.getItem('users') || '[]');
      let userIndex = users.findIndex(u => u.phone === phoneNumber);

      // Если пользователь не существует — создаём с пустыми данными
      if (userIndex === -1) {
        users.push({ phone: phoneNumber, cart: [], favorites: [] });
      }

      localStorage.setItem('users', JSON.stringify(users));

      authMessage.textContent = `Добро пожаловать, ${phoneNumber}!`;
      authMessage.classList.remove('hidden');
      authMessage.style.color = '#3333CC';

      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1500);
    } else {
      authMessage.textContent = 'Введите номер телефона';
      authMessage.classList.remove('hidden');
      authMessage.style.color = 'red';
    }
  });

  // Удаляем отображение чужих данных при загрузке страницы
  const loginLink = document.querySelector('a[href="login.html"]');
  if (loginLink) {
    loginLink.innerHTML = `<img src="icons/human.jpg" alt="Profile"> Войти`;
  }
});

// 🔁 Использование user-specific хранилища
function getCurrentUser() {
const phone = localStorage.getItem("currentUserPhone");
if (!phone) return null;
const users = JSON.parse(localStorage.getItem("users") || "[]");
return users.find(u => u.phone === phone) || null;
}

function saveCurrentUserData(dataType, data) {
const phone = localStorage.getItem("currentUserPhone");
if (!phone) return;
let users = JSON.parse(localStorage.getItem("users") || "[]");
const userIndex = users.findIndex(u => u.phone === phone);
if (userIndex === -1) return;
users[userIndex][dataType] = data;
localStorage.setItem("users", JSON.stringify(users));
}

function getFavorites() {
const user = getCurrentUser();
return user?.favorites || [];
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
  heartImg?.classList.remove('favorited');
  if (heartImg) heartImg.src = 'icons/heart.jpg';
} else {
  favorites.push(productId);
  heartImg?.classList.add('favorited');
  if (heartImg) heartImg.src = 'icons/heart2.png';
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
const user = getCurrentUser();
return user?.cart || [];
}

function saveCart(cart) {
saveCurrentUserData("cart", cart);
}

function updateCartCount() {
const cart = getCart();
const count = cart.reduce((sum, item) => sum + item.quantity, 0);
const el = document.getElementById("cart-count");
if (el) el.textContent = count > 0 ? `(${count})` : '';
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
  cart.push({
    id: product.id,
    quantity: 1
  });
}

saveCart(cart);
updateCartCount();
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
