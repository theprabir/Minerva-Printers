const body = document.querySelector("body");
    const navbar = document.querySelector(".navbar");
    const menuBtn = document.querySelector(".menu-btn");
    const cancelBtn = document.querySelector(".cancel-btn");
    menuBtn.onclick = ()=>{
      navbar.classList.add("show");
      menuBtn.classList.add("hide");
      body.classList.add("disabled");
    }
    cancelBtn.onclick = ()=>{
      body.classList.remove("disabled");
      navbar.classList.remove("show");
      menuBtn.classList.remove("hide");
    }
    window.onscroll = ()=>{
      this.scrollY > 20 ? navbar.classList.add("sticky") : navbar.classList.remove("sticky");}

      var wordsToType = document.querySelector("span[words]").getAttribute("words").split(','), 
      typer =  document.querySelector("span[words]"), 
      typingSpeed = (parseInt(typer.getAttribute('typing-speed')) || 70), 
      typingDelay = (parseInt(typer.getAttribute('typing-delay')) || 700);

var currentWordIndex = 0, currentCharacterIndex = 0; 

function type(){

var wordToType = wordsToType[currentWordIndex%wordsToType.length];

if(currentCharacterIndex < wordToType.length){
  typer.innerHTML += wordToType[currentCharacterIndex++];
  setTimeout(type, typingSpeed);
}else{

  setTimeout(erase, typingDelay);
}

}
function erase(){
var wordToType = wordsToType[currentWordIndex%wordsToType.length]; 
if(currentCharacterIndex >0){
  typer.innerHTML = wordToType.substr(0, --currentCharacterIndex -1);
  setTimeout(erase, typingSpeed);
}else{

  currentWordIndex++; 
  setTimeout(type, typingDelay);
}

}

window.onload = function(){
type(); 
}