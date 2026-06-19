let colors = ["red","light red","dark red","crimson","coral","salmon","pink","light pink","hot pink","deep pink","orange","light salmon","tomato","orange red","dark orange","yellow","gold","light yellow","dark yellow","goldenrod","purple","lavender","violet","fuchsia","magenta","dark violet","light violet","dark purple","light purple","light magenta","dark magenta","indigo","green","dark green","light green","green yellow","yellow green","chartreuse","lime","lime green","pale green","spring green","sea green","forest green","olive","olive green","aquamarine","cyan","teal","aqua","blue","dark blue","light blue","dark cyan","light cyan","turquoise","powder blue","sky blue","royal blue","navy","navy blue","brown","dark brown","light brown","tan","beige","chocolate brown","maroon","white","azure","ivory","grey","dark grey","light grey","gray","dark gray","light gray","silver","black","fushia","cerulean","lilac","sienna","burnt sienna","grape","mauve","charteuse","slime green", "puke green","raw umber","ultramarine blue","ultramarine","cadmium yellow"];

let fakeColors = ["light red","dark red","light pink","hot pink","deep pink","light salmon","orange red","dark orange","light yellow","dark yellow","dark violet","light violet","dark purple","light purple","light magenta","dark magenta","dark green","light green","green yellow","yellow green","lime green","pale green","spring green","sea green","forest green","olive green","dark blue","light blue","dark cyan","light cyan","powder blue","sky blue","royal blue","navy blue","brown","dark brown","light brown","chocolate brown","dark grey","light grey","dark gray","light gray","fushia","cerulean","lilac","sienna","burnt sienna","grape","mauve","charteuse","slime green", "puke green","raw umber","ultramarine blue","ultramarine","cadmium yellow"];

let fakeColorCodes = ['#fa8072','#dc143c','#ffe4e9','#ff499b','#f71590','#f9aea5','orangered','#f68900','#f4f591','#e5b92a','#691291','#c89af7','#36013d','#bc81f6','#f793c4','#5f0941','#033400','#a1cc8a','greenyellow','yellowgreen','lime','#c8f5b6','#b0dea9','#2E8B57','#174841','#4a5d20','#010088','#87b8e0','#01564b','#a6f7f4','#b0c9da','#4ea9dc','#0210dd','navy','#593e32','#402c12','#be9f80','#361f1a','#282828','#cccccc','#282828','#cccccc','#921b6a','#029fcc','#c29dc2','#e2704e','#9c4e2b','#69325e','#8c5c6a','#d8f700','#80b700','#9e9b10','#6f4811','#0100f6','#0100f6','#f5d30f'];

let inputList = [];
let pieceTitle;

paintColor = fakeColorCodes[fakeColors.indexOf('grape')];
dotSize = 10;
density = 1;
velocity = 0.4;

