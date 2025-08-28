// Cart array to store added items
let cart = [];
let totalAmount = 0;

// Function to toggle service in cart
function toggleService(button, serviceName, price) {
  const index = cart.findIndex((item) => item.name === serviceName);

  if (index === -1) {
    // Add to cart
    cart.push({
      name: serviceName,
      price: price,
    });

    // Update button to remove state
    button.innerHTML = 'Remove Item <i class="fas fa-minus"></i>';
    button.classList.remove("add-btn");
    button.classList.add("remove-btn");
    button.onclick = function () {
      toggleService(this, serviceName, price);
    };
  } else {
    // Remove from cart
    cart.splice(index, 1);

    // Update button to add state
    button.innerHTML = 'Add Item <i class="fas fa-plus"></i>';
    button.classList.remove("remove-btn");
    button.classList.add("add-btn");
    button.onclick = function () {
      toggleService(this, serviceName, price);
    };
  }

  // Update cart display
  updateCartDisplay();
}

// Function to update cart display
function updateCartDisplay() {
  const cartItemsElement = document.getElementById("cartItems");
  const totalAmountElement = document.getElementById("totalAmount");

  // Reset total amount
  totalAmount = 0;

  if (cart.length === 0) {
    cartItemsElement.innerHTML = `
                    <div class="empty-cart">
                        <ion-icon name="information-circle-outline" style="font-size: 2.5rem" ></ion-icon>
                        <p>No Items Added</p>
                        <p>Add Items to the cart from the services bar</p>
                    </div>
                `;
    totalAmountElement.textContent = "₹0.00";
    return;
  }

  // Generate cart items HTML
  let cartHTML = "";
  cart.forEach((item, index) => {
    cartHTML += `
                    <div class="cart-item">
                        <div><strong>${index + 1}.&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</strong>${item.name}</div>
                        <div><strong>₹${item.price.toFixed(2)}</strong></div>
                    </div>
                `;
    totalAmount += item.price;
  });

  cartItemsElement.innerHTML = cartHTML;
  totalAmountElement.textContent = `₹${totalAmount.toFixed(2)}`;
}

// Handle form submission
document.getElementById("bookingForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Validate cart
  if (cart.length === 0) {
    alert("Please add at least one service to your cart before booking.");
    return;
  }

  // Validate form fields
  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();

  if (!fullName || !email || !phone) {
    alert("Please fill in all form fields.");
    return;
  }

  // Remove any previous success message
  let successMsg = document.getElementById("emailSuccessMsg");
  if (successMsg) successMsg.remove();

  // Create and insert success message below the button
  const btn = this.querySelector(".book-now-btn");
  successMsg = document.createElement("p");
  successMsg.id = "emailSuccessMsg";
  successMsg.innerHTML = `<ion-icon name="information-circle-outline" style="font-size: 2.5rem; vertical-align: middle; color:#2ecc71;"></ion-icon> <span style="color:#2ecc71;font-weight:bold;">Email has been sent successfully</span>`;
  successMsg.style.display = "flex";
  successMsg.style.alignItems = "center";
  successMsg.style.gap = "10px";
  successMsg.style.marginTop = "15px";
  btn.insertAdjacentElement("afterend", successMsg);

  // Reset form
  this.reset();

  // Reset cart after 2 seconds
  setTimeout(() => {
    cart = [];
    updateCartDisplay();
    resetServiceButtons();
    if (successMsg) successMsg.remove();
  }, 5000);
});

// Function to reset service buttons to "Add Item"
function resetServiceButtons() {
  const buttons = document.querySelectorAll(".service-controls .btn");
  buttons.forEach((button) => {
    if (button.classList.contains("remove-btn")) {
      button.innerHTML = '<i class="fas fa-plus"></i> Add Item';
      button.classList.remove("remove-btn");
      button.classList.add("add-btn");
    }
  });
}

