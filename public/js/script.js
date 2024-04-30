
(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  });

  //Index.js : Making Tax Switch
  let taxSwitch = document.getElementById("flexSwitchCheckDefault");

  taxSwitch.addEventListener("click",()=>{
     let taxInfo = document.getElementsByClassName("tax-info");
     for( info of taxInfo){
         if(info.style.display!="inline"){
           info.style.display = "inline";
         }
         else{
           info.style.display = "none";
         }
     }
  });

document.addEventListener("DOMContentLoaded", function () {
    const leftArrow = document.querySelector(".left-arrow");
    const rightArrow = document.querySelector(".right-arrow");
    const filterContainer = document.querySelector(".filter-container");

    leftArrow.addEventListener("click", function () {
      filterContainer.scrollBy({
        left: -200, // Adjust as needed
        behavior: "smooth",
      });
    });

    rightArrow.addEventListener("click", function () {
      filterContainer.scrollBy({
        left: 200, // Adjust as needed
        behavior: "smooth",
      });
    });
});

// Navbar 
const hamMenu = document.querySelector("#toggleChecker");
  const profileMenu = document.querySelector(".nav-profile");

  hamMenu.addEventListener("click", () => {
    if (profileMenu.style.visibility != "visible") {
      profileMenu.style.visibility = "visible";
      profileMenu.style.opacity = 1;
    } else {
      profileMenu.style.visibility = "hidden";
      profileMenu.style.opacity = 0;
    }
  });