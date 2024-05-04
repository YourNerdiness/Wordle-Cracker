const fs = require("fs");

const words = fs.readFileSync("words.txt").toString("utf-8").split("\n");

const letterPositionCount = words.reduce((arr, word) => { 
    
    Array.from(word).forEach((character, index) => { arr[index][character] = (arr[index][character] || 0) + 1});
    
    return arr;

}, [{}, {}, {}, {}, {}]);

const isWordInvalid = (word, disallowedCharacters, allowedCharacters, knownCharacters, knownNotCharacters) => {

        for (let j = 0; j < 5; j++) {
            
            if ((knownCharacters[j] && word[j] != knownCharacters[j]) || (knownNotCharacters[j].includes(word[j])) || disallowedCharacters.includes(word[j])) {

                return true;

                break;

            }
        
        }

        if (allowedCharacters.reduce((acc, val) => { acc = !Array.from(word).includes(val); return acc; }, false)) {

            return true;

        }

        return false;

};

const getBestWord = (disallowedCharacters, allowedCharacters, knownCharacters, knownNotCharacters) => {

    let bestWord = words[0];
    let bestWordScore = Number.NEGATIVE_INFINITY;

    for (let i = 0; i < words.length; i++) {

        const word = words[i];

        if (isWordInvalid(word, disallowedCharacters, allowedCharacters, knownCharacters, knownNotCharacters)) {

            continue;

        }

        const wordArr = Array.from(word);

        let wordScore = 0;

        for (let j = 0; j < wordArr.length; j++) {

            if (allowedCharacters.includes(wordArr[j])) {

                wordScore += letterPositionCount[j][wordArr[j]] || 0

            }

            else {

                wordScore += (letterPositionCount[j][wordArr[j]] || 0)*0.1

            }

        }

        if (wordScore > bestWordScore) {

            bestWord = word;
            bestWordScore = wordScore;

        }

    }

    return bestWord;

};

let totalGuesses = 0;
const numTests = 1000;

for (let test = 0; test < numTests; test++) {

    const correctWord = words[Math.floor(Math.random()*words.length)];

    let disallowedCharacters = [];
    let allowedCharacters = [];
    const knownCharacters = ["", "", "", "", ""];
    const knownNotCharacters = [[], [], [], [], []]

    let numGuesses;

    for (numGuesses = 0; numGuesses < 6; numGuesses++) {

        const bestWord = getBestWord(disallowedCharacters, allowedCharacters, knownCharacters, knownNotCharacters);

        if (bestWord == correctWord) {

            totalGuesses += numGuesses + 1;

            break;

        }

        for (let i = 0; i < 5; i++) {

            if (correctWord[i] == bestWord[i]) {

                knownCharacters[i] = bestWord[i];

            }

            else {

                knownNotCharacters[i].push(bestWord[i]);

            }

        }

        const newDisallowedCharacters = Array.from(bestWord).filter(character => !Array.from(correctWord).includes(character));
        const newAllowedCharacters = Array.from(bestWord).filter(character => Array.from(correctWord).includes(character));

        disallowedCharacters = [...disallowedCharacters, ...newDisallowedCharacters];
        allowedCharacters = [...allowedCharacters, ...newAllowedCharacters];

    }

    // increment of numGuesses happens at end of loop before check against 6 maximum

    if (numGuesses == 6) {

        totalGuesses += numGuesses + 1;

    }

}

const averageNumGuesses = Math.round(totalGuesses/numTests*100)/100;

console.log(averageNumGuesses)