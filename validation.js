function validateLogin() {
  const email = document.forms["loginForm"]["email"].value.trim();
  const pass = document.forms["loginForm"]["password"].value;
  const errorBox = document.getElementById("error-message");

  // Reset
  errorBox.innerHTML = "";

  // 1. Champs vides
  if (email === "" || pass === "") {
    errorBox.innerHTML = "🌸 Please fill in all fields.";
    errorBox.style.color = "#A3001B";
    return false;
  }

  // 2. Format email valide
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errorBox.innerHTML = "🌸 Please enter a valid email address.";
    errorBox.style.color = "#A3001B";
    return false;
  }

  // 3. Mot de passe min 6 caractères
  if (pass.length < 6) {
    errorBox.innerHTML = "🌸 Password must be at least 6 characters.";
    errorBox.style.color = "#A3001B";
    return false;
  }

  return true; // ✅ tout est bon → formulaire envoyé
}
function validateRegister() {
  const name = document.forms["registerForm"]["full_name"].value.trim();
  const email = document.forms["registerForm"]["email"].value.trim();
  const pass = document.forms["registerForm"]["password"].value;
  const pass2 = document.forms["registerForm"]["confirm_password"].value;
  const errorBox = document.getElementById("error-message-register");

  errorBox.innerHTML = "";

  if (name === "" || email === "" || pass === "") {
    errorBox.innerHTML = "🌸 Please fill in all fields.";
    errorBox.style.color = "#A3001B";
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errorBox.innerHTML = "🌸 Please enter a valid email address.";
    errorBox.style.color = "#A3001B";
    return false;
  }

  if (pass.length < 6) {
    errorBox.innerHTML = "🌸 Password must be at least 6 characters.";
    errorBox.style.color = "#A3001B";
    return false;
  }

  // 4. Confirmation mot de passe
  if (pass !== pass2) {
    errorBox.innerHTML = "🌸 Passwords do not match.";
    errorBox.style.color = "#A3001B";
    return false;
  }

  return true;
}
