"use strict";

const longRestBtn = document.querySelector("#longRest");
const shortRestBtn = document.querySelector("#shortRest");

const AC = document.querySelector(".ac span");
const maxHP = document.querySelector(".maximumHP span");
const currentHP = document.querySelector(".currentHP span");
const tempHP = document.querySelector(".tempHP span");
const takeDmgInput = document.querySelector("#takeDamage");
const takeDmgSubmit = document.querySelector('form input[type="submit"]');
const extraAttacksHTML = document.querySelector(".extraAttacks i");
const amaniRageButton = document.querySelector(".amaniRage");
const amaniRegenSpanEl = document.querySelector(".amaniRegenHP span");
const remainingHealTicks = document.querySelector(".remainingHealTicks");
const addBerserkBtn = document.querySelector("#berserk");
const removeBerserkBtn = document.querySelector("#removeBerserk");
const berserkAttacksElement = document.querySelector(".berserkinContainer div");
// variable to keep track of how much beneath 1hp 'berserkin' took me
let revertHp = 0;
let hpOverflow = false;
let isRaging = false;

// localStorage.clear();

longRestBtn.addEventListener("click", function (e) {
  localStorage.setItem("extraAttacks", 0);
  localStorage.setItem("amaniRegen", 0);
  localStorage.setItem("currentHP", maxHP.textContent);
  localStorage.setItem("remainingHealTicks", 0);
  localStorage.setItem("isRaging", false);
  localStorage.setItem("AC", 19);

  isRaging = false;
  hpOverflow = false;
  revertHp = 0;
  berserkAttacksElement.textContent = 0;
  remainingHealTicks.textContent = 0;
  AC.textContent = localStorage.getItem("AC");
  currentHP.textContent = localStorage.getItem("currentHP");
  amaniRegenSpanEl.textContent = localStorage.getItem("amaniRegen");
  remainingHealTicks.textContent = localStorage.getItem("remainingHealTicks");

  checkForExtraAttacks();
});

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

  berserkAttacksElement.textContent = 0;
  currentHP.style.color = "white";

  if (berserkAttacksElement.textContent == 0)
    currentHP.textContent = Number(currentHP.textContent) + 18;
  else if (berserkAttacksElement.textContent == 1)
    currentHP.textContent = Number(currentHP.textContent) + 36;

  if (takeDmgInput.value == "") return;

  const damage = Number(takeDmgInput.value);
  const newHP = localStorage.getItem("currentHP") - damage;

  localStorage.setItem("currentHP", newHP);
  currentHP.textContent = localStorage.getItem("currentHP");

  checkForExtraAttacks();

  takeDmgInput.value = "";
});

amaniRageButton.addEventListener("click", function (e) {
  if (isRaging) return;

  const hp = Number(localStorage.getItem("currentHP"));
  const hpLost = Math.floor(hp / 2);
  const amaniRegenerationHP = Math.round(hpLost / 4);

  amaniRegenSpanEl.textContent = amaniRegenerationHP;
  localStorage.setItem("amaniRegen", amaniRegenerationHP);

  const newHP = hp - hpLost;
  currentHP.textContent = newHP;
  localStorage.setItem("currentHP", newHP);

  remainingHealTicks.textContent = 4;
  localStorage.setItem("remainingHealTicks", remainingHealTicks.textContent);

  checkForExtraAttacks();

  isRaging = true;
  localStorage.setItem("isRaging", true);
  AC.textContent = Number(AC.textContent) + 2;
  localStorage.setItem("AC", AC.textContent);
});

amaniRegenSpanEl.addEventListener("input", (e) => {
  localStorage.setItem("amaniRegen", Number(amaniRegenSpanEl.textContent));
});

addBerserkBtn.addEventListener("click", function (e) {
  if (berserkAttacksElement.textContent == 2) return;

  berserkAttacksElement.textContent++;

  if (currentHP.textContent == 1) return;

  currentHP.textContent = Number(currentHP.textContent) - 18;

  // Change text color
  if (berserkAttacksElement.textContent == 1) currentHP.style.color = "coral";
  else if (berserkAttacksElement.textContent == 2)
    currentHP.style.color = "red";

  if (currentHP.textContent <= 0) {
    revertHp = 18 - Math.abs(Number(currentHP.textContent)) - 1;
    currentHP.textContent = 1;
    hpOverflow = true;
  }
});

removeBerserkBtn.addEventListener("click", function (e) {
  if (berserkAttacksElement.textContent == 0) return;

  berserkAttacksElement.textContent--;

  // Revert text color
  if (berserkAttacksElement.textContent == 1 && currentHP.textContent == 1)
    currentHP.style.color = "white";
  else if (berserkAttacksElement.textContent == 1)
    currentHP.style.color = "coral";
  else if (berserkAttacksElement.textContent == 0)
    currentHP.style.color = "white";

  if (hpOverflow && berserkAttacksElement.textContent == 1) {
    currentHP.textContent = 1;
  } else if (hpOverflow && berserkAttacksElement.textContent == 0)
    currentHP.textContent = revertHp + 1;
  else currentHP.textContent = Number(currentHP.textContent) + 18;
});

window.addEventListener("load", () => {
  tempHP.textContent = localStorage.getItem("tempHP");
  maxHP.textContent = localStorage.getItem("maxHP");
  currentHP.textContent = localStorage.getItem("currentHP");
  amaniRegenSpanEl.textContent = localStorage.getItem("amaniRegen");
  remainingHealTicks.textContent = localStorage.getItem("remainingHealTicks");

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

function checkForRage(count) {
  if (count == 0) isRaging = false;
}
