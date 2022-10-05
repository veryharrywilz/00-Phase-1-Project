document.addEventListener('DOMContentLoaded', () => {
    encounterImage.src = "https://static.3dbaza.com/original_models/258923/7282411cc7fb4d55bfffe03a.jpg"
    encounterName.textContent = "SELECT YOUR CHARACTER"
    characterSelector()
})

// global variables
let encounterImage = document.getElementById("image")
let storyText = document.getElementById("story-text")
let storyHeadline = document.getElementById('story-headline')
let encounterName = document.getElementById('encounter')
let battleText = document.createElement('p')
let characterBar = document.getElementById('storyBook')
storyHeadline.append(battleText)  //Used to desribe what's 'happening' in a battle. Set to "" after every fight
let nextButtonToMountain = document.createElement('button')
    nextButtonToMountain.textContent = "NEXT"
    nextButtonToMountain.addEventListener('click', () => {
        mountainHubWorld()
        nextButtonToMountain.remove()
    });

//PLAYER VARIABLES
//These will change when character creator fetch method is programmed
let strength = 0
let dexterity = 0
let charisma = 0
let wisdom = 0
let playerHP = 0
let playerID = 0
let characterClass = ""
let fightCounter = 0 //keeps track of the number of fights before the final boss can be available

//PLAYER STAT HTML ELEMENTS
let displayClass = document.getElementById('class')
let displayHealth = document.getElementById('health')
let displayAttack = document.getElementById('attackMod')
let displaySneak = document.getElementById('dexMod')
let displayCharm = document.getElementById('charMod')
let displayRun = document.getElementById('runMod')
let displayWisdom = document.getElementById('wisMod')

//MONSTER VARIABLES
let monsterHealth = 0;
let monsterArmor = 0;
let monsterPerception = 0;
let monsterCharmResistance = 0;
let monsterStrength = 0;

//ACTION BUTTONS
//DEFINE SNEAK BUTTON
let sneakButton = document.createElement('button')
sneakButton.className = 'combat-buttons'
sneakButton.textContent = "Sneak"
function sneakByMonster() {
    sneakButton.addEventListener('click', e => {
        let sneakCheck = rollDice(20, dexterity)
        //console.log(sneakCheck)
            if (sneakCheck >= monsterPerception) {
                battleText.textContent = "You snuck away!"
                storyHeadline.append(nextButtonToMountain)
                removeButtons()
                return sneakCheck
        } 
            else if (sneakCheck < monsterPerception) {
                playerHP -= 5
                battleText.textContent = `The monster spotted you before you got away. He takes a swing at you, and you took 5 damage! Your current health is ${playerHP}`
                if (playerHP <= 0) {
                    removeButtons()
                    gameOver()
            }
        }
    }
)}

//DEFINE ATTACK BUTTON
let attackButton = document.createElement('button')
attackButton.className = 'combat-buttons'
attackButton.textContent = "Attack"
function attackMonster() {
    attackButton.addEventListener('click', e => {
        let attackCheck = rollDice(20, strength)
        if (attackCheck >= monsterArmor) {
            let damage = rollDice(8, strength)
            console.log(damage)
            monsterHealth = monsterHealth - damage
            console.log(monsterHealth)
            //console.log(monsterHealth)
            battleText.textContent = `You dealt ${damage} damage to the monster. It has ${monsterHealth} hit points left!`
            if (monsterHealth <= 0) {
                removeButtons()
                mountainHubWorld()
            }
        } else if (attackCheck < monsterArmor) {
            let monsterAttack = rollDice(8, 5)
            playerHP = playerHP - monsterAttack
            console.log(playerHP)
            battleText.textContent = `Your attack missed! The monster counter attacks and deals ${monsterAttack} damage to you. You have ${playerHP} hit points left!`
            if (playerHP <= 0) {
                removeButtons()
                gameOver()
            }
        }
    }
)}

//DEFINE CHARM BUTTON
let charmButton = document.createElement('button')
charmButton.className = 'combat-buttons'
charmButton.textContent = "Charm"
function charmMonster() {
    charmButton.addEventListener('click', e => {
        let charmCheck = rollDice(20, charisma)
        //console.log(charmCheck)
        if (charmCheck >= monsterCharmResistance) {
            battleText.textContent = "The monster was seduced by you. Congrats. You have a monster lover now, you weirdo."
            storyHeadline.append(nextButtonToMountain)
            removeButtons()
        } else if (charmCheck < monsterCharmResistance) {
            playerHP -=5
            battleText.textContent = `The monster was confused by your advances, and smacks you with a club. You take 5 damage! Your current health is ${playerHP}`
            if (playerHP <= 0) {
                removeButtons()
                gameOver()
            }
        }
    })
}

