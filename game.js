exports = typeof window !== "undefined" && window !== null ? window : global;

exports.Game = function () {
  const CATEGORIES = {
    POP: "Pop",
    SCIENCE: "Science",
    SPORTS: "Sports",
    ROCK: "Rock",
  };

  const NB_CELLS = 12

  let players = new Array();
  let places = new Array(6);
  let purses = new Array(6);
  let inPenaltyBox = new Array(6);

  let popQuestions = new Array();
  let scienceQuestions = new Array();
  let sportsQuestions = new Array();
  let rockQuestions = new Array();

  let currentPlayer = 0;
  let isGettingOutOfPenaltyBox = false;

  let currentPosition = function () {
    return places[currentPlayer]
  }

  let currentCategory = function () {
    if (currentPosition() == 0) return CATEGORIES.POP;
    if (currentPosition() == 4) return CATEGORIES.POP;
    if (currentPosition() == 8) return CATEGORIES.POP;
    if (currentPosition() == 1) return CATEGORIES.SCIENCE;
    if (currentPosition() == 5) return CATEGORIES.SCIENCE;
    if (currentPosition() == 9) return CATEGORIES.SCIENCE;
    if (currentPosition() == 2) return CATEGORIES.SPORTS;
    if (currentPosition() == 6) return CATEGORIES.SPORTS;
    if (currentPosition() == 10) return CATEGORIES.SPORTS;
    return CATEGORIES.ROCK;
  };

  for (let i = 0; i < 50; i++) {
    popQuestions.push("Pop Question " + i);
    scienceQuestions.push("Science Question " + i);
    sportsQuestions.push("Sports Question " + i);
    rockQuestions.push("Rock Question " + i);
  }

  this.add = function (playerName) {
    players.push(playerName);
      places[players.length - 1] = 0;
      purses[players.length - 1] = 0;
      inPenaltyBox[players.length - 1] = false;

      console.log(playerName + " was added");
      console.log("There are " + players.length + " players");
  };

  let askQuestion = function (category) {
    if (category == CATEGORIES.POP) 
      return popQuestions.shift()
    else if (category == CATEGORIES.SCIENCE)
      return scienceQuestions.shift();
    else if (category == CATEGORIES.SPORTS)
      return sportsQuestions.shift();
    else 
      return rockQuestions.shift();
  };

  let move = function (position) {
    places[currentPlayer] = (currentPosition() + position) % NB_CELLS;
  }

  this.roll = function (roll) {
    let playerName = players[currentPlayer];
    console.log(playerName + " is the current player");
    console.log("They have rolled a " + roll);

    if (inPenaltyBox[currentPlayer]) {
      if (roll % 2 != 0) {
        isGettingOutOfPenaltyBox = true;

        console.log(playerName + " is getting out of the penalty box");
        move(roll)

        console.log(playerName + "'s new location is " + currentPosition());
        console.log("The category is " + currentCategory());
        console.log(askQuestion(currentCategory()));
      } else {
        console.log(playerName + " is not getting out of the penalty box");
        isGettingOutOfPenaltyBox = false;
      }
    } else {
      move(roll)

      console.log(playerName + "'s new location is " + currentPosition());
      console.log("The category is " + currentCategory());
      console.log(askQuestion(currentCategory()));

    }
  };

  let nextPlayer = function() {
    return (currentPlayer + 1) % players.length;
  }

  let hasWon = function() {
    return purses[currentPlayer] != 6;
  }

  this.wasCorrectlyAnswered = function () {
    if (inPenaltyBox[currentPlayer]) {
      if (isGettingOutOfPenaltyBox) {
        console.log("Answer was correct!!!!");
        purses[currentPlayer] += 1;
        console.log(players[currentPlayer] + " now has " + purses[currentPlayer] + " Gold Coins.");

        let gameContinues = !hasWon();
        nextPlayer();

        return gameContinues;
      } else {
        newtPlayer()
        return true;
      }
    } else {
      console.log("Answer was correct!!!!");

      purses[currentPlayer] += 1;
      console.log(players[currentPlayer] + " now has " + purses[currentPlayer] + " Gold Coins.");

      let gameContinues = !hasWon();
      nextPlayer();

      return gameContinues;
    }
  };

  this.wrongAnswer = function () {
    console.log("Question was incorrectly answered");
    console.log(players[currentPlayer] + " was sent to the penalty box");
    inPenaltyBox[currentPlayer] = true;

    nextPlayer()
    return true;
  };
};

let notAWinner = false;

let game = new Game();

game.add(["Chet", "Pat", "Sue"]);


do {
  game.roll(Math.floor(Math.random() * 6) + 1);

  if (Math.floor(Math.random() * 10) == 7) {
    notAWinner = game.wrongAnswer();
  } else {
    notAWinner = game.wasCorrectlyAnswered();
  }
} while (notAWinner);
