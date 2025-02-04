"use strict";

import { validateEmail, showErr, removeErr } from './utils.js';

(() => {
  let parent = document.createElement("div");
  parent.classList.add("toast-wrapper");
  document.body.appendChild(parent);
})();

const show_btn = document.querySelector(".show-password-btn");
const hide_btn = document.querySelector(".hide-password-btn");
const sendbtn = document.getElementById("sign-in");
const loader = document.querySelector(".loader-js");
const email_el = document.getElementById("email");
const password_el = document.getElementById("password");
const password_err = document.querySelector(".password-err");
const email_err = document.querySelector(".email-err");
const common_err = document.querySelector(".common-err");
const disable_err = document.querySelector(".disable-err");

(() => {
  window.addEventListener("load", function () {
    var viewportHeight = window.innerHeight;
    document.querySelector(".resizer-js").style.height = viewportHeight + "px";
  });
})();

show_btn.addEventListener("click", (e) => {
  show_btn.style.display = "none";
  hide_btn.style.display = "block";
  password_el.type = "text";
});
hide_btn.addEventListener("click", () => {
  hide_btn.style.display = "none";
  show_btn.style.display = "block";
  password_el.type = "password";
});

sendbtn.addEventListener("click", async (e) => {
  e.preventDefault();
  removeErr(password_err, password_el);
  removeErr(email_err, email_el);

  const email = email_el.value;
  const password = password_el.value;
  let error_flag = false;

  if (!validateEmail(email)) {
    showErr(email_err, email_el);
    error_flag = true;
  }
  if (!password || password.length < 8) {
    showErr(password_err, password_el);
    error_flag = true;
  }
  if (error_flag) return;

  loader.style.display = "flex";
  sendbtn.style.display = "none";

  try {
    const response = await fetch('signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.redirect) {
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("email", email);
  
      window.location.href = data.redirect;
    } else {
      alert("Login failed: " + (data.message || "Unknown error"));
    }
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred while signing in.');
    sendbtn.style.display = "block";
    loader.style.display = "none";
  }
});

email_el.addEventListener("input", () => {
  removeErr(email_err, email_el);
  removeErr(common_err);
  removeErr(disable_err);
});
password_el.addEventListener("input", () => {
  removeErr(password_err, password_el);
  removeErr(common_err);
});
