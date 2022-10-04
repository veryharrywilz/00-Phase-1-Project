// global variables
let encounterImage = document.getElementById("image")
let storyText = document.getElementById("story-text")
let storyHeadline = document.getElementById('story-headline')
let encounterName = document.getElementById('encounter')
let battleText = document.createElement('p')
storyHeadline.append(battleText)  //Used to desribe what's 'happening' in a battle. Set to "" after every fight

//PLAYER VARIABLES
//These will change when character creator fetch method is programmed
let strength = 5
let dexterity = 3
let charisma = -1
let wisdom = 1
let playerHP = 20
let fightCounter = 0 //keeps track of the number of fights before the final boss can be available

//MONSTER VARIABLES
let monsterHealth = 0;
let monsterArmor = 0;
let monsterPerception = 0;
let monsterCharmResistance = 0;
let monsterStrength = 0;

//DEFINE SNEAK BUTTON
let sneakButton = document.createElement('button')
sneakButton.className = 'combat-buttons'
sneakButton.textContent = "Sneak"
function sneakByMonster() {
    sneakButton.addEventListener('click', e => {
        let sneakCheck = rollDice(20, dexterity)
        console.log(sneakCheck)
            if (sneakCheck >= monsterPerception) {
                battleText.textContent = "You snuck away!"
                // edit? create Element?
                let nextButton = document.createElement('button')
                nextButton.textContent = "NEXT"
                nextButton.addEventListener('click', () => {
                    mountainHubWorld()
                    nextButton.remove()
                })
                storyHeadline.append(nextButton)
                removeButtons()
                return sneakCheck
        } 
            else if (sneakCheck < monsterPerception) {
                playerHP -= 5
                battleText.textContent = `The troll spotted you before you got away. He takes a swing at you, and you took 5 damage! Your current health is ${playerHP}`
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
            monsterHealth -= damage
            console.log(monsterHealth)
            battleText.textContent = `You dealt ${damage} damage to the troll. It has ${monsterHealth} hit points left!`
            if (monsterHealth <= 0) {
                removeButtons()
                mountainHubWorld()
            }
        } else if (attackCheck < monsterArmor) {
            let trollAttack = rollDice(8, 5)
            playerHP -= trollAttack
            battleText.textContent = `Your attack missed! The troll counter attacks and deals ${trollAttack} damage to you. You have ${playerHP} hit points left!`
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
        if (charmCheck >= monsterCharmResistance) {
            battleText.textContent = "The monster was seduced by you. Congrats. You have a monster lover now, you weirdo."
            let nextButton = document.createElement('button')
            nextButton.textContent = "NEXT"
            nextButton.addEventListener('click', () => {
                nextButton.remove()
                mountainHubWorld()
            })
            storyHeadline.append(nextButton)
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
            battleText.textContent = "You ran under the troll's legs, and make a beeline for the mountain!"
            let nextButton = document.createElement('button')
            nextButton.textContent = "NEXT"
            storyHeadline.append(nextButton)
            nextButton.addEventListener('click', () => {
                nextButton.remove()
                mountainHubWorld()
            })
            removeButtons()
        } else if (runCheck < monsterStrength) {
            playerHP -= 5
            console.log(playerHP)
            battleText.textContent = `You tried to bolt around the monster, but he took a swing at you and hits you for 5 damage. Your current health is ${playerHP}`
            if (playerHP <= 0) {
                removeButtons()
                gameOver()
            }
        }
    }
)}


function rollDice(diceType, checkType) {
    let roll = Math.floor(Math.random() * diceType)
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
// remove each button at the end of each event listener



//Starting Location
document.addEventListener('DOMContentLoaded', () => {
    tavernStart()
})

function tavernStart() {
    let startingImage = "https://i0.wp.com/www.hipstersanddragons.com/wp-content/uploads/2019/08/dnd-adventures-tavern.jpg?fit=1200%2C648&ssl=1"
    encounterImage.src = startingImage
    encounterName.textContent = "It's a dark and stormy night..."
    storyText.textContent = "You find yourself in a tavern. It's grimy, smells of ale, and the floor is sticky from years of uncleaned spills. A man approaches you and asks you to slay a dragon that lives in the mountain. Will you accept?"
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


function mountainHubWorld() {
    battleText.textContent = ""
    fightCounter += 1
    console.log(fightCounter)
    if (fightCounter > 3) {
        let finalBossButton = document.createElement('button')
        finalBossButton.textContent = "FINAL BOSS"
        finalBossButton.addEventListener('click', travelToFinalBoss())
        storyHeadline.append(finalBossButton)
    }
    encounterName.textContent = "You defeated that monster"
    storyText.textContent = "It was a hard fought battle, but you emerged victorious, and now it's time to press on! Your HP has been restored after a moment of rest. Select your next combatant:"
    encounterImage.src = "https://static.wikia.nocookie.net/emerald-isles/images/a/a7/Mountain_Travel.jpg/revision/latest?cb=20180209151032"
    battleText.textContent = ""
    playerHP = 20;
    //CLOWN FIGHT
    let clownFightButton = document.createElement('button')
    clownFightButton.textContent = "CLOWN"
    clownFightButton.className = 'monster-buttons'
    clownFightButton.addEventListener('click', e => {
        removeMonsterButtons()
        clownFight()
    })
    storyHeadline.append(clownFightButton)
    //A SLEEPY GUY FIGHT
    let sleepyGuyButton = document.createElement('button')
    sleepyGuyButton.textContent = "A SLEEPY GUY"
    sleepyGuyButton.className = 'monster-buttons'
    sleepyGuyButton.addEventListener('click', e => {
        removeMonsterButtons()
        sleepyGuyFight()
    })
    storyHeadline.append(sleepyGuyButton)
    //REMOVER MONSTER BUTTONS AFTER CLICK


}
function removeMonsterButtons() {
    let monsterButtons = document.querySelectorAll('.monster-buttons')
    for (const button of monsterButtons) {
        button.remove()
    }}

function trollFight() {
    encounterImage.src = "https://i.ytimg.com/vi/OAvwVzODByQ/hqdefault.jpg"
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

function clownFight() {
    encounterImage.src = "https://m.media-amazon.com/images/M/MV5BMWFkY2MzMGUtMmMxYS00ZWU2LWE0NjMtYTcxNTNlYjIyODdjXkEyXkFqcGdeQXRzdGFzaWVr._V1_QL75_UX500_CR0,6,500,281_.jpg"
    storyText.textContent = "Oh no, there's a freaky clown blocking your path. What are you going to do?"
    encounterName.textContent = "CLOWN IN YOUR FACE"
    monsterHealth = 15
    monsterArmor = 10
    monsterPerception = 17
    monsterCharmResistance = 17
    monsterStrength = 13
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

function sleepyGuyFight() {
    encounterImage.src = "https://cdn.mos.cms.futurecdn.net/YMzrA4GXpKFdn8Ez2GH2JX.jpg"
    storyText.textContent = 'A man is asleep in his bed. He looks at you with a look of horror. "What did I do wrong?" he asks'
    encounterName.textContent = "WHO'S THE REAL BAD GUY HERE?"
    monsterHealth = 1
    monsterArmor = 1
    monsterPerception = 1
    monsterCharmResistance = 1
    monsterStrength = 1
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

function travelToFinalBoss() {
    encounterImage.src = "https://static.scientificamerican.com/blogs/cache/file/9C720750-2370-44E1-ACE260270EB7EA75_source.jpg?w=590&h=800&FAECB764-BEBE-4D3D-A7705363D7C3BF12"
    storyText.textContent = "A big ol dragon gonna eat your face"
    encounterName.textContent = "rawrXD"
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