//DEFINE RUN BUTTON
let runButton = document.createElement('button')
runButton.className = 'combat-buttons'
runButton.textContent = 'Run'
function runFromMonster(){
    runButton.addEventListener('click', e => {
    let runCheck = rollDice(20, strength)
        if (runCheck >= monsterStrength) {
            battleText.textContent = "You ran under the monster's legs, and make a beeline for the exit!"
            storyHeadline.append(nextButtonToMountain)
            removeButtons()
        } else if (runCheck < monsterStrength) {
            playerHP -= 5
            //console.log(playerHP)
            battleText.textContent = `You tried to bolt around the monster, but he took a swing at you and hits you for 5 damage. Your current health is ${playerHP}`
            if (playerHP <= 0) {
                removeButtons()
                gameOver()
            }
        }
    }
)}

//MAKE YOUR CHARACTER (uncomment with db.json)
function characterSelector() { 
    // Create confirm button to lock in character stats
    let confirmCharacterButton = document.createElement('button')
    confirmCharacterButton.addEventListener('click', e => {
        tavernStart()
        displayClass.textContent = `Class: ${characterClass}`
        displayHealth.textContent = `Health: ${playerHP}`
        displayAttack.textContent = `Attack Modifier: ${strength}`
        displaySneak.textContent = `Sneak Modifier: ${dexterity}`
        displayCharm.textContent = `Charm Modifier: ${charisma}`
        displayRun.textContent = `Run Modifier: ${strength}`
        displayWisdom.textContent = `Wisdom Modifier: ${wisdom}`
        confirmCharacterButton.remove()
        removeSpan()
    })
    confirmCharacterButton.textContent = "CONFIRM"
    storyHeadline.append(confirmCharacterButton)

    //Fetch possible Player Character stats
    fetch('http://localhost:3000/classes')
    .then(resp => resp.json())
    .then(data => {
        data.forEach(character => {
            let characterCard = document.createElement('span')
            characterCard.className = 'character-card'
            characterCard.textContent = character.name
            characterBar.append(characterCard)
            characterCard.addEventListener('click', e => {
                encounterImage.src = character.image
                encounterName.textContent = `Character Class: ${character.name}`
                storyText.innerHTML = `
                <p>${character.info}</p>
                <p>Strength Modifier: ${character.str}</p>
                <p>Dexterity Modifier: ${character.dex}</p>
                <p>Wisdom Modifier: ${character.wisdom}</p>
                <p>Charisma Modifier: ${character.char}</p>
                <p>Health Total: ${character.health}</p>`
                characterClass = character.name
                playerID = character.id
                strength = character.str
                dexterity = character.dex
                charisma = character.char
                wisdom = character.wisdom
                playerHP = character.health
                })
            })
          }
          )
        }


//HELPER FUNCTIONS
function rollDice(diceType, checkType) {
    let roll = Math.ceil(Math.random() * diceType) //conceptually think about dice!
    let result = roll + checkType
    return result
}

function gameOver() {
    storyText.textContent = "refresh the page to start again!"
    encounterImage.src = "https://assets.reedpopcdn.com/five-of-the-best-game-over-screens-1590748640300.jpg/BROK/thumbnail/1600x900/format/jpg/quality/80/five-of-the-best-game-over-screens-1590748640300.jpg"
}

function removeButtons() {
    let combatButton = document.querySelectorAll('.combat-buttons')
    for (const button of combatButton) {
        button.remove()
    }
}

function removeMonsterButtons() {
    let monsterButtons = document.querySelectorAll('.monster-buttons')
    for (const button of monsterButtons) {
        button.remove()
    }
}

function removeSpan() {
    let removeTopMenu = document.querySelectorAll('.character-card')
    for(let classCategory of removeTopMenu) {
        classCategory.remove()
    }
}

//LOCATIONS

//FIRST LOCATION: TAVERN
function tavernStart() {
    let startingImage = "https://i0.wp.com/www.hipstersanddragons.com/wp-content/uploads/2019/08/dnd-adventures-tavern.jpg?fit=1200%2C648&ssl=1"
    encounterImage.src = startingImage
    encounterName.textContent = "It's a dark and stormy night..."
    storyText.innerHTML = "You find yourself in a tavern. It's grimy, smells of ale, and the floor is sticky from years of uncleaned spills. A man approaches you and asks you to slay a dragon that lives in the mountain. Will you accept?"
    let yesButton = document.createElement('button')
    yesButton.textContent = 'yes'
    let noButton = document.createElement('button')
    noButton.textContent = 'no'
    storyHeadline.append(yesButton)
    storyHeadline.append(noButton)
    yesButton.addEventListener('click', (e) => {
        e.preventDefault()
        yesButton.remove()
        noButton.remove()
        trollFight()
    })
    noButton.addEventListener('click', (e) => {
        e.preventDefault()
        yesButton.remove()
        noButton.remove()
        gameOver()
    })
}

