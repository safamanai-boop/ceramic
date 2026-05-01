// script.js – Pottery of the Soul

// ══════════════════════════════════════════════
//  PANIER — helpers
// ══════════════════════════════════════════════
function getCart() {
  return JSON.parse(localStorage.getItem("pottery_cart") || "[]");
}
function saveCart(c) {
  localStorage.setItem("pottery_cart", JSON.stringify(c));
}

function updateCartBadge() {
  const count = getCart().reduce((s, i) => s + i.quantity, 0);
  document.querySelectorAll("#cart-badge").forEach((b) => {
    b.textContent = count;
    b.style.display = count > 0 ? "flex" : "none";
  });
}

// ══════════════════════════════════════════════
//  PANIER — Add to cart (called from any page)
// ══════════════════════════════════════════════
function addToCart(productId, productName, productPrice, productImage, btn) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: productId,
      name: productName,
      price: parseFloat(productPrice),
      image: productImage,
      quantity: 1,
    });
  }

  saveCart(cart);
  updateCartBadge();

  // ── visual feedback on the button ──
  const original = btn.innerHTML;
  btn.innerHTML = "✅ Added!";
  btn.style.background = "#FFFACD";
  btn.style.color = "#3a7d44";
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = original;
    btn.style.background = "";
    btn.style.color = "";
    btn.disabled = false;
  }, 1500);

  // ── also save in DB via AJAX (if user logged in) ──
  const fd = new FormData();
  fd.append("product_id", productId);
  fetch("back/order.php", { method: "POST", body: fd }).catch(() => {});
}

// ══════════════════════════════════════════════
//  DOM READY — attach all events
// ══════════════════════════════════════════════
document.addEventListener("DOMContentLoaded", function () {
  // Init badge
  updateCartBadge();

  // ── Attach Add to Cart buttons ──
  document.querySelectorAll(".order-btn").forEach((btn) => {
    btn.addEventListener("click", function () {
      addToCart(
        this.dataset.id,
        this.dataset.name,
        this.dataset.price,
        this.dataset.image || "",
        this
      );
    });
  });

  // ── Email check on register ──
  const regEmail = document.getElementById("reg-email");
  if (regEmail) {
    let timer;
    regEmail.addEventListener("input", function () {
      clearTimeout(timer);
      const val = this.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return;
      timer = setTimeout(() => {
        fetch("back/check_email.php?email=" + encodeURIComponent(val))
          .then((r) => r.json())
          .then((data) => {
            if (data.exists)
              showFieldError("err-reg-email", "🌸 Email already registered.");
          });
      }, 600);
    });
  }
});

// ══════════════════════════════════════════════
//  AUTH — Tab switching
// ══════════════════════════════════════════════
function switchTab(tab) {
  const lf = document.getElementById("loginForm");
  const rf = document.getElementById("registerForm");
  const tabs = document.querySelectorAll(".tab");
  if (!lf) return;
  if (tab === "login") {
    lf.style.display = "block";
    rf.style.display = "none";
    tabs[0].classList.add("active");
    tabs[1].classList.remove("active");
  } else {
    lf.style.display = "none";
    rf.style.display = "block";
    tabs[0].classList.remove("active");
    tabs[1].classList.add("active");
  }
  clearErrors();
}

function clearErrors() {
  document
    .querySelectorAll(".field-error")
    .forEach((el) => (el.textContent = ""));
  document.querySelectorAll(".form-msg").forEach((el) => {
    el.textContent = "";
    el.className = "form-msg";
  });
  document
    .querySelectorAll("input")
    .forEach((el) => el.classList.remove("invalid"));
}

function showFieldError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
  const input = el ? el.previousElementSibling : null;
  if (input && input.tagName === "INPUT") input.classList.add("invalid");
}

