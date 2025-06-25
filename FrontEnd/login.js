document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.querySelector("form");

  if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      try {
        const response = await fetch("http://localhost:5678/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("token", data.token);
          window.location.href = "index.html";
        } else {
          alert("Identifiants incorrects");
        }
      } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        alert("Une erreur est survenue.");
      }
    });
  }
});
