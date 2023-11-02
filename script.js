"use strict";

const AC = document.querySelector(".ac span");
const maxHP = document.querySelector(".maximumHP span");
const currentHP = document.querySelector(".currentHP span");
const tempHP = document.querySelector(".tempHP span");
const takeDmgInput = document.querySelector("#takeDamage");
const takeDmgSubmit = document.querySelector('form input[type="submit"]');
const extraAttacksHTML = document.querySelector(".extraAttacks i");
const amaniRageButton = document.querySelector(".amaniRage");
const amaniRegenSpanEl = document.querySelector(".amaniRegenHP span");

// localStorage.clear();

maxHP.addEventListener("input", () => {
  localStorage.setItem("maxHP", Number(maxHP.textContent));
});

currentHP.addEventListener("input", () => {
  localStorage.setItem("currentHP", Number(currentHP.textContent));
  checkForExtraAttacks();
});

tempHP.addEventListener("input", () => {
  localStorage.setItem("tempHP", Number(tempHP.textContent));
});

takeDmgSubmit.addEventListener("click", function (e) {
  e.preventDefault();
  if (takeDmgInput.value == "") return;

  const damage = Number(takeDmgInput.value);
  const newHP = localStorage.getItem("currentHP") - damage;

  localStorage.setItem("currentHP", newHP);
  currentHP.textContent = localStorage.getItem("currentHP");

  checkForExtraAttacks();

  takeDmgInput.value = "";
});

amaniRageButton.addEventListener("click", function (e) {
  const hp = Number(localStorage.getItem("currentHP"));
  const hpLost = Math.floor(hp / 2);
  const amaniRegenerationHP = Math.round(hpLost / 4);

  amaniRegenSpanEl.textContent = amaniRegenerationHP;
  localStorage.setItem("amaniRegen", amaniRegenerationHP);

  const newHP = hp - hpLost;
  currentHP.textContent = newHP;
  localStorage.setItem("currentHP", newHP);
});

amaniRegenSpanEl.addEventListener("input", (e) => {
  localStorage.setItem("amaniRegen", Number(amaniRegenSpanEl.textContent));
});

window.addEventListener("load", () => {
  tempHP.textContent = localStorage.getItem("tempHP");
  maxHP.textContent = localStorage.getItem("maxHP");
  currentHP.textContent = localStorage.getItem("currentHP");
  amaniRegenSpanEl.textContent = localStorage.getItem("amaniRegen");

  checkForExtraAttacks();
  extraAttacksHTML.textContent = localStorage.getItem("extraAttacks");
});

function checkForExtraAttacks() {
  const curr = localStorage.getItem("currentHP");
  const max = localStorage.getItem("maxHP");
  let extraAttacks = 0;

  if (curr > 0.75 * max) extraAttacks = 0;
  else if (curr <= 0.75 * max && curr > 0.5 * max) extraAttacks = 1;
  else if (curr <= 0.5 * max && curr > 1) extraAttacks = 2;
  else if (curr == 1) extraAttacks = 3;

  extraAttacksHTML.textContent = extraAttacks;
  localStorage.setItem("extraAttacks", extraAttacks);
}

function amaniRegen(hp) {
  let i = 4;
}
