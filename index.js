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
battleText.className = "battle-text"
let characterBar = document.getElementById('storyBook')
storyHeadline.append(battleText)  //Used to desribe what's 'happening' in a battle. Set to "" after every fight
let nextButtonToMountain = document.createElement('button')
nextButtonToMountain.textContent = "NEXT"
nextButtonToMountain.className = "next-button"
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
let characterDisplayImage = document.getElementById('character-display-image')
let characterDisplayImageSrc = ""

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
                battleText.textContent = "You sneak away!"
                storyHeadline.append(nextButtonToMountain)
                removeButtons()
                return sneakCheck
        } 
            else if (sneakCheck < monsterPerception) {
                playerHP -= 5
                displayHealth.textContent = `Health: ${playerHP}`
                battleText.textContent = `The monster spots you before you get away. It takes a swing at you, and you take 5 DAMAGE! Your current health is ${playerHP}`
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
            battleText.textContent = `You deal ${damage} DAMAGE to the monster. It has ${monsterHealth} hit points left!`
            if (monsterHealth <= 0) {
                removeButtons()
                mountainHubWorld()
            }
        } else if (attackCheck < monsterArmor) {
            let monsterAttack = rollDice(8, 5)
            playerHP = playerHP - monsterAttack
            displayHealth.textContent = `Health: ${playerHP}`
            console.log(playerHP)
            battleText.textContent = `Your attack misses! The monster counter attacks and deals ${monsterAttack} DAMAGE to you. You have ${playerHP} hit points left!`
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
            battleText.textContent = "The monster is seduced by you. Congrats. You have a monster lover now, you weirdo."
            storyHeadline.append(nextButtonToMountain)
            removeButtons()
        } else if (charmCheck < monsterCharmResistance) {
            playerHP -=5
            displayHealth.textContent = `Health: ${playerHP}`
            battleText.textContent = `The monster is confused by your advances, and smacks you on the head. You take 5 DAMAGE! Your current health is ${playerHP}`
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
            battleText.textContent = "You run under the monster's legs, and make a beeline for the exit!"
            storyHeadline.append(nextButtonToMountain)
            removeButtons()
        } else if (runCheck < monsterStrength) {
            playerHP -= 5
            displayHealth.textContent = `Health: ${playerHP}`
            //console.log(playerHP)
            battleText.textContent = `You try to bolt around the monster, but it takes a swing at you and hits you for 5 DAMAGE. Your current health is ${playerHP}`
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
    confirmCharacterButton.className = 'confirm-button'
    confirmCharacterButton.addEventListener('click', e => {
        tavernStart()
        displayClass.textContent = `Class: ${characterClass}`
        displayHealth.textContent = `Health: ${playerHP}`
        displayAttack.textContent = `Attack Modifier: ${strength}`
        displaySneak.textContent = `Sneak Modifier: ${dexterity}`
        displayCharm.textContent = `Charm Modifier: ${charisma}`
        displayRun.textContent = `Run Modifier: ${strength}`
        displayWisdom.textContent = `Wisdom Modifier: ${wisdom}`
        characterDisplayImage.src = characterDisplayImageSrc
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
                characterDisplayImageSrc = character.image
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
    encounterImage.src = "https://media2.giphy.com/media/fdGbhuUQpGQkkuuzIr/giphy.gif?cid=790b7611e33dd408c151140c921a412412477df9f4681155&rid=giphy.gif&ct=ts"
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
    let startingImage = "https://64.media.tumblr.com/0cbdcfa76d2eb280b4c3214f2aca019f/tumblr_on7bfiwtZX1ujca6vo1_640.gif"
    encounterImage.src = startingImage
    encounterName.textContent = "It's a dark and stormy night..."
    storyText.innerHTML = "You find yourself in a tavern. It's grimy, smells of ale, and the floor is sticky from years of uncleaned spills. A man approaches you and asks you to slay a dragon that lives in the mountain. The dragon plans to burn the town to the ground in 7 days time. Will you accept?"
    let yesButton = document.createElement('button')
    yesButton.id = "yes-button"
    yesButton.textContent = 'Yes'
    let noButton = document.createElement('button')
    noButton.id = 'no-button'
    noButton.textContent = 'No'
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
        nextButton.className = 'next-button'
        nextButton.addEventListener('click', () => {
            clownFight()
            nextButton.remove()
        })
        storyHeadline.append(nextButton)
    } else if (fightCounter === 2) {
        let nextButton = document.createElement('button')
        nextButton.className = 'next-button'
        nextButton.textContent = "NEXT"
        nextButton.addEventListener('click', () => {
            owlBearFight()
            nextButton.remove()
        })
        storyHeadline.append(nextButton)
    } else if (fightCounter === 3) {
        let nextButton = document.createElement('button')
        nextButton.className = 'next-button'
        nextButton.textContent = "NEXT"
        nextButton.addEventListener('click', () => {
            beholderFight()
            nextButton.remove()
        })
        storyHeadline.append(nextButton)
    } else if (fightCounter === 4) {
        let nextButton = document.createElement('button')
        nextButton.className = 'next-button'
        nextButton.textContent = "NEXT"
        nextButton.addEventListener('click', () => {
            cubeFight()
            nextButton.remove()
        })
        storyHeadline.append(nextButton)
    } else if (fightCounter === 5) {
        let nextButton = document.createElement('button')
        nextButton.className = 'next-button'
        nextButton.textContent = "NEXT"
        nextButton.addEventListener('click', () => {
            lichFight()
            nextButton.remove()
        })
        storyHeadline.append(nextButton)
    } else if (fightCounter === 6) {
        let nextButton = document.createElement('button')
        nextButton.className = 'next-button'
        nextButton.textContent = "NEXT"
        nextButton.addEventListener('click', () => {
            dragonGuardFight()
            nextButton.remove()
        })
        storyHeadline.append(nextButton)
    }
    else if (fightCounter === 7) {
        let nextButton = document.createElement('button')
        nextButton.className = 'next-button'
        nextButton.textContent = "NEXT"
        nextButton.addEventListener('click', () => {
            travelToFinalBoss()
            nextButton.remove()
        })
        storyHeadline.append(nextButton)
    }
    encounterName.textContent = "You defeated that monster"
    storyText.textContent = "Your HP has been restored after a moment of rest. Move on to your next combatant:"
    encounterImage.src = "https://cdnb.artstation.com/p/assets/images/images/023/229/887/original/tolunay-genc-forest.gif?1578523234"
    battleText.textContent = ""
    fetch("http://localhost:3000/classes") // must edit to reset health for each character 
    .then(resp => resp.json())
    .then(data => {
        playerHP = data[playerID - 1].health
        displayHealth.textContent = `Health: ${playerHP}`
    })
}

//MONSTER FIGHTS

// 1: TROLL FIGHT
function trollFight() {
    encounterImage.src = "https://i.pinimg.com/originals/92/e5/6f/92e56ffb13f7181271c0e4c199250dc3.gif"
    storyText.textContent = "On your route to the mountain, you must cross a river outside of town. You find the bridge to be guarded by a troll. What will you do to get around the troll?"
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
    encounterImage.src = "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/6bc7b51d-855f-4139-b283-345a9d91f7ef/dcizo60-e590a22d-148f-42ed-9d18-5d12a466ea8d.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzZiYzdiNTFkLTg1NWYtNDEzOS1iMjgzLTM0NWE5ZDkxZjdlZlwvZGNpem82MC1lNTkwYTIyZC0xNDhmLTQyZWQtOWQxOC01ZDEyYTQ2NmVhOGQuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.TB_P7d32yqxigZHsj1iP2X_hwhvRbRmXeudBWH9_PPc"
    storyText.textContent = "Oh no, a freaky clown excaped from a nearby birthday party and wants to kill you! What are you going to do?"
    encounterName.textContent = "A KILLER SPACE CLOWN STARES YOU DOWN"
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

// 3: OWL BEAR FIGHT
function owlBearFight() {
    encounterImage.src = "https://c.tenor.com/USr7Yxl97O0AAAAd/owl-bear-claws.gif"
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


//4: BEHOLDER FIGHT
function beholderFight() {
    encounterImage.src = "https://64.media.tumblr.com/1b16e3fdd6c7f1a8f3689716324a76da/tumblr_oft9kjakkf1tiwiyxo1_500.gif"
    storyText.textContent = "You're getting closer to the mountain, but before you reach the base, a Beholder appears! How will you get past it?"
    encounterName.textContent = "BEHOLD THE BEHOLDER"
    monsterHealth = 45
    monsterArmor = 16
    monsterPerception = 18
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

function cubeFight() {
    encounterImage.src = "https://i.imgur.com/6VP1xdA.gif"
    storyText.textContent = "While scaling the mountain, you pass through an abandoned mine. While navigating through it, you nearly get stuck in a Gelatinous Cube! What will you do to get past it?"
    encounterName.textContent = "OH NO, A GELATINOUS CUBE"
    monsterHealth = 50
    monsterArmor = 17
    monsterPerception = 15
    monsterCharmResistance = 18
    monsterStrength = 16
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

function lichFight() {
    encounterImage.src = "https://i.pinimg.com/originals/a3/5c/e8/a35ce8c6039b3a1a23aca7706e07c6fa.gif"
    storyText.textContent = "You emerge from the mine, and come to a clearing. A few feet away from you, you see a Lich; a damned spirit with unfinished business in the mortal plane. It doesn't seem to have noticed you yet. What will you do?"
    encounterName.textContent = "A LICH YOU CAN'T SCRATCH"
    monsterHealth = 60
    monsterArmor = 18
    monsterPerception = 14
    monsterCharmResistance = 19
    monsterStrength = 15
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

function dragonGuardFight() {
    encounterImage.src = "https://i.pinimg.com/originals/20/4f/a1/204fa15d01929a197e677aa1fbbd1acc.gif"
    storyText.textContent = `You're almost to the top of the mountain when a voice calls out to you. "Halt, wanderer. That dragon is under my protection. If you want to slay it, you have to go through me." An Draconic Wizard materializes in front of you. What will you do?`
    encounterName.textContent = "THE DRAGON'S GUARD"
    monsterHealth = 45
    monsterArmor = 18
    monsterPerception = 19
    monsterCharmResistance = 19
    monsterStrength = 18
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
    encounterImage.src = "https://media.tenor.com/Kv-MmoTE4qEAAAAM/cymru-wales.gif"
    storyText.textContent = "After many challenging battles, you have finally reached the peak. The dragon stirs and turns to face you. How will you act?"
    encounterName.textContent = "THE FINAL BATTLE"
    monsterHealth = 100
    monsterArmor = 19
    monsterPerception = 25
    monsterCharmResistance = 24
    monsterStrength = 26
    console.log(monsterHealth)
    //Sneak Option
    sneakByMonster2()
    storyHeadline.append(sneakButton2)
    // Attack option
    attackMonster2()
    storyHeadline.append(attackButton2)
    // Charm option
    charmMonster2()
    storyHeadline.append(charmButton2)
    //Run option
    runFromMonster2()
    storyHeadline.append(runButton2)
}





//UNIQUE BUTTONS FOR FINAL BOSS FIGHT
//DEFINE SNEAK BUTTON
let sneakButton2 = document.createElement('button')
sneakButton2.className = 'combat-buttons'
sneakButton2.textContent = "Sneak"
function sneakByMonster2() {
    sneakButton2.addEventListener('click', e => {
        let sneakCheck = rollDice(20, dexterity)
        //console.log(sneakCheck)
            if (sneakCheck >= monsterPerception) {
                battleText.textContent = "You are able to sneak away from the dragon, but now he's going to burn the town you swore to save. You live, but the town dies."
                storyHeadline.append(nextButtonToMountain2)
                removeButtons()
                return sneakCheck
        } 
            else if (sneakCheck < monsterPerception) {
                playerHP -= 5
                displayHealth.textContent = `Health: ${playerHP}`
                battleText.textContent = `The dragon spots you before you got away. He breathes fire at you, and you take 5 DAMAGE! Your current health is ${playerHP}`
                if (playerHP <= 0) {
                    removeButtons()
                    gameOver()
            }
        }
    }
)}

//DEFINE ATTACK BUTTON
let attackButton2 = document.createElement('button')
attackButton2.className = 'combat-buttons'
attackButton2.textContent = "Attack"
function attackMonster2() {
    attackButton.addEventListener('click', e => {
        let attackCheck = rollDice(20, strength)
        if (attackCheck >= monsterArmor) {
            let damage = rollDice(8, strength)
            console.log(damage)
            monsterHealth = monsterHealth - damage
            console.log(monsterHealth)
            //console.log(monsterHealth)
            battleText.textContent = `You deal ${damage} DAMAGE to the dragon. It has ${monsterHealth} hit points left!`
            if (monsterHealth <= 0) {
                removeButtons()
                mountainHubWorld()
            }
        } else if (attackCheck < monsterArmor) {
            let monsterAttack = rollDice(8, 5)
            playerHP = playerHP - monsterAttack
            displayHealth.textContent = `Health: ${playerHP}`
            console.log(playerHP)
            battleText.textContent = `Your attack misses! The dragon slashes at you and deals ${monsterAttack} DAMAGE to you. You have ${playerHP} hit points left!`
            if (playerHP <= 0) {
                removeButtons()
                gameOver()
            }
        }
    }
)}

//DEFINE CHARM BUTTON
let charmButton2 = document.createElement('button')
charmButton2.className = 'combat-buttons'
charmButton2.textContent = "Charm"
function charmMonster2() {
    charmButton2.addEventListener('click', e => {
        let charmCheck = rollDice(20, charisma)
        //console.log(charmCheck)
        if (charmCheck >= monsterCharmResistance) {
            battleText.textContent = "Your charm is able to win over the dragon. He will let you live, but now he's going to destroy the town. You live, but the town dies."
            storyHeadline.append(nextButtonToMountain2)
            removeButtons()
        } else if (charmCheck < monsterCharmResistance) {
            playerHP -=5
            displayHealth.textContent = `Health: ${playerHP}`
            battleText.textContent = `The dragon is confused by your advances, and whips you with his tail. You take 5 DAMAGE! Your current health is ${playerHP}`
            if (playerHP <= 0) {
                removeButtons()
                gameOver()
            }
        }
    })
}

//DEFINE RUN BUTTON
let runButton2 = document.createElement('button')
runButton2.className = 'combat-buttons'
runButton2.textContent = 'Run'
function runFromMonster2(){
    runButton.addEventListener('click', e => {
    let runCheck = rollDice(20, strength)
        if (runCheck >= monsterStrength) {
            battleText.textContent = "Instead of fighting the dragon, you turn tail and run away. You escape alive, but the town dies. You live the rest of your life in a neighboring town, drowning in the shame of your failure."
            storyHeadline.append(nextButtonToMountain2)
            removeButtons()
        } else if (runCheck < monsterStrength) {
            playerHP -= 5
            displayHealth.textContent = `Health: ${playerHP}`
            //console.log(playerHP)
            battleText.textContent = `You try to bolt around the dragon, but he breathes fire at you and hits you for 5 DAMAGE. Your current health is ${playerHP}`
            if (playerHP <= 0) {
                removeButtons()
                gameOver()
            }
        }
    }
)}

let nextButtonToMountain2 = document.createElement('button')
    nextButtonToMountain2.textContent = "NEXT"
    nextButton.textContent = "NEXT"
    nextButtonToMountain2.addEventListener('click', () => {
        gameOver()
        nextButtonToMountain.remove()
    });
