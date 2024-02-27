let xp = 0;
let health = 100;
let credits = 50;
let currentWeapon = 0;
let fighting;
let enemyHealth;
let inventory = ["Staff"];

const button1 = document.querySelector('#button1');
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const creditsText = document.querySelector("#creditsText");
const enemyStats = document.querySelector("#enemyStats");
const enemyName = document.querySelector("#enemyName");
const enemyHealthText = document.querySelector("#enemyHealth");
const weapons = [
  { name: ' Staff', power: 5 },
  { name: ' Blaster Pistol', power: 30 },
  { name: ' Bowcaster', power: 50 },
  { name: ' Lightsaber', power: 100 }
];
const enemies = [
  {
    name: "Tusken Raider",
    level: 2,
    health: 15
  },
  {
    name: "Rancor",
    level: 8,
    health: 60
  },
  {
    name: "Darth Vader",
    level: 20,
    health: 300
  }
]
const locations = [
  {
    name: "marketplace",
    "button text": ["Visit Equipment Dealer", "Explore Desert Caves", "Fight Vader"],
    "button functions": [goDealer, goCave, fightVader],
    text: "You are in the marketplace. You see a sign that says \"Equipment Dealer\"."
  },
  {
    name: "dealer",
    "button text": ["Buy 10 health (10 credits)", "Buy weapon (30 credits)", "Go to marketplace"],
    "button functions": [buyHealth, buyWeapon, goMarket],
    text: "You enter the Equipment Dealer Shop."
  },
  {
    name: "cave",
    "button text": ["Fight Tusken Raider", "Fight Rancor", "Go to marketplace"],
    "button functions": [fightRaider, fightRancor, goMarket],
    text: "You enter the cave. You see some enemies."
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goMarket],
    text: "You are fighting an enemy."
  },
  {
    name: "kill enemy",
    "button text": ["Go to marketplace", "Go to marketplace", "Go to marketplace"],
    "button functions": [goMarket, goMarket, easterEgg],
    text: 'The enemy screams "Arg!" as it dies. You gain experience points and find credits.'
  },
  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You die. &#x2620;"
  },
  { 
    name: "win", 
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"], 
    "button functions": [restart, restart, restart], 
    text: "You defeat Darth Vader! YOU WIN THE GAME! &#x1F389;" 
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Go to marketplace?"],
    "button functions": [pickTwo, pickEight, goMarket],
    text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!"
  }
];

// initialize buttons
button1.onclick = goDealer;
button2.onclick = goCave;
button3.onclick = fightVader;

function update(location) {
  enemyStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerHTML = location.text;
}

function goMarket() {
  update(locations[0]);
}

function goDealer() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (credits >= 10) {
    credits -= 10;
    health += 10;
    creditsText.innerText = credits;
    healthText.innerText = health;
  } else {
    text.innerText = "You do not have enough credits to buy health.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (credits >= 30) {
      credits -= 30;
      currentWeapon++;
      creditsText.innerText = credits;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " In your inventory you have: " + inventory;
    } else {
      text.innerText = "You do not have enough credits to buy a weapon.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 credits";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    credits += 15;
    creditsText.innerText = credits;
    let currentWeapon = inventory.shift();
    text.innerText = "You sold a " + currentWeapon + ".";
    text.innerText += " In your inventory you have: " + inventory;
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
}

function fightRaider() {
  fighting = 0;
  goFight();
}

function fightRancor() {
  fighting = 1;
  goFight();
}

function fightVader() {
  fighting = 2;
  goFight();
}

function goFight() {
  update(locations[3]);
  enemyHealth = enemies[fighting].health;
  enemyStats.style.display = "block";
  enemyName.innerText = enemies[fighting].name;
  enemyHealthText.innerText = enemyHealth;
}

function attack() {
  text.innerText = "The " + enemies[fighting].name + " attacks.";
  text.innerText += " You attack it with your " + weapons[currentWeapon].name + ".";
  health -= getenemyAttackValue(enemies[fighting].level);
  if (isenemyHit()) {
    enemyHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;    
  } else {
    text.innerText += " You miss.";
  }
  healthText.innerText = health;
  enemyHealthText.innerText = enemyHealth;
  if (health <= 0) {
    lose();
  } else if (enemyHealth <= 0) {
    if (fighting === 2) {
      winGame();
    } else {
      defeatenemy();
    }
  }
  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += " Your " + inventory.pop() + " breaks.";
    currentWeapon--;
  }
}

function getenemyAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  console.log(hit);
  return hit > 0 ? hit : 0;
}

function isenemyHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "You dodge the attack from the " + enemies[fighting].name;
}

function defeatenemy() {
  credits += Math.floor(enemies[fighting].level * 6.7);
  xp += enemies[fighting].level;
  creditsText.innerText = credits;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  credits = 50;
  currentWeapon = 0;
  inventory = ["stick"];
  creditsText.innerText = credits;
  healthText.innerText = health;
  xpText.innerText = xp;
  goMarket();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Right! You win 20 credits!";
    credits += 20;
    creditsText.innerText = credits;
  } else {
    text.innerText += "Wrong! You lose 10 health!";
    health -= 10;
    healthText.innerText = health;
    if (health <= 0) {
      lose();
    }
  }
}