document.addEventListener("DOMContentLoaded", () => {
    const getURL = window.location.search;
    const parseURL = new URLSearchParams(getURL);
    const lastInput = parseURL.get('input');
    const lastTitle = parseURL.get('title');

    if(typeof lastInput == 'string'){
        document.body.classList.add('results');

        let titleDisplay = document.querySelector('.piece-title-display');
        titleDisplay.innerHTML = lastTitle;

        let inputs = lastInput.split('-');
        showResults(inputs);
    }

    setTimeout(()=>{
        let instructions = document.querySelector('.instructions');
        instructions.style.opacity = 1;
        instructions.classList.remove('animate-start');
    }, 500);

    if(window.innerWidth <= 900){
        let startCommand = document.querySelector('.start-command');

        startCommand.innerHTML = 'Tap anywhere';
    }else{
        let mobileHint = document.querySelector('.hint span');

        mobileHint.remove();
    }

    let titleInput = document.querySelector('.enter-title');
    let titleInputBox = document.querySelector('.enter-title input');
    let linksModal = document.querySelector('.links');
    let titleDiv = document.querySelector('.links .piece-title');
    let wordCounter = document.querySelector('.links h3');

    titleInput.addEventListener('keydown', (e)=>{
        if(e.key === 'Enter'){
            pieceTitle = titleInputBox.value;
            titleInputBox.value = '';

            let finishedURL = window.location.href + '?title=' + encodeURIComponent(pieceTitle) + '&input=';

            for(let i = 0; i < inputList.length; i++){
                let encoded = encodeURIComponent(inputList[i]);

                if(i == 0){
                    finishedURL = finishedURL.concat(encoded);
                }else{
                    finishedURL = finishedURL.concat("-" + encoded);
                }
            }

            let qrCode = document.querySelector('qr-code');
            let resultsLink = document.querySelector('.results-link');

            qrCode.setAttribute('contents', finishedURL);
            resultsLink.href = finishedURL;
            titleInput.close();
            timedRefresh(3);
        }
    });

    titleInput.addEventListener('close', ()=>{
        linksModal.showModal();
        document.activeElement.blur();
        linksModal.classList.remove('animate-start');
        titleDiv.innerHTML = pieceTitle;
        wordCounter.innerHTML = (inputList.length - 1) + ' words';
    });

    linksModal.addEventListener('close', ()=>{
        location.reload();
    });

    //mobile keyboard
    let topLetters = "qwertyuiop";
    let midLetters = "asdfghjkl";
    let bottomLetters = "zxcvbnm";

    let topRow = document.querySelector(".top");
    let midRow = document.querySelector(".mid");
    let bottomRow = document.querySelector(".bottom");

    for(let i = 0; i < topLetters.length; i++){
        newLetter = document.createElement('div');
        newLetter.classList.add('button');
        newLetter.innerHTML = topLetters[i];
        topRow.appendChild(newLetter);
        newLetter.setAttribute('onclick', 'mobileType(this)');
    }

    for(let i = 0; i < midLetters.length; i++){
        newLetter = document.createElement('div');
        newLetter.classList.add('button');
        newLetter.innerHTML = midLetters[i];
        midRow.appendChild(newLetter);
        newLetter.setAttribute('onclick', 'mobileType(this)');
    }

    let enter = document.createElement('div');
    enter.classList.add('button');
    enter.classList.add('enter');
    enter.innerHTML = '<i class="fa-solid fa-arrow-right-to-bracket"></i>';
    bottomRow.appendChild(enter);
    enter.setAttribute('onclick', 'enterMobile()');

    for(let i = 0; i < bottomLetters.length; i++){
        newLetter = document.createElement('div');
        newLetter.classList.add('button');
        newLetter.innerHTML = bottomLetters[i];
        bottomRow.appendChild(newLetter);
        newLetter.setAttribute('onclick', 'mobileType(this)');
    }

    let backspace = document.createElement('button');
    backspace.classList.add('button');
    backspace.classList.add('backspace');
    backspace.innerHTML = '<i class="fa-solid fa-delete-left"></i>';
    bottomRow.appendChild(backspace);
    backspace.setAttribute('onclick', 'backspace()');

    let spaceBar = document.querySelector('.spacebar');
    spaceBar.setAttribute('onclick', 'mobileType(this)');

    // tap to show letters

    let canvas = document.querySelector('.canvas');
    let letters = document.querySelector('.info.left');

    if(window.innerWidth <= 900){
        letters.addEventListener('click', ()=>{
            console.log('click');
            console.log(letters.style.opacity);
            if(letters.style.opacity == 0){
                letters.style.opacity = 1;
                console.log('tried it');
            }else{
                letters.style.opacity = 0;
            }
        })
    }
    //end of mobile keyboard

    let letterOverlay = document.querySelector('.letter-grid');
    let letterList = 'abcdefghijklmnopqrstuvwxy';
    for(let i = 0; i < letterList.length; i++){
        let newLetter = document.createElement('div');
        newLetter.classList.add('letter');
        newLetter.classList.add(letterList[i]);
        let newLetterContent = document.createElement('p');
        newLetterContent.innerHTML = letterList[i];
        newLetter.appendChild(newLetterContent);
        letterOverlay.appendChild(newLetter);
    }
});

