function gameEngine() {

  const MAX_TURNS = 10;

  //helper function to improve interaction with the HARD_SYMBOL_TABLE
  function toSixDigitString(input) {
    // Convert the input to a string if it's not already
    let strInput = input.toString();

    // Pad the string with leading zeros to ensure it's 6 digits long
    return strInput.padStart(6, '0');
  }

  const HARD_SYMBOL_TABLE = {
    "000000": "010788",
    "000001": "801946",
    "000002": "636632",
    "000003": "299066",
    "000004": "806359",
    "000005": "826810",
    "000006": "539657",
    "000007": "162954",
    "000008": "901446",
    "000009": "846912",
    "000010": "296312",
    "000011": "809320",
    "000012": "755328",
    "000013": "024654",
    "000014": "170379",
    "000015": "248296",
    "000016": "652675",
    "000017": "387042",
    "000018": "552953",
    "000019": "354580",
    "000020": "268782",
    "000021": "515696",
    "000022": "223047",
    "000023": "055950",
    "000024": "497522",
    "000025": "441322",
    "000026": "169954",
    "000027": "741807",
    "000028": "259112",
    "000029": "806457",
    "000030": "098069",
    "000031": "870050",
    "000032": "735888",
    "000033": "568930",
    "000034": "669135",
    "000035": "542967",
    "000036": "450322",
    "000037": "361595",
    "000038": "424434",
    "000039": "678736",
    "000040": "598212",
    "000041": "223823",
    "000042": "982621",
    "000043": "317143",
    "000044": "941421",
    "000045": "349617",
    "000046": "023809",
    "000047": "913694",
    "000048": "165643",
    "000049": "620016",
    "000050": "125317",
    "000051": "291363",
    "000052": "798615",
    "000053": "271865",
    "000054": "489330",
    "000055": "753299",
    "000056": "267495",
    "000057": "572185",
    "000058": "293140",
    "000059": "714675",
    "000060": "457912",
    "000061": "525958",
    "000062": "856951",
    "000063": "684743",
    "000064": "240646",
    "000065": "517022",
    "000066": "017150",
    "000067": "112407",
    "000068": "676261",
    "000069": "713585",
    "000070": "661342",
    "000071": "917664",
    "000072": "551678",
    "000073": "449945",
    "000074": "289459",
    "000075": "172229",
    "000076": "826302",
    "000077": "999377",
    "000078": "660137",
    "000079": "094112",
    "000080": "452571",
    "000081": "225651",
    "000082": "617266",
    "000083": "093855",
    "000084": "031511",
    "000085": "009583",
    "000086": "822462",
    "000087": "129827",
    "000088": "887432",
    "000089": "080394",
    "000090": "980766",
    "000091": "143075",
    "000092": "692846",
    "000093": "786240",
    "000094": "893307",
    "000095": "703026",
    "000096": "735160",
    "000097": "015289",
    "000098": "270252",
    "000099": "168697",
    "000100": "541530",
    "000101": "217307",
    "000102": "688678",
    "000103": "226041",
    "000104": "262597",
    "000105": "929215",
    "000106": "294913",
    "000107": "586401",
    "000108": "958810",
    "000109": "012647",
    "000110": "754294",
    "000111": "523812",
    "000112": "829545",
    "000113": "682734",
    "000114": "628884",
    "000115": "511786",
    "000116": "115511",
    "000117": "555555",
    "000118": "666666",
    "000119": "777777"
  }

  const GAME_STATE_VARIABLES_MAPPINGS = {
    "target_number": "000109",
    "game_turn": "000110",
    "current_guess": "000111",
    "guess_sequence": "000112",
    "message_log": "000113",
    "in_progress": "000114",
    "game_quitted": "000115",
    "game_won": "000116",
    "true": "000117",
    "false": "000118",
    "null": "000119"
  };

  // programmatically load 0 to 100
  for (let i=0; i<101; i++){
    formatted_index = toSixDigitString(i);
    GAME_STATE_VARIABLES_MAPPINGS[formatted_index] = formatted_index;
  }

  const game_state = {
    target_number: 0,
    game_turn: 0,
    current_guess: 0,
    guess_sequence: [],
    message_log: [],
    in_progress: false,
    game_quitted: false,
    game_won: false,
  };

  const reset_game_state = {
    target_number: 0,
    game_turn: 0,
    current_guess: 0,
    guess_sequence: [],
    message_log: [],
    in_progress: false,
    game_quitted: false,
    game_won: false,
  };

  const validateGameStateInLocalStorage = () => {
    const invalid_keys = [];
    const gameStateDefaults = JSON.parse(JSON.stringify(game_state)); // Default values

    const requiredKeys = [
      "target_number",
      "game_turn",
      "current_guess",
      "guess_sequence",
      "message_log",
      "in_progress",
      "game_quitted",
      "game_won"
  ];

    requiredKeys.forEach((key) => {
        const obfuscatedKeyIndex = GAME_STATE_VARIABLES_MAPPINGS[key];
        const obfuscatedKey = HARD_SYMBOL_TABLE[obfuscatedKeyIndex];
        const storedValue = localStorage.getItem(obfuscatedKey);

        let isValid = true;

        if (storedValue === null) {
            console.warn(`Missing key: ${key}`);
            isValid = false;
        } else {
            try {
                let parsedValue = storedValue;

                if (typeof gameStateDefaults[key] === "object") {
                    parsedValue = JSON.parse(storedValue);
                }

               a if (typeof parsedValue === "object") {
                    if (JSON.stringify(parsedValue) !== JSON.stringify(gameStateDefaults[key])) {
                        console.warn(`Value mismatch for key: ${key}`);
                        isValid = false;
                    }
                } else if (parsedValue !== gameStateDefaults[key]) {
                    console.warn(`Value mismatch for key: ${key}`);
                    isValid = false;
                }
            } catch (e) {
                console.warn(`Failed to parse JSON for key: ${key}`, e);
                isValid = false;
            }
        }

        if (!isValid) {
            invalid_keys.push(key);
        }
    });

    return invalid_keys;
};


const repairGameStateInLocalStorage = (invalid_keys) => {
  const gameStateDefaults = JSON.parse(JSON.stringify(game_state)); // Default values

  invalid_keys.forEach((key) => {
      const obfuscatedKeyIndex = GAME_STATE_VARIABLES_MAPPINGS[key];
      const obfuscatedKey = HARD_SYMBOL_TABLE[obfuscatedKeyIndex];
      const defaultValue = gameStateDefaults[key];

      let obfuscatedValueIndex;

      if (typeof defaultValue === "object") {
          localStorage.setItem(obfuscatedKey, JSON.stringify(defaultValue));
      } else if (typeof defaultValue === "boolean") {
          obfuscatedValueIndex = GAME_STATE_VARIABLES_MAPPINGS[defaultValue.toString()];
          const obfuscatedValue = HARD_SYMBOL_TABLE[obfuscatedValueIndex];
          localStorage.setItem(obfuscatedKey, obfuscatedValue);
      } else if (typeof defaultValue === "number") {
          obfuscatedValueIndex = GAME_STATE_VARIABLES_MAPPINGS[toSixDigitString(defaultValue)];
          const obfuscatedValue = HARD_SYMBOL_TABLE[obfuscatedValueIndex];
          localStorage.setItem(obfuscatedKey, obfuscatedValue);
      } else {
          localStorage.setItem(obfuscatedKey, defaultValue);
      }

      console.log(`Repaired key: ${key}`);
  });
};

  const validateAndRepairGameState = () => {

    if (game_state.game_won === true){

      Object.assign(game_state, reset_game_state);
      saveGameStateInLocalStorage();

    } else {
      let invalid_keys = validateGameStateInLocalStorage();

      if (invalid_keys.length > 0){
        console.warn("Local storage validation failed. Attempting to repair...");
    
        let repair_attempts = 0;
        const MAX_ATTEMPTS = 5;
    
        while ((invalid_keys > 0) && (repair_attempts < MAX_ATTEMPTS)){
          repairGameStateInLocalStorage(invalid_keys);
          invalid_keys = validateGameStateInLocalStorage();
          repair_attempts++;
        };
      }
    }
  };

  const saveGameStateInLocalStorage = () => {
 
    for (let key in game_state) {
      // Map the key to its corresponding variable in the mappings
      const obfuscated_key_index = GAME_STATE_VARIABLES_MAPPINGS[key.toString()];
      const obfuscated_key = HARD_SYMBOL_TABLE[obfuscated_key_index];

      // Map the value to its corresponding value in the mappings
      let value = game_state[key.toString()];
      // Handle arrays or objects by serializing them
      if (Array.isArray(value) || typeof value === 'object') {
        localStorage.setItem(obfuscated_key, value);  // Direct storage without mapping.
      } else if (typeof value === "boolean"){
          const obfuscated_value_index = GAME_STATE_VARIABLES_MAPPINGS[value.toString()];
          const obfuscated_value = HARD_SYMBOL_TABLE[obfuscated_value_index];
          // Save the obfuscated key-value pair to localStorage
          localStorage.setItem(obfuscated_key, obfuscated_value);
 
      } else if ((value <= 100) && (value >= 0)){
        const obfuscated_value_index = GAME_STATE_VARIABLES_MAPPINGS[toSixDigitString(value)];
        const obfuscated_value = HARD_SYMBOL_TABLE[obfuscated_value_index] // || value;

        // Save the obfuscated key-value pair to localStorage
        localStorage.setItem(obfuscated_key, obfuscated_value);
      } 
    }
    
  };

  const isGameStateCompleteInLocalStorage = () => {

    // Define the specific keys we want to check for
    const requiredKeys = [
      "target_number",
      "game_turn",
      "current_guess",
      "guess_sequence",
      "message_log",
      "in_progress",
      "game_quitted",
      "game_won"
  ];


    for (let key of requiredKeys) {
      // Get the obfuscated key
      const obfuscated_key_index = GAME_STATE_VARIABLES_MAPPINGS[key];
      const obfuscated_key = HARD_SYMBOL_TABLE[obfuscated_key_index];
      
      // Check if the obfuscated key exists in localStorage
      if (localStorage.getItem(obfuscated_key) === null) {
          return false;  // Return false immediately if any key is missing
      }
    }
    return true;  // Return true if all keys are present
  };

  const restoreGameState = () => {
    const restored_game_state = {};

    // Define the specific keys we want to check for
    const requiredKeys = [
      "target_number",
      "game_turn",
      "current_guess",
      "guess_sequence",
      "message_log",
      "in_progress",
      "game_quitted",
      "game_won"
    ];

    for (let value of requiredKeys) {
      
      // Get the obfuscated key index
      const obfuscated_key_index = GAME_STATE_VARIABLES_MAPPINGS[value];
      const obfuscated_key = HARD_SYMBOL_TABLE[obfuscated_key_index];

     
      // Retrieve the value from localStorage
      const storedValue = localStorage.getItem(obfuscated_key);
      let originalValue;

      if (storedValue !== null) {
        // Attempt to find the original value by reversing the HARD_SYMBOL_TABLE
        let reverseLookupKey = Object.keys(HARD_SYMBOL_TABLE).find(
          k => HARD_SYMBOL_TABLE[k] === storedValue
        );

        // If a mapping is found in HARD_SYMBOL_TABLE, use it
        if (reverseLookupKey !== undefined) {
          if (reverseLookupKey === "000117") {
            originalValue = true;
          } else if (reverseLookupKey === "000118") {
            originalValue = false;
          } else if (reverseLookupKey === "000119") {
            originalValue = null;
          } else if (!isNaN(reverseLookupKey)) {
            originalValue = parseInt(reverseLookupKey);
          }
        } else {
          // If no reverse mapping found, assume storedValue is directly stored (e.g., JSON string)
          originalValue = storedValue;

          // Attempt to parse JSON strings back to arrays or objects
          try {
            if (typeof originalValue === 'string' && (originalValue.startsWith('{') || originalValue.startsWith('['))) {
              originalValue = JSON.parse(originalValue);
            }
          } catch (e) {
            console.warn(`Failed to parse JSON for key ${key}:`, e);
          }
        }
      }

      // Assign the original value back to the key in the restored game state
      restored_game_state[value] = originalValue;
    }

    // Assign the restored values to the game_state object
    Object.assign(game_state, restored_game_state);
  };

  const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };


  const initializeGameState = () => {
    if (game_state.game_turn > 0) {
      restoreGameState();
    } else {
      game_state.target_number = generateRandomNumber(1, 100);
      saveGameStateInLocalStorage();
    }
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

   // sanitize begin_game to protect against script attacks!!

    if (begin_game) {
      game_state.in_progress = true;
      game_state.game_quitted = false;
      saveGameStateInLocalStorage();
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
        saveGameStateInLocalStorage();
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
        console.log(`Your guess of ${game_state.current_guess} is too high. You have ${MAX_TURNS - game_state.game_turn} tries left`);
      } else {
        console.log(`Your guess of ${game_state.current_guess} is too low. You have ${MAX_TURNS - game_state.game_turn} tries left`);
      }

      saveGameStateInLocalStorage();

      if (!game_state.game_won && game_state.game_turn < MAX_TURNS) {
        setTimeout(gameLoopGuess, 0);  //allows the console to be seen
      } else if (!game_state.game_won) {
        console.log(`You are out of turns!! The correct number was ${game_state.target_number}. Better luck next time!!`);
        Object.assign(game_state, reset_game_state);
        saveGameStateInLocalStorage()

      } else {
        console.log("Congratulations on winning the game!! Press F5 if you want to start a new game");
        Object.assign(game_state, reset_game_state);
        saveGameStateInLocalStorage();
      }
    }
  };

  const gameLoopQuit = () => {
    let resume = confirm("You have quit the game.  Click 'OK' to resume your last game or Cancel to end the game.");
    //sanitize resume befor it is used!!!
    if (resume === true) {
      game_state.game_quitted = false;
      game_state.in_progress = true;
      saveGameStateInLocalStorage();
      gameLoopGuess();
    } else {
      game_state.game_quitted = true;
      game_state.in_progress = true;
      saveGameStateInLocalStorage();
      console.log("Game ended.  You may press F5 to resume your last game");
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

  const addUnloadListener = () => {

    // Remove the event listener if it already exists to avoid duplicates
    window.removeEventListener('beforeunload', validateAndRepairGameState);

    // Add the event listener again
    window.addEventListener('beforeunload', validateAndRepairGameState);
  };

  addUnloadListener();
  initializeGameState();
  gameLoop();
};

// gameEngine replaces the basic 1 turn. Invoke the engine to play the game
gameEngine();