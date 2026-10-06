// =========================
// AVIZ FOOD DELIVERY APP
// =========================

let cart = [];

// =========================
// LOGIN
// =========================

function openLogin() {
  const loginModal = document.getElementById("loginModal");

  if (loginModal) {
    loginModal.style.display = "flex";
  }
}

function closeLogin() {
  const loginModal = document.getElementById("loginModal");

  if (loginModal) {
    loginModal.style.display = "none";
  }
}

// Close login when clicking outside the box
window.addEventListener("click", function (event) {
  const loginModal = document.getElementById("loginModal");

  if (event.target === loginModal) {
    closeLogin();
  }
});

// Login form
function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  alert("Login successful! Welcome to AVIZ.");

  closeLogin();

  document.getElementById("loginEmail").value = "";
  document.getElementById("loginPassword").value = "";
}

// Register
function registerUser() {
  alert("Registration page will be available soon.");
}

// =========================
// CART
// =========================

function addToCart(name, price) {

  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name: name,
      price: price,
      quantity: 1
    });
  }

  updateCart();

  alert(`${name} added to cart!`);
}

// Remove item from cart
function removeFromCart(index) {

  cart.splice(index, 1);

  updateCart();
}

// Update cart
function updateCart() {

  const cartCount = document.getElementById("cartCount");
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  // Calculate total quantity
  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  if (cartCount) {
    cartCount.textContent = totalItems;
  }

  // Empty cart
  if (cart.length === 0) {

    if (cartItems) {
      cartItems.innerHTML = `
        <div class="empty-cart">
          <p>Your cart is empty 🛒</p>
          <p>Add some delicious food!</p>
        </div>
      `;
    }
    if (cartTotal) {
      cartTotal.textContent = "₹0";

    }


    return;
  }


  // Display cart items

  let html = "";

  let total = 0;


  cart.forEach((item, index) => {


    const itemTotal = item.price * item.quantity;

    total += itemTotal;


    html += `
      <div class="cart-item">


        <div>

          <strong>${item.name}</strong>


          <p>
            ₹${item.price} × ${item.quantity}

          </p>
        </div>

        <div>
          <strong>₹${itemTotal}</strong>

          <button onclick="removeFromCart(${index})">
            ❌
          </button>
        </div>

      </div>
    `;
  });

  if (cartItems) {
    cartItems.innerHTML = html;
  }

  if (cartTotal) {
    cartTotal.textContent = `₹${total}`;
  }
}

// =========================
// OPEN CART
// =========================

function openCart() {

  const cartModal = document.getElementById("cartModal");

  if (cartModal) {
    cartModal.style.display = "block";
  }

  updateCart();
}

// =========================
// CLOSE CART
// =========================

function closeCart() {

  const cartModal = document.getElementById("cartModal");

  if (cartModal) {
    cartModal.style.display = "none";
  }
}

// Close cart when clicking outside
window.addEventListener("click", function (event) {

  const cartModal = document.getElementById("cartModal");

  if (event.target === cartModal) {
    closeCart();
  }

});

// =========================
// CHECKOUT
// =========================

function checkout() {

  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  alert(
    "Order placed successfully! 🍕\n\nThank you for ordering from AVIZ."
  );

  cart = [];

  updateCart();

  closeCart();
}

// =========================
// SEARCH
// =========================

function searchFood() {

  const searchInput =
    document.getElementById("searchInput");

  if (!searchInput) {
    return;
  }

  const searchText =
    searchInput.value.toLowerCase().trim();

  const restaurants =
    document.querySelectorAll(".restaurant-card");

  restaurants.forEach(card => {

    const text =
      card.textContent.toLowerCase();

    if (text.includes(searchText)) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }

  });
}

// =========================
// HERO SEARCH
// =========================

function heroSearch() {

  const input =
    document.getElementById("heroSearchInput");

  if (!input) {
    return;
  }

  const searchText =
    input.value.toLowerCase().trim();

  const restaurants =
    document.querySelectorAll(".restaurant-card");

  if (searchText === "") {

    restaurants.forEach(card => {
      card.style.display = "";
    });

    return;
  }

  restaurants.forEach(card => {

    const text =
      card.textContent.toLowerCase();

    if (text.includes(searchText)) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }

  });

  // Scroll to restaurants
  const restaurantSection =
    document.getElementById("restaurants");

  if (restaurantSection) {
    restaurantSection.scrollIntoView({
      behavior: "smooth"
    });
  }
}

// =========================
// CATEGORY FILTER
// =========================

function filterCategory(category) {

  const restaurants =
    document.querySelectorAll(".restaurant-card");

  restaurants.forEach(card => {

    const cardCategory =
      card.getAttribute("data-category");

    if (
      category === "all" ||
      cardCategory === category
    ) {
      card.style.display = "";
    } else {
      card.style.display = "none";
    }

  });

  const restaurantSection =
    document.getElementById("restaurants");

  if (restaurantSection) {

    restaurantSection.scrollIntoView({
      behavior: "smooth"
    });

  }
}

// =========================
// VIEW ALL RESTAURANTS
// =========================

function viewAllRestaurants() {

  const restaurants =
    document.querySelectorAll(".restaurant-card");

  restaurants.forEach(card => {
    card.style.display = "";
  });

  const restaurantSection =
    document.getElementById("restaurants");

  if (restaurantSection) {

    restaurantSection.scrollIntoView({
      behavior: "smooth"
    });

  }
}

// =========================
// INITIALIZE APP
// =========================

document.addEventListener("DOMContentLoaded", function () {

  updateCart();

  console.log("AVIZ Food Delivery App loaded successfully.");

});