document.addEventListener('keydown', ()=>{
    let background = document.querySelector('.instructions-background');
    let instructions = document.querySelector('.instructions');
    let hint = document.querySelector('.hint');
    let ending = document.querySelector('.links');

    if(instructions.style.opacity != 0){
        background.style.opacity = 0;
        instructions.style.opacity = 0;
        setTimeout(()=>{
            background.style.zIndex = -2;
            instructions.style.zIndex = -2;
        },1000);
    }else if(hint.style.opacity != 0){
        hint.style.opacity = 0;
        setTimeout(()=>{
            hint.style.zIndex = -3;
        },1000);
    }
});

document.addEventListener('click', ()=>{
    let background = document.querySelector('.instructions-background');
    let instructions = document.querySelector('.instructions');
    let hint = document.querySelector('.hint');

    if(instructions.style.opacity != 0){
        background.style.opacity = 0;
        instructions.style.opacity = 0;
        setTimeout(()=>{
            background.style.zIndex = -2;
            instructions.style.zIndex = -2;
        },1000);
    }else if(hint.style.opacity != 0){
        hint.style.opacity = 0;
        setTimeout(()=>{
            hint.style.zIndex = -3;
        },1000);
    }
});

// mobile keyboard
function mobileType(element){
    let letter = element.innerHTML;
    let inputBox = document.querySelector('.input');
    
    if(letter === 'space'){
        inputBox.value += ' ';
        return;
    }
    inputBox.value += letter;
}

function enterMobile(){
    let inputBox = document.querySelector('.input');
    let inputWord = inputBox.value.toLowerCase();
    inputList.push(inputWord);
    let lastWord = document.querySelector('.last-word');
    lastWord.innerHTML = inputWord;

    paintDots(inputWord);

    inputBox.value = '';
}

function backspace(){
    let inputBox = document.querySelector('.input');
    inputBox.value = inputBox.value.slice(0, -1);
}
// end of mobile keyboard

// FOCUS THE TEXT BOX ON ANY KEY PRESS
document.addEventListener('keydown', e => {
    let inputBox = document.querySelector('.input');

    if(e.key != 'Escape' && e.key != 'Enter'){
        inputBox.focus();
    }
    if(e.key === 'Escape'){
        inputBox.value = '';
        document.activeElement.blur();
    }
    if(e.key === 'Enter'){
        let inputWord = inputBox.value.toLowerCase();
        inputWord = inputWord.replace(/[^a-zA-Z0-9 ]+/g, '');
        if(inputWord != 'done') inputList.push(inputWord);
        let lastWord = document.querySelector('.last-word');
        lastWord.innerHTML = inputWord;

        if(inputWord != 'done' && inputWord != 'hint'){
            paintDots(inputWord);
        }else if(inputWord === 'hint'){
            let hint = document.querySelector('.hint');

            hint.style.zIndex = 3;
            hint.style.opacity = 1;
        }else{
            let titleInputModal = document.querySelector('.enter-title');
            let titleInputBox = document.querySelector('.enter-title input');
            let backgroundDiv = document.querySelector('.background');

            backgroundDiv.classList.add('covering');
            titleInputModal.showModal();
            titleInputModal.classList.remove('animate-start');
            setTimeout(()=>{titleInputBox.focus()},200);
        }

        inputBox.value = '';
        document.activeElement.blur();
    }
});

function getDotCoords(element){
    let currentX = parseInt(window.getComputedStyle(element).getPropertyValue('--x'));
    let currentY = parseInt(window.getComputedStyle(element).getPropertyValue('--y'));

    return [currentX, currentY];
}

function getLetterArea(element){
    let xPos = Math.floor((getDotCoords(element)[0] / 10) / 2);
    let yPos = Math.floor((getDotCoords(element)[1] / 10) / 2);

    let letterList = 'abcdefghijklmnopqrstuvwxyz';

    let letterArea = letterList[yPos*5 + xPos];

    return letterArea;
}

