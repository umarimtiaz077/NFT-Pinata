function showSection(sectionId) {
    const sections = document.querySelectorAll('main > section');
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.classList.remove('hidden');
        } else {
            section.classList.add('hidden');
        }
    });
}


// JWT Secret Key (use an actual secure method in production)
const SECRET_KEY = "securesecretkey";

// Hardcoded admin credentials
const adminCredentials = [
  { email: "admin@example.com", password: "password123" },
  { email: "osama@example.com", password: "password123" },
  { email: "umar@example.com", password: "password444" }
];

// Generate a JWT (simplified for demo purposes)
function generateJWT(payload, secret) {
  const base64Payload = btoa(JSON.stringify(payload));
  const signature = btoa(secret);
  return `${base64Payload}.${signature}`;
}

// Decode and verify JWT
function verifyJWT(token, secret) {
  const [payload, signature] = token.split(".");
  const expectedSignature = btoa(secret);
  if (signature !== expectedSignature) return null;
  return JSON.parse(atob(payload));
}

// Login form logic
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");

    // Check credentials
    const user = adminCredentials.find(
      (cred) => cred.email === email && cred.password === password
    );

    if (user) {
      // Generate and store JWT
      const token = generateJWT({ email: user.email }, SECRET_KEY);
      localStorage.setItem("authToken", token);

      // Redirect to dashboard
      window.location.href = "index.html";
    } else {
      errorMessage.textContent = "Invalid email or password.";
    }
  });
}

// Logout button functionality
const logoutButton = document.getElementById("logoutButton");
if (logoutButton) {
  logoutButton.addEventListener("click", function () {
    localStorage.removeItem("authToken"); // Clear token
    window.location.href = "login.html"; // Redirect to login
  });
}

// Check if the user is authenticated (used on protected pages)
function isAuthenticated() {
  const token = localStorage.getItem("authToken");
  if (!token) return false;

  const user = verifyJWT(token, SECRET_KEY);
  return user ? true : false;
}

// Redirect to login if not authenticated
if (window.location.pathname !== "/login.html" && !isAuthenticated()) {
  window.location.href = "login.html";
}


// Logout link functionality
const logoutLink = document.getElementById("logoutLink");
if (logoutLink) {
  logoutLink.addEventListener("click", function (e) {
    e.preventDefault(); // Prevent default link behavior
    localStorage.removeItem("authToken"); // Clear the JWT token from local storage
    window.location.href = "login.html"; // Redirect the user to the login page
  });
}
