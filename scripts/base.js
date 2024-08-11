// check linking

console.log("base.js runs");

// import utilities

import { 
    generateRandomNumber,
    getPlayerGuess,
    checkGuess
 } from "./utilities.js";

//basic 1 turn wet run

let target_number = generateRandomNumber(1,100);

let this_guess = await getPlayerGuess();

console.log(this_guess, target_number);


checkGuess(this_guess, target_number);