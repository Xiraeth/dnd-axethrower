"use strict";

// const takeDmgBtn = document.querySelector(".");
// localStorage.clear();

const temp = document.querySelector(".tempHP span");
console.log(temp.textContent);
let tempHP = 0;

temp.addEventListener("input", (e) => {
  localStorage.setItem("tempHP", temp.textContent);
});

window.addEventListener("load", (e) => {
  tempHP = localStorage.getItem("tempHP");
  temp.textContent = localStorage.getItem("tempHP");
  console.log(tempHP);
});
