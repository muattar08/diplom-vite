document.addEventListener("DOMContentLoaded", () => {
  const cartContainer = document.getElementById("cart-container");
  const emptyCart = document.getElementById("empty-cart-section");
  const cartHeader = document.getElementById("cart-header");
  const orderSummary = document.getElementById("order-summary");
  const totalAmount = document.getElementById("total-amount");
  const totalItems = document.getElementById("total-items");
  const totalDiscount = document.getElementById("total-discount");
  const orderBtn = document.getElementById("order-btn");

  let cart = getCart();

  function renderCart() {
    cartContainer.innerHTML = "";

    if (cart.length === 0) {
      cartHeader.classList.add("hidden");
      orderSummary?.classList.add("hidden");
      emptyCart.classList.remove("hidden");
      return;
    }

    cartHeader.classList.remove("hidden");
    orderSummary?.classList.remove("hidden");
    emptyCart.classList.add("hidden");

    let total = 0;
    let count = 0;

    cart.forEach(item => {
      const product = goods.find(p => p.id === item.id);
      if (!product) return;

      const quantity = item.quantity;
      const itemTotal = product.price * quantity;
      total += itemTotal;
      count += quantity;

      const card = document.createElement("div");
      card.className = "cart-item";
      card.dataset.id = product.id;
      card.innerHTML = `
        <img src="${product.media[0]}" alt="${product.title}">
        <div class="cart-info">
          <h3>${product.title}</h3>
          <p>${product.price.toLocaleString()} сум</p>
          <div class="quantity-controls">
            <button class="decrease" data-id="${product.id}">−</button>
            <span>${quantity}</span>
            <button class="increase" data-id="${product.id}">+</button>
          </div>
        </div>
      `;

      card.querySelector("img").addEventListener("click", () => {
        window.location.href = `product.html?id=${product.id}`;
      });

      cartContainer.appendChild(card);
    });

    totalAmount.textContent = `${total.toLocaleString()} сум`;
    totalItems.textContent = `Итого товаров: ${count}`;
    totalDiscount.textContent = `Итого скидки: 0 сум`;
  }

  cartContainer.addEventListener("click", (e) => {
    const id = parseInt(e.target.dataset.id);
    if (!id) return;

    const item = cart.find(p => p.id === id);
    if (!item) return;

    if (e.target.classList.contains("increase") && item.quantity < 10) {
      item.quantity++;
    } else if (e.target.classList.contains("decrease")) {
      item.quantity--;
      if (item.quantity < 1) {
        cart = cart.filter(p => p.id !== id);
      }
    }

    saveCart(cart);
    renderCart();
    updateCartCount();
  });

  orderBtn?.addEventListener("click", () => {
    const currentPhone = localStorage.getItem("currentUserPhone");
    if (!currentPhone) {
      alert("Пожалуйста, войдите в аккаунт для оформления заказа");
      return;
    }

    if (cart.length === 0) {
      alert("Корзина пуста");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const userIndex = users.findIndex(u => u.phone === currentPhone);
    if (userIndex === -1) return;

    const newOrder = {
      id: Date.now(),
      date: new Date().toLocaleString(),
      items: [...cart]
    };

    users[userIndex].orders = users[userIndex].orders || [];
    users[userIndex].orders.push(newOrder);
    users[userIndex].cart = [];
    localStorage.setItem("users", JSON.stringify(users));

    alert("🎉 Заказ успешно оформлен!");
    cart = [];
    renderCart();
    updateCartCount();
  });

  renderCart();
});
