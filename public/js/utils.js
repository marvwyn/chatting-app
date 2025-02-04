export function validateEmail(email){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
export function showErr(error, input = false) {
    if (error) error.style.display = "block";
    if (input) input.style.borderBottom = "1px solid red";
};
  
export function removeErr(error, input = false) {
    if (error) error.style.display = "none";
    if (input) input.style.borderBottom = "";
};
const toast_presets = {
    danger: {
      logo: "https://api.iconify.design/eva/alert-circle-fill.svg?color=%23ef4c61",
      background: "#fdedee",
    },
    warning: {
      logo: "https://api.iconify.design/eva/alert-circle-fill.svg?color=%23ffc02f",
      background: "#fff9e9",
    },
    success: {
      logo: "https://api.iconify.design/clarity/success-standard-solid.svg?color=%2332d49d",
      background: "#ebfbf6",
    },
    info: {
      logo: "https://api.iconify.design/eva/info-fill.svg?color=%2301d0ea",
      background: "#ebfbf6",
    },
  };
  function removeElement(id) {
    let element = document.getElementById(id);
    element.classList.remove("toast-fade-in");
    element.classList.add("toast-fade-out");
    element.addEventListener("animationend", () => {
      element.style.display = "none";
      element.remove();
    });
  }
  
  export function Toast(type, text) {
    const parent = document.querySelector(".toast-wrapper");
    let element = document.createElement("div");
    if (parent.childElementCount > 1) {
      parent.firstChild.remove();
    }
    element.classList.add("toast");
    element.classList.add("toast-fade-in");
    element.id = `toast_${Math.random().toString(16).slice(2)}`;
    element.innerHTML = create_toast(type, text);
    parent.prepend(element);
    element.style.backgroundColor = toast_presets[type].background;
    setTimeout(() => {
      removeElement(element.id);
    }, 4000);
  }
  
  function create_toast(type, text) {
    let element = `
              <img src="${toast_presets[type].logo}" alt="toast icon"/>
          <div class="text">
              <p>${text}</p>
          </div>`;
    return element;
  }
  export function isLoggedIn(req, res, next) {
    if (req.session.userId) {
      next();
    } else {
      res.redirect('/signin');
    }
  }