// ══════════════════════════════════════════════
//  AUTH — Validation
// ══════════════════════════════════════════════
function validateLogin() {
  clearErrors();
  const email = document.getElementById("login-email").value.trim();
  const pass = document.getElementById("login-pass").value;
  let ok = true;
  if (!email) {
    showFieldError("err-login-email", "🌸 Email required.");
    ok = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFieldError("err-login-email", "🌸 Invalid email.");
    ok = false;
  }
  if (!pass) {
    showFieldError("err-login-pass", "🌸 Password required.");
    ok = false;
  } else if (pass.length < 6) {
    showFieldError("err-login-pass", "🌸 Min. 6 characters.");
    ok = false;
  }
  if (ok) submitLogin(email, pass);
  return false;
}

function validateRegister() {
  clearErrors();
  const name = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const pass = document.getElementById("reg-pass").value;
  const pass2 = document.getElementById("reg-pass2").value;
  let ok = true;
  if (!name) {
    showFieldError("err-reg-name", "🌸 Name required.");
    ok = false;
  }
  if (!email) {
    showFieldError("err-reg-email", "🌸 Email required.");
    ok = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showFieldError("err-reg-email", "🌸 Invalid email.");
    ok = false;
  }
  if (!pass) {
    showFieldError("err-reg-pass", "🌸 Password required.");
    ok = false;
  } else if (pass.length < 6) {
    showFieldError("err-reg-pass", "🌸 Min. 6 characters.");
    ok = false;
  }
  if (!pass2) {
    showFieldError("err-reg-pass2", "🌸 Confirm password.");
    ok = false;
  } else if (pass !== pass2) {
    showFieldError("err-reg-pass2", "🌸 Passwords do not match.");
    ok = false;
  }
  if (ok) submitRegister(name, email, pass);
  return false;
}

// ══════════════════════════════════════════════
//  AUTH — AJAX submit
// ══════════════════════════════════════════════
function submitLogin(email, pass) {
  const msg = document.getElementById("login-msg");
  msg.textContent = "Signing in…";
  msg.className = "form-msg";
  const fd = new FormData();
  fd.append("email", email);
  fd.append("password", pass);
  fetch("back/login.php", { method: "POST", body: fd })   // ✅ fixed path
    .then((r) => r.json())
    .then((data) => {
      if (data.success) {
        msg.textContent = "✅ Welcome, " + data.name + "!";
        msg.className = "form-msg success";
        setTimeout(() => (window.location.href = "mes-commandes.html"), 1000); // ✅ goes to wishlist
      } else {
        msg.textContent = "🌸 " + data.message;
        msg.className = "form-msg error";
      }
    })
    .catch(() => {
      msg.textContent = "🌸 Server error.";
      msg.className = "form-msg error";
    });
}

function submitRegister(name, email, pass) {
  const msg = document.getElementById("register-msg");
  msg.textContent = "Creating account…";
  msg.className = "form-msg";
  const fd = new FormData();
  fd.append("full_name", name);
  fd.append("email", email);
  fd.append("password", pass);
  fetch("back/register.php", { method: "POST", body: fd })  // ✅ fixed path
    .then((r) => r.json())
    .then((data) => {
      if (data.success) {
        msg.textContent = "✅ Account created! Welcome, " + data.name + "!";
        msg.className = "form-msg success";
        setTimeout(() => (window.location.href = "mes-commandes.html"), 1200); // ✅ goes to wishlist
      } else {
        msg.textContent = "🌸 " + data.message;
        msg.className = "form-msg error";
      }
    })
    .catch(() => {
      msg.textContent = "🌸 Server error.";
      msg.className = "form-msg error";
    });
}

// ══════════════════════════════════════════════
//  DOM — Scroll animation (about page)
// ══════════════════════════════════════════════
let lastScrollY = window.scrollY,
  scrollingDown = true;
window.addEventListener("scroll", () => {
  scrollingDown = window.scrollY > lastScrollY;
  lastScrollY = window.scrollY;
});
const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && scrollingDown) e.target.classList.add("visible");
    });
  },
  { threshold: 0.2 }
);
document
  .querySelectorAll(".img, .img2, .img3")
  .forEach((el) => obs.observe(el));