//TRANSITION LOCATION: After each fight, the user returns to this page
function mountainHubWorld() {
    battleText.textContent = ""
    fightCounter+= 1
    //console.log(fightCounter)
    if (fightCounter === 1) {
        let nextButton = document.createElement('button')
        nextButton.textContent = "NEXT"
        nextButton.addEventListener('click', () => {
            clownFight()
            nextButton.remove()
        })
        storyHeadline.append(nextButton)
    } else if (fightCounter === 2) {
        let nextButton = document.createElement('button')
        nextButton.textContent = "NEXT"
        nextButton.addEventListener('click', () => {
            owlBearFight()
            nextButton.remove()
        })
        storyHeadline.append(nextButton)
    } else if (fightCounter === 3) {
        let nextButton = document.createElement('button')
        nextButton.textContent = "NEXT"
        nextButton.addEventListener('click', () => {
            travelToFinalBoss()
            nextButton.remove()
        })
        storyHeadline.append(nextButton)
    }
    encounterName.textContent = "You defeated that monster"
    storyText.textContent = "Your HP has been restored after a moment of rest. Move on to your next combatant:"
    encounterImage.src = "https://static.wikia.nocookie.net/emerald-isles/images/a/a7/Mountain_Travel.jpg/revision/latest?cb=20180209151032"
    battleText.textContent = ""
    fetch("http://localhost:3000/classes") // must edit to reset health for each character 
    .then(resp => resp.json())
    .then(data => {
        playerHP = data[playerID - 1].health
    })
}

//MONSTER FIGHTS

// 1: TROLL FIGHT
function trollFight() {
    encounterImage.src = "https://qph.cf2.quoracdn.net/main-qimg-bcc2229353e9b73ae49393f8d92b8470-lq"
    storyText.textContent = "On your route to the mountain, you must cross a river. You must first cross a bridge, guarded by a troll. What will you do to get around the troll?"
    encounterName.textContent = "A TROLL ON THE BRIDGE"
    monsterHealth = 30
    monsterArmor = 17 // User must roll a number higher than 17
    monsterPerception = 13
    monsterCharmResistance = 16
    monsterStrength = 18
    //Sneak Option
    sneakByMonster();
    storyHeadline.append(sneakButton)
    // Attack option
    attackMonster();
    storyHeadline.append(attackButton)
    // Charm option
    charmMonster()
    storyHeadline.append(charmButton)
    //Run option
    runFromMonster()
    storyHeadline.append(runButton)
}

// 2: CLOWN FIGHT
function clownFight() {
    encounterImage.src = "https://m.media-amazon.com/images/M/MV5BMWFkY2MzMGUtMmMxYS00ZWU2LWE0NjMtYTcxNTNlYjIyODdjXkEyXkFqcGdeQXRzdGFzaWVr._V1_QL75_UX500_CR0,6,500,281_.jpg"
    storyText.textContent = "Oh no, there's a freaky clown blocking your path. What are you going to do?"
    encounterName.textContent = "A KILLER CELESTIAL CLOWN BLOCKS YOUR PATH"
    monsterHealth = 20
    monsterArmor = 10
    monsterPerception = 17
    monsterCharmResistance = 17
    monsterStrength = 13
    console.log(monsterHealth)
    //Sneak Option
    storyHeadline.append(sneakButton)
    // Attack option
    storyHeadline.append(attackButton)
    // Charm option
    storyHeadline.append(charmButton)
    //Run option
    storyHeadline.append(runButton)
}

// 3: SLEEPY GUY FIGHT
function owlBearFight() {
    encounterImage.src = "https://i.pinimg.com/originals/37/d8/54/37d854318335b618b238510631d65890.jpg"
    storyText.textContent = 'When venturing toward the mountain, you encounter a hungry Owl Bear! It stares you down, and after a tense moment, it charges you. What will you do?'
    encounterName.textContent = "AN OWL BEAR APPEARS"
    monsterHealth = 30
    monsterArmor = 16
    monsterPerception = 16
    monsterCharmResistance = 12
    monsterStrength = 19
    console.log(monsterHealth)
    //Sneak Option
    storyHeadline.append(sneakButton)
    // Attack option
    storyHeadline.append(attackButton)
    // Charm option
    storyHeadline.append(charmButton)
    //Run option
    storyHeadline.append(runButton)
}

// 7: FINAL BOSS FIGHT
function travelToFinalBoss() {
    encounterImage.src = "https://static.scientificamerican.com/blogs/cache/file/9C720750-2370-44E1-ACE260270EB7EA75_source.jpg?w=590&h=800&FAECB764-BEBE-4D3D-A7705363D7C3BF12"
    storyText.textContent = "RAWR XD"
    encounterName.textContent = "A big ol dragon gonna eat your face"
    monsterHealth = 55
    monsterArmor = 19
    monsterPerception = 23
    monsterCharmResistance = 23
    monsterStrength = 23
    console.log(monsterHealth)
    //Sneak Option
    storyHeadline.append(sneakButton)
    // Attack option
    storyHeadline.append(attackButton)
    // Charm option
    storyHeadline.append(charmButton)
    //Run option
    storyHeadline.append(runButton)
}

// NEXT STEPS
// USER BUTTONS
    // make Event Listeners global (four in total: attack, sneak, charm, run)
// DECIDE: MONSTER OBJECTS 
    // One troll object
        // a transition page for location
    // One yeti object
        // a transition page for location
    // One loch ness object
        // a transition page for location
    // one owl bear object
        // a transition page for location
    // one dragon object