// MOVE A DOT TO COORDINATES
function moveToPoint(element, targetX, targetY){
    element.style.setProperty('--x', targetX + '%');
    element.style.setProperty('--y', targetY + '%');
}

// MAKE A DOT BIGGER OR SMALLER BY A MODIFIER
function resizeDot(element, sizeModifier){
    let currentSize = parseInt(window.getComputedStyle(element).getPropertyValue('--width'));
    let currentX = parseInt(window.getComputedStyle(element).getPropertyValue('--x'));
    let currentY = parseInt(window.getComputedStyle(element).getPropertyValue('--y'));

    let newSize = currentSize * sizeModifier
    let scaledX = scale(currentX, 0, (100 - currentSize), 0, (100 - newSize));
    let scaledY = scale(currentY, 0, (100 - currentSize), 0, (100 - newSize));

    element.style.setProperty('--width', newSize + '%');
    element.style.setProperty('--radius', (newSize/2) + '%');
    moveToPoint(element, scaledX, scaledY);
}

function setDotSize(element, size){
    element.style.setProperty('--width', size + '%');
    element.style.setProperty('--radius', (size/2) + '%');
}

function handleSizeInputs(word){
    if(word.startsWith('bigger')){
        dotSize += 2;
    }else if(word.startsWith('smaller') && dotSize >= 3){
        dotSize -= 2;
    }else if(word.startsWith('tiny')){
        dotSize = 0.5;
    }else if(word.startsWith('small')){
        dotSize = 2;
    }else if(word.startsWith('normal')){
        dotSize = 5;
    }else if(word.startsWith('big') | word.startsWith('large')){
        dotSize = 10;
    }else if(word.startsWith('huge')){
        dotSize = 15;
    }else if(word.startsWith('massive')){
        dotSize = 20;
    }else if(word.startsWith('size ')){
        sizeNumber = word.slice(5);
        if(typeof parseInt(sizeNumber) != NaN){
            dotSize = parseInt(sizeNumber);
        }
    }else{
        return false;
    }

    return true;
}

function handleDensityInputs(word){
    if(word.startsWith('single')){
        density = 1;
    }else if(word.startsWith('sparse') && !word.startsWith('sparser')){
        density = 3;
    }else if(word.startsWith('dense') && !word.startsWith('denser')){
        density = 6;
    }else if(word.startsWith('thick')){
        density = 9;
    }else if(word.startsWith('denser') && density < 9){
        density += 1;
    }else if((word.startsWith('sparser') | word.startsWith('less dense')) && density > 1){
        density -= 1;
    }else if(word.startsWith('density ')){
        densityNumber = word.slice(8);
        if(typeof parseInt(densityNumber) != NaN && parseInt(densityNumber) <= 9){
            density = parseInt(densityNumber);
        }else if(typeof parseInt(densityNumber) != NaN && parseInt(densityNumber) > 9){
            density = 9;
        }
    }else{
        return false;
    }

    return true;
}

function handleVelocityInputs(word){
    if(word.startsWith('slower') && velocity > 0.1){
        velocity -= 0.1;
    }else if(word.startsWith('faster') && velocity < 1){
        velocity += 0.1;
    }else if(word.startsWith('slow') && !word.startsWith('slower') | word.startsWith('sluggish')){
        velocity = 0.2;
    }else if(word.startsWith('quick')){
        velocity = 0.5;
    }else if(word.startsWith('fast') && !word.startsWith('faster')){
        velocity = 0.7;
    }else if(word.startsWith('speedy')){
        velocity = 0.9;
    }else if(word.startsWith('velocity ')){
        velocityNumber = word.slice(9);
        if(typeof parseInt(velocityNumber) != NaN && parseInt(velocityNumber) <= 10){
            velocity = parseInt(velocityNumber) / 10;
        }else if(typeof parseInt(velocityNumber) != NaN && parseInt(velocityNumber) > 10){
            velocity = 1;
        }
    }else{
        return false;
    }

    return true;
}

