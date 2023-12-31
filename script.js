"use strict";

const longRestBtn = document.querySelector("#longRest");
const shortRestBtn = document.querySelector("#shortRest");

const STRENGTH_MOD = 9;
const INITIAL_DAMAGE = 13;
const INITIAL_ARMOR_CLASS = 19;
const TROLL_BLOOD_REGEN = 10;

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
const attackButton = document.querySelector("#attackBtn");
const damageElement = document.querySelector("#damage");
const totalDamage = document.querySelector("#totalDamage span");
const endTurnButton = document.querySelector("#endTurn");
const grievousCount = document.querySelector("#grievousCount");
const grievousThrowBtn = document.querySelector(".grievousDamage");

// if amani rage is on
let isRaging = false;

// variable to keep track of hp changes when using berserk
const berserkPreviousHP = [];

// localStorage.clear();

longRestBtn.addEventListener("click", function (e) {
  localStorage.setItem("extraAttacks", 0);
  localStorage.setItem("amaniRegen", 0);
  localStorage.setItem("currentHP", maxHP.textContent);
  localStorage.setItem("remainingHealTicks", 0);
  localStorage.setItem("isRaging", false);
  localStorage.setItem("AC", 19);

  totalDamage.textContent = 0;
  grievousCount.textContent = 0;
  grievousCount.style.color = "coral";
  damageElement.textContent = 13;
  totalDamage.textContent = 0;
  isRaging = false;
  remainingHealTicks.style.display = "none";
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

  let previousHp = localStorage.getItem("currentHP");

  if (
    berserkAttacksElement.textContent == 1 ||
    berserkAttacksElement.textContent == 2
  )
    currentHP.textContent = previousHp;

  berserkAttacksElement.textContent = 0;
  currentHP.style.color = "white";

  if (takeDmgInput.value == "") return;

  const damage = Number(takeDmgInput.value);
  const newHP = localStorage.getItem("currentHP") - damage;

  if (newHP > localStorage.maxHP) {
    currentHP.textContent = localStorage.maxHP;
    localStorage.currentHP = localStorage.maxHP;
  } else {
    localStorage.setItem("currentHP", newHP);
    currentHP.textContent = Number(newHP);
  }

  if (damage < 0) flashColor(currentHP, "springgreen");
  else flashColor(currentHP, "crimson");

  checkForExtraAttacks();
  takeDmgInput.value = "";
});

amaniRageButton.addEventListener("click", function (e) {
  if (isRaging) return;

  remainingHealTicks.style.display = "block";

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

  if (berserkAttacksElement.textContent == 1) {
    // Update array to keep track of previous hp
    berserkPreviousHP[0] = Number(currentHP.textContent);
    // Change text color
    currentHP.style.color = "coral";
  } else if (berserkAttacksElement.textContent == 2) {
    berserkPreviousHP[1] = Number(currentHP.textContent);
    currentHP.style.color = "red";
  }

  // Increase damage by (strength modifier + 4) every time berserk is pressed
  damageElement.textContent =
    Number(damageElement.textContent) + STRENGTH_MOD + 4;

  if (currentHP.textContent == 1) return;

  currentHP.textContent = Number(currentHP.textContent) - 18;

  if (currentHP.textContent <= 0) {
    currentHP.textContent = 1;
  }
});

removeBerserkBtn.addEventListener("click", function (e) {
  if (berserkAttacksElement.textContent == 0) return;

  berserkAttacksElement.textContent--;

  // Revert text color
  if (berserkAttacksElement.textContent == 1) currentHP.style.color = "coral";
  else if (berserkAttacksElement.textContent == 0)
    currentHP.style.color = "white";

  if (berserkAttacksElement.textContent == 1)
    currentHP.textContent = berserkPreviousHP[1];
  else if (berserkAttacksElement.textContent == 0)
    currentHP.textContent = berserkPreviousHP[0];

  damageElement.textContent =
    Number(damageElement.textContent) - STRENGTH_MOD - 4;
});

