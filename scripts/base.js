// check linking
console.dir("base.js runs");

// define utilities

function gameEngine() {
  // get and set functions
  const getGameState = () => {
    let _game_state = JSON.parse(JSON.stringify(game_state));
    return _game_state;
  };

  // initialisation
  const MAX_TURNS = 10;

  const game_state = {
    target_number: -1,
    game_turn: 0,
    prompting_for_guess: false,
    current_guess: -1,
    stored_guess: false,
    guess_sequence: [],
    game_won: false,
  };

  // utility functions
  const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const checkGuess = (guess, target) => {
    if (guess === target) {
      return "correct";
    } else if (guess < target) {
      return "too low";
    } else {
      return "too high";
    }
  };

  const getPlayerGuess = () => {
    let guess;
    let isValid = false;

    while (!isValid) {
      const input = prompt(
        "Enter your guess (between 1 and 100), or 'q' to quit:"
      );

      // Handle case where input is null (Cancel button clicked)
      if (input === null) {
        console.log("You have chosen to quit the game.");
        alert("The game has been canceled. Thank you for playing!");
        game_state.game_won = false;
        return null;
      }

      // Handle case where input is 'q' or 'Q'
      if (input.toLowerCase() === "q") {
        console.log("You have chosen to quit the game.");
        if (confirm("Do you want to start a new game?")) {
          gameEngine();
          return null;
        } else {
          alert("Thank you for playing!");
          game_state.game_won = false;
          return null;
        }
      }
      // Check if the input consists entirely of digits
      if (/^\d+$/.test(input.trim())) {
        guess = parseInt(input.trim(), 10);
        if (guess >= 1 && guess <= 100) {
          isValid = true;
        } else {
          console.log(
            "Invalid input. Please enter a number between 1 and 100."
          );
        }
      } else {
        console.log("Invalid input. Please enter a valid number.");
      }
    }

    return guess;
  };

  const gameLoop = () => {
    if (game_state.game_turn === 0) {
      alert(
        "Welcome to my guessing game. I have chosen a number from 1-100 inclusive. You have 10 tries to guess it. Are you ready?"
      );
    }

    setTimeout(() => {
      if (game_state.game_turn < MAX_TURNS) {
        game_state.prompting_for_guess = false;
        game_state.stored_guess = false;

        game_state.game_turn++;

        console.log(
          `++++++++++ This is turn number ${game_state.game_turn} +++++++++++++++++`
        );

        game_state.prompting_for_guess = true;
        game_state.current_guess = getPlayerGuess();

        if (game_state.current_guess === null) {
          return;
        }
        game_state.guess_sequence[game_state.game_turn - 1] =
          game_state.current_guess;
        game_state.stored_guess = true;

        const check_string = checkGuess(
          game_state.current_guess,
          game_state.target_number
        );

        if (check_string === "correct") {
          console.log(
            `You did it!! The computer chose ${game_state.target_number} and on turn ${game_state.game_turn} you guessed ${game_state.current_guess}. Well done!!`
          );
          game_state.game_won = true;
        } else if (check_string === "too high") {
          console.log(
            `Your guess is too high. You have ${
              MAX_TURNS - game_state.game_turn
            } tries left`
          );
        } else if (check_string === "too low") {
          console.log(
            `Your guess is too low. You have ${
              MAX_TURNS - game_state.game_turn
            } tries left`
          );
        } else {
          console.log("Error in game logic");
        }

        if (!game_state.game_won) {
          if (game_state.game_turn < MAX_TURNS) {
            gameLoop();
          } else {
            console.log(
              `You are out of turns!! You failed to guess the correct number, which was ${game_state.target_number}`
            );
            console.log(`Better luck next time!!`);
          }
        } else {
          console.log("Congratulations on winning the game!!");
        }
      }
    }, 0);
  };

  game_state.target_number = generateRandomNumber(1, 100);

  // run the recursing game loop
  gameLoop();
}

// gameEngine replaces the basic 1 turn. Invoke the engine to play the game
gameEngine();
