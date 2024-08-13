// check linking
console.dir("base.js runs");

// define utilities

function gameEngine() {
  const MAX_TURNS = 10;

  const game_state = {
    target_number: -1,
    game_turn: 0,
    current_guess: -1,
    guess_sequence: [],
    message_log: [],
    in_progress: false,
    game_quitted: false,
    game_won: false,
  };

  const initializeGameState = () => {
    if (localStorage.getItem("game_state") === null) {
      game_state.target_number = generateRandomNumber(1, 100);
      localStorage.setItem("game_state", JSON.stringify(game_state));
    } else {
      let _retrieved_state = JSON.parse(localStorage.getItem("game_state"));
      Object.assign(game_state, _retrieved_state);
    }
  };

  const saveGameState = () => {
    localStorage.setItem("game_state", JSON.stringify(game_state));
  };

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
        "Enter your guess (between 1 and 100) \n Enter 'q' to quit: \n Click 'Cancel' to quit"
      );

      if (input === null || input.toLowerCase() === "q") {
        console.log("You have chosen to quit the game.");
        return null;
      }

      if (/^\d+$/.test(input.trim())) {
        guess = parseInt(input.trim(), 10);
        if (guess >= 1 && guess <= 100) {
          isValid = true;
        } else {
          console.log("Invalid input. Please enter a number between 1 and 100.");
        }
      } else {
        console.log("Invalid input. Please enter a valid number.");
      }
    }

    return guess;
  };

  const gameLoopStart = () => {
    let begin_game = confirm(
      "Welcome to my guessing game. I have chosen a number from 1-100 inclusive. You have 10 tries to guess it. Are you ready?"
    );

    if (begin_game) {
      game_state.in_progress = true;
      game_state.game_quitted = false;
      saveGameState();
      gameLoop();
    } else {
      gameLoopStart();
    }
  };

  const gameLoopGuess = () => {
    if (game_state.game_turn < MAX_TURNS && !game_state.game_won) {
      game_state.game_turn++;
      console.log(`++++++++++ This is turn number ${game_state.game_turn} +++++++++++++++++`);

      let _current_guess = getPlayerGuess();

      if (_current_guess === null) {
        game_state.game_turn--;
        game_state.game_quitted = true;
        saveGameState();
        gameLoopQuit();
        return;
      }

      game_state.current_guess = _current_guess;
      game_state.guess_sequence[game_state.game_turn - 1] = _current_guess;

      const check_string = checkGuess(game_state.current_guess, game_state.target_number);

      if (check_string === "correct") {
        console.log(`You did it!! The computer chose ${game_state.target_number} and on turn ${game_state.game_turn} you guessed ${game_state.current_guess}. Well done!!`);
        game_state.game_won = true;
      } else if (check_string === "too high") {
        console.log(`Your guess is too high. You have ${MAX_TURNS - game_state.game_turn} tries left`);
      } else {
        console.log(`Your guess is too low. You have ${MAX_TURNS - game_state.game_turn} tries left`);
      }

      saveGameState();

      if (!game_state.game_won && game_state.game_turn < MAX_TURNS) {
        setTimeout(gameLoopGuess, 0);
      } else if (!game_state.game_won) {
        console.log(`You are out of turns!! The correct number was ${game_state.target_number}. Better luck next time!!`);
        localStorage.removeItem("game_state");
      } else {
        console.log("Congratulations on winning the game!!");
        localStorage.removeItem("game_state");
      }
    }
  };

  const gameLoopQuit = () => {
    let resume = confirm("You have quit the game.  Click 'OK' to resume your last game or Cancel to end the game.");
    if (resume) {
      game_state.game_quitted = false;
      game_state.in_progress = true;
      saveGameState();
      gameLoopGuess();
    } else {
      console.log("Game ended.");
    }
  };

  const gameLoop = () => {
    if (!game_state.in_progress) {
      gameLoopStart();
    } else if (game_state.in_progress && !game_state.game_quitted) {
      gameLoopGuess();
    } else if (game_state.game_quitted) {
      gameLoopQuit();
    }
  };

  initializeGameState();
  gameLoop();
}

// gameEngine replaces the basic 1 turn. Invoke the engine to play the game
gameEngine();