attackButton.addEventListener("click", () => {
  totalDamage.textContent =
    Number(totalDamage.textContent) + Number(damageElement.textContent);
  berserkAttacksElement.textContent = 0;
  damageElement.textContent = INITIAL_DAMAGE;
  currentHP.style.color = "white";
  localStorage.currentHP = currentHP.textContent;
  grievousCount.textContent = Number(grievousCount.textContent) + 2;
  if (grievousCount.textContent >= 4) {
    grievousCount.textContent = 4;
    grievousCount.style.color = "mediumspringgreen";
  }
  localStorage.setItem("grievousCount", grievousCount.textContent);
  checkForExtraAttacks();
});

grievousThrowBtn.addEventListener("click", (e) => {
  totalDamage.textContent = Math.floor(
    Number(totalDamage.textContent) + (Number(totalDamage.textContent) * 1) / 2
  );
});

endTurnButton.addEventListener("click", () => {
  if (Number(remainingHealTicks.textContent) > 1) {
    currentHP.textContent =
      Number(currentHP.textContent) +
      TROLL_BLOOD_REGEN +
      Number(amaniRegenSpanEl.textContent);
    remainingHealTicks.textContent--;
  } else if (remainingHealTicks.textContent == 1) {
    currentHP.textContent =
      Number(currentHP.textContent) +
      TROLL_BLOOD_REGEN +
      Number(amaniRegenSpanEl.textContent);
    remainingHealTicks.style.display = "none";
    remainingHealTicks.textContent--;
    amaniRegenSpanEl.textContent = 0;
    localStorage.amaniRegen = 0;
    isRaging = false;
    localStorage.isRaging = false;
    AC.textContent = INITIAL_ARMOR_CLASS;
    localStorage.AC = INITIAL_ARMOR_CLASS;
  } else {
    currentHP.textContent = Number(currentHP.textContent) + TROLL_BLOOD_REGEN;
  }

  if (berserkAttacksElement.textContent != 0) {
    currentHP.textContent = berserkPreviousHP[0];
    berserkAttacksElement.textContent = 0;
  }

  damageElement.textContent = 13;
  localStorage.remainingHealTicks = Number(remainingHealTicks.textContent);

  if (Number(currentHP.textContent) >= Number(localStorage.maxHP))
    currentHP.textContent = localStorage.maxHP;

  totalDamage.textContent = 0;
  localStorage.currentHP = currentHP.textContent;
  flashColor(currentHP, "springgreen");

  checkForExtraAttacks();
});

window.addEventListener("load", () => {
  tempHP.textContent = localStorage.getItem("tempHP");
  maxHP.textContent = localStorage.getItem("maxHP");
  currentHP.textContent = localStorage.getItem("currentHP");
  amaniRegenSpanEl.textContent = localStorage.getItem("amaniRegen");
  remainingHealTicks.textContent = localStorage.getItem("remainingHealTicks");
  AC.textContent = localStorage.getItem("AC");
  isRaging = localStorage.getItem("isRaging") === "true";
  grievousCount.textContent = 0;

  if (remainingHealTicks.textContent <= 0) {
    remainingHealTicks.style.display = "none";
  }

  checkForExtraAttacks();
  extraAttacksHTML.textContent = localStorage.getItem("extraAttacks");
});

function checkForExtraAttacks() {
  const curr = localStorage.getItem("currentHP");
  const max = localStorage.getItem("maxHP");
  let extraAttacks = 0;

  if (curr < max && curr >= 0.75 * max) extraAttacks = 1;
  else if (curr < 0.75 * max && curr >= 0.5 * max) extraAttacks = 2;
  else if (curr < 0.5 * max && curr >= 0.25 * max) extraAttacks = 3;
  else if (curr < 0.25 * max) extraAttacks = 4;

  extraAttacksHTML.textContent = extraAttacks;
  if (extraAttacks != localStorage.extraAttacks)
    flashColor(extraAttacksHTML, "indigo");
  localStorage.setItem("extraAttacks", extraAttacks);
}

function checkForRage(count) {
  if (count == 0) isRaging = false;
}

function flashColor(element, color) {
  element.style.color = color;
  setTimeout(() => {
    element.style.color = "white";
  }, 300);
}