// GET THE CURRENT COLOR OF A DOT
function getDotColor(element){

    let red = parseInt(window.getComputedStyle(element).getPropertyValue('--red'));
    let green = parseInt(window.getComputedStyle(element).getPropertyValue('--green'));
    let blue = parseInt(window.getComputedStyle(element).getPropertyValue('--blue'));

    return [red,green,blue];
}

// CHANGE THE COLOR OF A DOT
function colorShiftDot(element, rMod, gMod, bMod){
    currentColors = getDotColor(element);
    let red = currentColors[0];
    let green = currentColors[1];
    let blue = currentColors[2];

    let newRed = red + rMod;
    let newGreen = green + gMod;
    let newBlue = blue + bMod;

    element.style.setProperty('--red', newRed);
    element.style.setProperty('--green', newGreen);
    element.style.setProperty('--blue', newBlue);

    element.style.backgroundColor = 'rgb(' + newRed + ', ' + newGreen + ', ' + newBlue + ')';
}

function colorChangeDot(element, r, g, b){
    element.style.setProperty('--red', r);
    element.style.setProperty('--green', g);
    element.style.setProperty('--blue', b);

    element.style.backgroundColor = 'rgb(' + r + ', ' + g + ', ' + b + ')';
}

// MOVE A DOT TOWARDS A POSITION
function moveDotTowards(element, targetX, targetY, percentage){
    let currentX = parseInt(window.getComputedStyle(element).getPropertyValue('--x'));
    let currentY = parseInt(window.getComputedStyle(element).getPropertyValue('--y'));
    let width = parseInt(window.getComputedStyle(element).getPropertyValue('--radius'));

    let newX = currentX + (targetX - currentX)*percentage;
    let newY = currentY + (targetY - currentY)*percentage;

    element.style.setProperty('--x', newX + '%');
    element.style.setProperty('--y', newY + '%');

}

// RETURNS AN ARRAY OF ALL THE VOWELS IN THE WORD
function getWordVowels(word){
    let vowelList = [];

    for(let i = 0; i < word.length; i++){
        if(word[i].match(/[aeiou]/)){
            vowelList.push(word[i]);
        }
    }

    return vowelList;
}

// RETURNS AN ARRAY OF ALL THE CONSONANTS IN THE WORD
function getWordConsonants(word){
    let consonantList = [];

    for(let i = 0; i < word.length; i++){
        if(!word[i].match(/[aeiou]/)){
            consonantList.push(word[i]);
        }
    }

    return consonantList;
}

function getLetterCoords(letter){
    let letterList = 'abcdefghijklmnopqrstuvwxyz';
    let letterNumber = 0;
    for(let i = 0; i < letterList.length; i++){
        if(letter === letterList[i]){
            letterNumber = i;
        }
    }

    let letterRow = letterNumber % 5;
    let letterColumn = Math.floor(letterNumber / 5);
    return [letterRow, letterColumn];
}

