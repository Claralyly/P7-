document.addEventListener("DOMContentLoaded", () => {
    const fondModale = document.getElementById("maModale");
    const modal1 = document.querySelector(".modalinter");
    const modal2 = document.querySelector(".addPhoto");
    const btnAjout = document.querySelector(".btnajt");
    const flecheRetour = document.querySelector(".fleche");
    const openButton = document.querySelector(".modifier");
    const worksDom = document.querySelector(".section-image");
    

  
    // Masquer tout au démarrage
    if (fondModale) fondModale.style.display = "none";
    if (modal1) modal1.style.display = "none";
    if (modal2) modal2.style.display = "none";
    const getWorks = async () => {
    try {
      const response = await fetch("http://localhost:5678/api/works");
      return await response.json();
    } catch (error) {
      console.error("Erreur lors de la récupération des travaux :", error);
    }
  };

  async function displayTravauxModal() {
    worksDom.innerHTML = "";
    const works = await getWorks();
    works.forEach((work) => {
      const workWrapper = document.createElement("div");
      workWrapper.classList.add("work-item");

      const img = document.createElement("img");
      img.src = work.imageUrl;
      img.id = work.id;

      const deleteIcon = document.createElement("i");
      deleteIcon.className = "fas fa-trash-can";

      deleteIcon.addEventListener("click", async () => {
        const token = localStorage.getItem("token");
        const idToDelete = work.id;

        const reponse = await fetch(`http://localhost:5678/api/works/`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (reponse.status === 204) {
          alert("Élément supprimé");
          workWrapper.remove();
        } else if (reponse.status === 401) {
          alert("Non autorisé");
        } else {
          alert("Erreur lors de la suppression");
        }
      });

      workWrapper.appendChild(img);
      workWrapper.appendChild(deleteIcon);
      worksDom.appendChild(workWrapper);
    });
  }

  displayTravauxModal();
  
    // Ouvrir la modale 1
    if (openButton) {
      openButton.addEventListener("click", (e) => {
        e.preventDefault();
        fondModale.style.display = "flex";
        modal1.style.display = "block";
        modal2.style.display = "none";
        displayTravauxModal(); // ⬅Recharge les images à chaque ouverture
      });
    }
  
    // Aller à la modale 2
    if (btnAjout) {
      btnAjout.addEventListener("click", () => {
        modal1.style.display = "none";
        modal2.style.display = "block";
      });
    }
  
    // Retour à la modale 1
    if (flecheRetour) {
      flecheRetour.addEventListener("click", () => {
        modal2.style.display = "none";
        modal1.style.display = "block";
      });
    }
  
    // Fermer avec les croix ✖
    document.addEventListener("click", (e) => {
      if (e.target.closest(".close")) {
        fondModale.style.display = "none";
        modal1.style.display = "none";
        modal2.style.display = "none";
      }
    });
  
    // Fermer au clic extérieur
    document.addEventListener("click", (e) => {
      const clicDansModale =
        modal1.contains(e.target) || modal2.contains(e.target);
      if (
        fondModale.style.display === "flex" &&
        fondModale.contains(e.target) &&
        !clicDansModale
      ) {
        fondModale.style.display = "none";
        modal1.style.display = "none";
        modal2.style.display = "none";
      }
    });
  
    // Aperçu image
    document.addEventListener("change", (e) => {
        if (e.target && e.target.id === "file") {
          const file = e.target.files[0];
          if (!file) return;
    
          const reader = new FileReader();
          reader.onload = (event) => {
            let previewImg = document.getElementById("displayedImage");
            if (!previewImg) {
              previewImg = document.createElement("img");
              previewImg.id = "displayedImage";
              document.querySelector(".containerPhoto").appendChild(previewImg);
            }
            previewImg.src = event.target.result;
            previewImg.style.display = "block";
    
            const icon = document.querySelector(".add-img");
            const label = document.querySelector("label.file");
            if (icon) icon.style.display = "none";
            if (label) label.style.display = "none";
          };
    
          reader.readAsDataURL(file);
        }
      });
    // bande déroulante
      async function injecterTexteDepuisAPI() {
        try {
          const reponse = await fetch("http://localhost:5678/api/message");
          const data = await reponse.json();
          const message = data.message;
      
          // Nettoie une éventuelle ancienne bande
          const ancienneBande = document.querySelector(".bande-roulante");
          if (ancienneBande) {
            ancienneBande.remove();
          }
      
          // Crée et insère la nouvelle bande
          const bande = document.createElement("div");
          bande.className = "bande-roulante";
          bande.textContent = message;
      
          const labelTitre = document.querySelector('label[for="title"]');
          if (labelTitre && labelTitre.parentNode) {
            labelTitre.parentNode.insertBefore(bande, labelTitre);
          }
        } catch (error) {
          console.error("Erreur chargement texte API :", error);
        }
      }
      async function chargerCategories() {
        try {
          const response = await fetch("http://localhost:5678/api/categories");
          const categories = await response.json();
      
          const select = document.getElementById("category"); // ← c’est bien "category" ici
          select.innerHTML = ""; // Nettoyer avant d'ajouter
      
          categories.forEach((categorie) => {
            const option = document.createElement("option");
            option.value = categorie.id;
            option.textContent = categorie.name;
            select.appendChild(option);
          });
        } catch (error) {
          console.error("Erreur lors du chargement des catégories :", error);
        }
      }
      btnAjout.addEventListener("click", () => {
        modal1.style.display = "none";
        modal2.style.display = "block";
        chargerCategories(); //l’appel est bon ici
      });
      //Ajouter une photo sur première modale //
const btnValider = document.querySelector(".btn-valider");

if (btnValider) {
  btnValider.addEventListener("click", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value;
    const imageFile = document.getElementById("file").files[0];

    if (!title || !category || !imageFile) {
      alert("Merci de remplir tous les champs avant de valider.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", parseInt(category));
    formData.append("image", imageFile);

    const token = localStorage.getItem("token");
    console.log("Token utilisé :", token);
for (let pair of formData.entries()) {
  console.log(pair[0] + ' ➜', pair[1]);
}

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout");
      }

      await new Promise((resolve) => setTimeout(resolve, 300));
      await displayTravauxModal();
      modal2.style.display = "none";
      document.getElementById("form-photo").reset();

      const previewImg = document.getElementById("displayedImage");
      if (previewImg) previewImg.style.display = "none";

      const icon = document.querySelector(".add-img");
      const label = document.querySelector("label.file");
      if (icon) icon.style.display = "block";
      if (label) label.style.display = "block";
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      alert("L'ajout a échoué. Vérifie ta connexion ou ton authentification.");
    }
  });
}
  });
  