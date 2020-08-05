// ---------------------------
// 1. Game setup
// ---------------------------

// constants
const DEFAULT_IMAGE = "001-face.png"
// @NOTE: your game must work for any size array!
const POSSIBLE_WORDS = ["TORONTO", "PARIS", "ROME", "MISSISSIPPI","LARRYPAGE"]; 
let MAX_CHANCES = 6

// game variables

let randomIndex
let randomWord
let selectedKeys = []

const randomIntFromInterval = function(min, max) { 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const selectRandom = function() {
  
  randomIndex = randomIntFromInterval(0,POSSIBLE_WORDS.length-1);
  randomWord = POSSIBLE_WORDS[randomIndex];
  document.querySelector("#debug-actual-word").innerText = "DEBUG: Selected word is : " +randomWord;

}

const applyDashes = function(positions) {
  let i;
  let dashes = ""
  for (i = 0; i < randomWord.length; i++) {
    if(positions == undefined){
      dashes += "_ ";
    }else{
       let matchFound = false //[1,3,6]
       for (let j = 0; j < positions.length; j++) {
         let position = positions[j]
        if(i === position) {
          dashes += randomWord[i] + " ";
          matchFound = true
        }   
       }
       if(matchFound === false){
        dashes += "_ ";
       }
    }
  }
  let word = document.getElementById("word")
  word.innerText = dashes
}

const updateHangmanImage = function() {
  switch(MAX_CHANCES) {
    case 5:
      document.getElementById("img-hangperson-status").src= "img/002-face.png";
      break;
    case 4:
      document.getElementById("img-hangperson-status").src= "img/003-face.png";
      break;
    case 3:
      document.getElementById("img-hangperson-status").src= "img/004-face.png"
    break;
    case 2:
      document.getElementById("img-hangperson-status").src= "img/005-face.png"
    break;
    case 1:
      document.getElementById("img-hangperson-status").src= "img/006-face.png"
    break;
    case 0:
      document.getElementById("img-hangperson-status").src= "img/007-face.png"
    break;
    default:
      document.getElementById("img-hangperson-status").src= "img/001-face.png"
  }
}

const clearLettersPressed = function(){
  let letters = document.querySelectorAll("div.letter-bank div.row div.letter")
  let i;
  for (i = 0; i < letters.length; i++) {
    let letter = letters[i];
    console.log("letters are"+letter)
  
    if (letter.classList.contains("already-selected") === true) {
      letter.classList.remove("already-selected");
    }
  }
}

const updateChanceLabel = function() {
  document.querySelector("span.chancesLabel").innerText = MAX_CHANCES.toString()
}


const updateLetterFoundLabel = function(letter) {
  if(letter == undefined) {
    document.getElementById("results").innerText = "WRONG! " + selectedKeys[selectedKeys.length-1] + " is NOT in the word"
  }else{
    document.getElementById("results").innerText = "CORRECT! " + letter + " is in the word"
  }
}

const clear = function() {
  randomWord = ""
  randomIndex = 0
  MAX_CHANCES = 6
  selectedKeys = []
  document.querySelector("#debug-actual-word").innerText =  "please press start gane button"
  updateHangmanImage()
  clearLettersPressed()
  document.getElementById("results").innerText = ""
  document.getElementById("results").style.backgroundColor = "white"
}

const preparePositions =function() {
  let letterFoundIndex = []
  for (let i = 0; i < selectedKeys.length; i++) {  // [O,T]
    selectedLetter = selectedKeys[i]; // O
    for (let j = 0; j < randomWord.length; j++) { //TORONTO
      let character = randomWord.charAt(j); //O
       if(selectedLetter === character) {
         letterFoundIndex.push(j)
       }
    }  
  }
  return letterFoundIndex
}

const checkResult = function() {
  if(MAX_CHANCES > 0) {
    let word = document.getElementById("word").innerText
    let finalword = ""
    for (let i = 0; i < word.length; i++) {
      if(word.charAt(i) === "_"){

      }else if(word.charAt(i) === " "){
      
      }else{
        finalword += word.charAt(i)
      }
    }
    console.log("final word is"+finalword)
    if(finalword === randomWord){
      document.getElementById("results").innerText = "GAME OVER!YOU WIN!"
      document.getElementById("results").style.backgroundColor = "yellow"
    }
    
  }else{
    document.getElementById("results").innerText = "GAME OVER!YOU LOSE!"
    document.getElementById("results").style.backgroundColor = "yellow"
  }
}


const updateDashes = function() {
  let selectedLetter
    let letterFound = false
    selectedLetter = selectedKeys[selectedKeys.length-1];
    for (let j = 0; j < randomWord.length; j++) {
      let character = randomWord.charAt(j);
        if(selectedLetter === character) {
          letterFound = true
        }
    }  
    if(letterFound === false) {
      //incorrect, reduce the chances
      MAX_CHANCES --
      updateHangmanImage()
      updateChanceLabel()
      updateLetterFoundLabel(undefined)
    } else {
      updateLetterFoundLabel(selectedLetter)
      applyDashes(preparePositions())
    }

    checkResult()
  
}

const updateLetterPressed = function(event){
  console.log("Clicked inside the keyboard")
  // 1. get the specific element that was clicked on
  let element = event.target;
  if (element.classList.contains("letter") === true) {
    console.log("You clicked on a letter");
    // 3. if yes, check if the seat is occupied
    if (element.classList.contains("already-selected") === true) {
        // 4. if yes, then do not change to gray
        console.log("Already pressed letter");
    }
    else {
      element.classList.add("already-selected");  
      selectedKeys.push(event.target.innerText);
      updateDashes()
    }
  }
  else{
    console.log("you clicked on something else");
  }
}

const startGame = function() {
  alert("game start");
  console.log("game start");
   clear()
   selectRandom()
   applyDashes()
   updateChanceLabel()

}


// function getRandomWord() {
//   const randomValue = Math.floor(Math.random() * POSSIBLE_WORDS.length);
//   return POSSIBLE_WORDS[randomValue];
// }
// -------------------
// EVENT LISTENERS
// -------------------

// start button: when clicked, start a new game
document.querySelector(".btn-start-game").addEventListener("click", startGame);

//saved details to hanggame
const saveGame = function(){
  
  console.log("Save Game button pressed");
  let hanggame = {
    "selectedWord":randomWord,
    "chancesRemaining":MAX_CHANCES,
    }
    console.log("hanggame object: ");
    console.log(hanggame);
    // 2. save it to local storage
    // key = name, value = studentName variable
    localStorage.setItem("names", JSON.stringify(hanggame));
    alert("SAVING THE GAME!");
}


// save button: when clicked, save game to local storage
document.querySelector(".btn-save-game").addEventListener("click", saveGame);


document.querySelector(".letter-bank").addEventListener("click", updateLetterPressed);