// PUSHES THE WORD TO THE DICTIONARY API, EVENTUALLY WILL RETURN THE TYPE OF THE WORD
function getWordType(word){
    wordData = '';

    fetch('https://api.dictionaryapi.dev/api/v2/entries/en/hello')
        .then(response => {
            if(!response.ok){
                throw new Error('error wasnt ok');
            }

            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .then(error => {
            console.log(error);
        });
}

// RESCALE A NUMBER TO A NEW RANGE
function scale (number, inMin, inMax, outMin, outMax) {
    let scaledNum = (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;

    if(scaledNum > outMax){scaledNum = outMax;}
    if(scaledNum < outMin){scaledNum = outMin;}
    
    return scaledNum;
}

function distanceFunc(x1, y1, x2, y2){
    let xDist = x2 - x1;
    let yDist = y2 - y1;

    let distance = Math.hypot(xDist, yDist);
    return distance;
}

function getAverageLetterCoords(word){
    let wordLength = word.length;

    let averageX = 0;
    for(let i = 0; i < wordLength; i++){
        averageX += getLetterCoords(word[i])[0] * 20 + 5;
    }
    averageX = averageX / wordLength;
    let averageY = 0;
    for(let i = 0; i < wordLength; i++){
        averageY += getLetterCoords(word[i])[1] * 20 + 5;
    }
    averageY = averageY / wordLength;
}

function getColorCode(input){
    //assuming that the input is already coming from the colors array
    let color = input;

    if(fakeColors.includes(color)){
        color = fakeColorCodes[fakeColors.indexOf(color)];
    }

    return color;
}

function getDensityPositions(iteration){
    let xMod = 0;
    let yMod = 0;

    if(density === 1){
        return [xMod, yMod];
    }

    if(density === 2){
        if(iteration === 0){
            xMod = -10;
        }else if(iteration === 1){
            xMod = 10;
        }
    }

    if(density === 3){
        if(iteration === 0){
            yMod = -10;
        }else if(iteration === 1){
            xMod = -10;
            yMod = 10;
        }else if(iteration === 2){
            xMod = 10;
            yMod = 10;
        }
    }

    if(density === 4){
        if(iteration === 0){
            xMod = -10;
            yMod = -10;
        }else if(iteration === 1){
            xMod = 10;
            yMod = -10;
        }else if(iteration === 2){
            xMod = -10;
            yMod = 10;
        }else if(iteration === 3){
            xMod = 10;
            yMod = 10;
        }
    }

    if(density === 5){
        if(iteration === 0){
            xMod = -10;
            yMod = -10;
        }else if(iteration === 1){
            xMod = 10;
            yMod = -10;
        }else if(iteration === 2){
            xMod = 0;
            yMod = 0;
        }else if(iteration === 3){
            xMod = -10;
            yMod = 10;
        }else if(iteration === 4){
            xMod = 10;
            yMod = 10;
        }
    }

    if(density === 6){
        if(iteration === 0){
            xMod = -10;
            yMod = -10;
        }else if(iteration === 1){
            xMod = 10;
            yMod = -10;
        }else if(iteration === 2){
            xMod = -10;
            yMod = 0;
        }else if(iteration === 3){
            xMod = 10;
            yMod = 0;
        }else if(iteration === 4){
            xMod = -10;
            yMod = 10;
        }else if(iteration === 5){
            xMod = 10;
            yMod = 10;
        }
    }

    if(density === 7){
        if(iteration === 0){
            xMod = -10;
            yMod = -10;
        }else if(iteration === 1){
            xMod = 10;
            yMod = -10;
        }else if(iteration === 2){
            xMod = -10;
            yMod = 0;
        }else if(iteration === 3){
            xMod = 0;
            yMod = 0;
        }else if(iteration === 4){
            xMod = 10;
            yMod = 0;
        }else if(iteration === 5){
            xMod = -10;
            yMod = 10;
        }else if(iteration === 6){
            xMod = 10;
            yMod = 10;
        }
    }

    if(density === 8){
        if(iteration === 0){
            xMod = -10;
            yMod = -10;
        }else if(iteration === 1){
            xMod = 0;
            yMod = -10;
        }else if(iteration === 2){
            xMod = 10;
            yMod = -10;
        }else if(iteration === 3){
            xMod = -10;
            yMod = 0;
        }else if(iteration === 4){
            xMod = 10;
            yMod = 0;
        }else if(iteration === 5){
            xMod = -10;
            yMod = 10;
        }else if(iteration === 6){
            xMod = 0;
            yMod = 10;
        }else if(iteration === 7){
            xMod = 10;
            yMod = 10;
        }
    }

    if(density === 9){
        if(iteration === 0){
            xMod = -10;
            yMod = -10;
        }else if(iteration === 1){
            xMod = 0;
            yMod = -10;
        }else if(iteration === 2){
            xMod = 10;
            yMod = -10;
        }else if(iteration === 3){
            xMod = -10;
            yMod = 0;
        }else if(iteration === 4){
            xMod = 0;
            yMod = 0;
        }else if(iteration === 5){
            xMod = 10;
            yMod = 0;
        }else if(iteration === 6){
            xMod = -10;
            yMod = 10;
        }else if(iteration === 7){
            xMod = 0;
            yMod = 10;
        }else if(iteration === 8){
            xMod = 10;
            yMod = 10;
        }
    }

    return [xMod, yMod];
}

function paintDots(input){
    let word = input;
    let wordLength = input.length;
    let vowels = getWordVowels(word);
    let vowelCount = vowels.length;
    let consonants = getWordConsonants(word);
    let consonantCount = consonants.length;
    let isSquare = false;

    let undoables = document.querySelectorAll('.undoable');

    if(word === 'undo'){
        for(let i = 0; i < undoables.length; i++){
            undoables[i].remove();
        }
        return;
    }

    if(handleSizeInputs(word)){
        let sizeDisplay = document.querySelector('.size-display');
        sizeDisplay.innerHTML = parseInt(dotSize);
        return;
    }

    if(handleDensityInputs(word)){
        let densityDisplay = document.querySelector('.density-display');
        densityDisplay.innerHTML = parseInt(density);
        return;
    }

    if(handleVelocityInputs(word)){
        let velocityDisplay = document.querySelector('.velocity-display');
        velocityDisplay.innerHTML = parseInt(velocity * 10);
        return;
    }

    for(let i = 0; i < colors.length; i++){
        if(word.startsWith(colors[i])){
            paintColor = getColorCode(colors[i]);

            let colorDisplay = document.querySelector('.paint-color-display');
            colorDisplay.innerHTML = colors[i];
            let swatch = document.querySelector('.paint-swatch');
            swatch.style.backgroundColor = getColorCode(colors[i]);

            word = word.slice(colors[i].length);

            if(word.startsWith(' ')){
                word = word.slice(1);
            }
            if(word.length === 0){
                return;
            }
        }
    }

    if(word.startsWith('cover ')){
        isSquare = true;
        word = word.slice(6);
        wordLength = word.length;
    }

    for(let i = 0; i < undoables.length; i++){
        undoables[i].classList.remove('undoable');
    }

    let canvas = document.querySelector('.canvas');
    let firstDotCoords = [];

    for(let i = 0; i < wordLength; i++){
        for(let k = 0; k < density; k++){
            let newDot = document.createElement('div');
            newDot.classList.add('pixel');
            newDot.classList.add('undoable');
            newDot.classList.add('show-with-results');

            canvas.appendChild(newDot);

            if(isSquare === true){
                newDot.style.borderRadius = 0;
                newDot.style.backgroundColor = paintColor;
                setDotSize(newDot, 20);
                moveToPoint(newDot, getLetterCoords(word[i])[0] * 20, getLetterCoords(word[i])[1] * 20);
                console.log(word[i]);
                continue;
            }
            
            let letter = word[i];
            let modifiers = getDensityPositions(k);
            let xPos = getLetterCoords(letter)[0] * 20 + modifiers[0];
            let yPos = getLetterCoords(letter)[1] * 20 + modifiers[1];

            if(i === 0){
                firstDotCoords.push(getLetterCoords(letter)[0] * 20);
                firstDotCoords.push(getLetterCoords(letter)[1] * 20);
            }

            setDotSize(newDot, dotSize);
            moveToPoint(newDot, xPos, yPos);
            newDot.style.backgroundColor = paintColor;
            
            moveDotTowards(newDot, firstDotCoords[0], firstDotCoords[1], velocity);
        }
    }

}

async function showResults(inputs){
    let wordDisplay = document.querySelector('.result-word');

    for(let i = 0; i < inputs.length; i++){
        if(inputs[i] != 'hint'){
            paintDots(inputs[i]);
        }
        wordDisplay.innerHTML = inputs[i];
        wordDisplay.style.opacity = 1;
        await sleep(250);
        wordDisplay.style.opacity = 0;
        await sleep(250);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function timedRefresh(minutes){
    let ms = minutes * 60000;

    setTimeout(()=>{
        location.reload();
    }, ms);
}