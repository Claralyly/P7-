document.addEventListener('DOMContentLoaded', function() {

    function editionMode() {
        const body = document.querySelector("body");
        const editMode = document.createElement("div");
        editMode.innerHTML = `<span><i class="fa-regular fa-pen-to-square"></i></span><p>Mode Edition</p>`;
        body.prepend(editMode);
        editMode.classList.add("edit-mode");
    
        const logOut = document.getElementById("logout");
        logOut.innerHTML = "logout";
    
        const divModifier = document.querySelector(".modifier");
        divModifier.classList.add("btn-modifier")
        divModifier.innerHTML = `<i class="fa-regular fa-pen-to-square"></i><a>Modifier</a>`;
        
        
        divModifier.addEventListener("click", function (event) {
            event.preventDefault();
            // ajouter pour modal  
         const divmodal = document.querySelector(".modal");
            divmodal.style.display = "block";
    
            const closeButton = document.querySelector(".close i");
             // Ajoutez un gestionnaire d'événement au bouton de fermeture
             closeButton.addEventListener("click", () => {
                 divmodal.style.display = "none";
    
    
             });
            
        });   
        
        
    
       
         
         
    
    
        logOut.addEventListener("click", function (event) {
            event.preventDefault();
            window.localStorage.removeItem("token");
            const token = window.localStorage.getItem("token");
            console.log(token);
            alert("Vous êtes déconnecté.");
            window.location.href = "index.html";
        });
    }
    
    if (window.localStorage.getItem("token")) {
        editionMode();
    }
    
    });
    