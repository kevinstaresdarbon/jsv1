export const generateRandomNumber = (min, max) => {
    return (Math.floor(Math.random() * (max - min + 1)) + min);
}

export const getPlayerGuess = async () => {
    let playerGuess = prompt("Please enter your next guess");
    return parseInt(playerGuess);    
}

export const checkGuess = (guess, target) => {
    const _guess=guess;
    const _target=target;
if (_guess === _target){
    alert(`You did it!!  The computer chose ${target_number} and you guessed ${this_guess}. Well done!!`);
} else if (_guess < _target){
    alert("Your guess is too low!");
} else if (_guess > _target){
    alert("Your guess is too High");
};
}