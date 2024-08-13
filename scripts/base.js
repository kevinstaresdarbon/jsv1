// check linking
console.dir("base.js runs");

// define utilities

function gameEngine() {
  // get and set functions
  const getGameState = () => {
    let _game_state = JSON.parse(JSON.stringify(game_state));
    return _game_state;
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
        alert("The game has been paused. Thank you for playing!");
        game_state.game_won = false;
        game_state.in_progress = false;
        game_state.quitted = true;
        return null;
      }

      // Handle case where input is 'q' or 'Q'
      if (input.toLowerCase() === "q") {
        console.log("You have chosen to quit the game.");
        alert("The game has been paused. Thank you for playing!");
        game_state.game_won = false;
        game_state.in_progress = false;
        game_state.quitted = true;
        return null;
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

  const gameLoopStart = () => {
    let begin_game =
    confirm(
      "Welcome to my guessing game. I have chosen a number from 1-100 inclusive. You have 10 tries to guess it. Are you ready?"
    );

    game_state.in_progress = begin_game;
    game_state.game_quitted = !begin_game;

    gameLoop();
  }

  const gameLoopGuess = () => {
    setTimeout(() => {
      if (game_state.game_turn < MAX_TURNS) {

        game_state.game_turn++;

        console.log(
          `++++++++++ This is turn number ${game_state.game_turn} +++++++++++++++++`
        );

        game_state.current_guess = getPlayerGuess();

        if (game_state.current_guess === null) {   //need to implement a better handler for restarting / resuming the game
          return;
        }

        if (game_state.game_quitted)

        game_state.guess_sequence[game_state.game_turn - 1] = game_state.current_guess;

        const check_string = checkGuess(
          game_state.current_guess,
          game_state.target_number
        );

        if (check_string === "correct") {
          console.log(
            `You did it!! The computer chose ${game_state.target_number}
            and on turn ${game_state.game_turn} you guessed ${game_state.current_guess}. 
            Well done!!`
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
            localStorage.setItem("game_state", JSON.stringify(game_state));  //save the current game_state before recursing the loop 
            gameLoop();
          } else {
            console.log(
              `You are out of turns!! You failed to guess the correct number, which was ${game_state.target_number}`
            );
            console.log(`Better luck next time!!`);
            localStorage.removeItem("game_state");
          }
        } else {
            console.log("Congratulations on winning the game!!");
            localStorage.removeItem("game_state");
        }
      }
    }, 0);
  }

  const gameLoopQuit = () => {
    let resume = confirm("You have quitted the game.  Click 'OK' to resume your last game or click 'Cancel' to restart from scratch");
    if (resume) {
      game_state.game_quitted = false;
      game_state.in_progress = true;
      gameLoop();
    } else {
      localStorage.removeItem("game_state");
      gameEngine();
    }
  }

  const gameLoop = () => {
    if (game_state.in_progress === false) {
      gameLoopStart();
    };

    if (game_state.in_progress){
      gameLoopGuess();
    }

    if (game_state.game_quitted){
      gameLoopQuit();
    }
  };
  
  // initialisation
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

  if (localStorage.getItem("game_state") === null ){     //no game_state stored in localStorage - must be a new game - set localStorage for a new game
    game_state.target_number = generateRandomNumber(1, 100);
    localStorage.setItem("game_state", JSON.stringify(game_state))
  } else {                                              //game_state found so restore the internal game_state variable
    const _retrieved_state = JSON.parse(localStorage.getItem("game_state"));
    game_state.target_number = _retrieved_state.target_number;
    game_state.game_turn = _retrieved_state.game_turn;
    game_state.current_guess = _retrieved_state.current_guess;
    game_state.guess_sequence = _retrieved_state.guess_sequence;
    game_state.message_log = _retrieved_state.message_log;
    game_state.in_progress = _retrieved_state.in_progress;
    game_state.game_quitted = _retrieved_state.game_quitted;
    game_state.game_won = _retrieved_state.game_won;
  }

  // run the recursing game loop
  gameLoop();
};

// gameEngine replaces the basic 1 turn. Invoke the engine to play the game
gameEngine();
