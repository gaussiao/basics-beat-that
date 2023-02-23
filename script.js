// Reusing, once again, my customised random number generator
var rand = function (lower, upper, inclusiveBoth) {
  var range = upper - lower;
  var randRange;
  if (inclusiveBoth) {
    randRange = Math.random() * (range + 1) + lower;
  } else {
    randRange = Math.random() * range + lower;
  }
  var randInt = Math.floor(randRange);
  return randInt;
};

// rolls all the dice, and outputs the optimal number
var rollDiceStr = (noOfDice) => {
  var diceRollsArr = [];
  var msg = ``;
  for (var count = 0; count < noOfDice; count += 1) {
    var currRoll = rand(1, 6, true);
    diceRollsArr.push(currRoll);
    msg += `You rolled ${currRoll} for dice ${count + 1}.<br>`;
  }
  if (lowestScoreWins) {
    diceRollsArr = diceRollsArr.sort();
  } else {
    diceRollsArr = diceRollsArr.sort().reverse();
  }
  var finalNumber = Number(diceRollsArr.join(""));

  // Keep score
  if (!playersRunningTotal[currPlayer]) {
    playersRunningTotal[currPlayer] = finalNumber;
  } else {
    playersRunningTotal[currPlayer] += finalNumber;
  }

  msg += `<br>Your number is ${finalNumber}<br>`;
  msg += `${leaderBoard(playersRunningTotal)}`;

  return msg;
};

var initPlayersRolledArr = (numOfPlayers) => {
  for (count = 0; count < numOfPlayers; count += 1) {
    playersRolledArr.push(false);
  }
  return playersRolledArr;
};

var leaderBoard = (arr) => {
  var leaderBoardOutPut = "<br>Leaderboard:<br>";
  var temp = [];
  for (var count = 0; count < arr.length; count += 1) {
    temp.push(playersRunningTotal[count]);
  }

  if (lowestScoreWins) {
    for (var count = 0; count < arr.length; count += 1) {
      var currMin = Math.min(...temp);
      var playerWithCurrMin = temp.indexOf(currMin);
      if (count == 0) {
        var currLeader = playerWithCurrMin;
      }
      leaderBoardOutPut += `${count + 1}. Player ${
        playerWithCurrMin + 1
      }: ${currMin}<br>`;
      temp[playerWithCurrMin] = Number.MAX_VALUE;
    }
  } else {
    for (var count = 0; count < arr.length; count += 1) {
      var currMax = Math.max(...temp);
      var playerWithCurrMax = temp.indexOf(currMax);

      if (count == 0) {
        var currLeader = playerWithCurrMax;
      }

      leaderBoardOutPut += `${count + 1}. Player ${
        playerWithCurrMax + 1
      }: ${currMax}<br>`;
      temp[playerWithCurrMax] = 0;
    }
  }
  leaderBoardOutPut += `<br>The current leader is Player ${currLeader + 1}!`;
  return leaderBoardOutPut;
};

// Knockoutmode ------------------------------------

var playKnockout = (numOfPlayers, numOfDice) => {
  //helper function to select 2 players for pvp
  var selectPlayers = (playersArr) => {
    // selects 2 players to pvp. player can't play himself
    // hardcode 2 for pvp pairs
    while (pvpSelectedPlayers.length < 2) {
      var temp = playersArr[rand(0, playersArr.length, false)];

      if (!pvpSelectedPlayers.includes(temp)) {
        pvpSelectedPlayers.push(temp);
      }
    }
    currPvpPlayer = pvpSelectedPlayers[0];
    var msg = `Players ${pvpSelectedPlayers[0] + 1} and ${
      pvpSelectedPlayers[1] + 1
    } are selected to play.<br>`;
    return msg;
  };
  if (!pvpAllPlayers.length) {
    for (var count = 0; count < numOfPlayers; count += 1) {
      pvpAllPlayers.push(count);
    }
  }

  // Initialise all scores at 0
  var selectedPlayersMsg = selectPlayers(pvpAllPlayers);

  for (var count; count < numOfPlayers; count += 1) {
    pvpSelectedPlayersScores.push(0);
  }
  return selectedPlayersMsg + pvpRollDice(numOfDice);
};

var pvpRollDice = (numOfDice) => {
  var rollResult = `Player ${currPvpPlayer + 1}:<br>`;

  var rollArr = [];
  for (var count = 0; count < numOfDice; count += 1) {
    var currRoll = rand(1, 6, true);

    rollArr.push(currRoll);
    rollResult += `You rolled ${currRoll} for Dice ${count + 1}<br>`;
  }
  if (lowestScoreWins) {
    var optimisedRollResult = Number(rollArr.sort().join(""));
  } else {
    var optimisedRollResult = Number(rollArr.sort().reverse().join(""));
  }

  if (!pvpSelectedPlayersScores.length) {
    // can't determine winner

    pvpSelectedPlayersScores.push(optimisedRollResult);
    optimisedRollResult = `<br>Your number is ${optimisedRollResult}`;
    currPvpPlayer = pvpSelectedPlayers[1];
    return (
      rollResult +
      optimisedRollResult +
      `<br>It's now Player ${currPvpPlayer + 1}'s turn.`
    );
  } else if (pvpSelectedPlayersScores.length == 1) {
    pvpSelectedPlayersScores.push(optimisedRollResult);
    optimisedRollResult = `Your number is ${optimisedRollResult}<br><br>`;
    var winnerMsg = determineWinner();
    return rollResult + optimisedRollResult + winnerMsg;
  }
};

var determineWinner = () => {
  // Simplify eliminate so that it fits only 2 players
  if (pvpSelectedPlayersScores[0] == pvpSelectedPlayersScores[1]) {
    var drawMsg = `Both Player ${pvpSelectedPlayers[0] + 1} & Player ${
      pvpSelectedPlayers[1] + 1
    } scored ${
      pvpSelectedPlayersScores[0]
    }! It's a draw. Click Submit to roll again.`;
    pvpSelectedPlayersScores = [];
    return drawMsg;
  }
  if (lowestScoreWins) {
    var winner =
      pvpSelectedPlayers[
        pvpSelectedPlayersScores[0] < pvpSelectedPlayersScores[1] ? 0 : 1
      ];
    var eliminated =
      pvpSelectedPlayers[
        pvpSelectedPlayersScores[0] < pvpSelectedPlayersScores[1] ? 1 : 0
      ];
    var eliminatedMsg = `<br>Player ${eliminated + 1} is eliminated.`;

    var summaryOfEachPlayerRoll = `Player ${
      pvpSelectedPlayers[0] + 1
    }'s number is ${pvpSelectedPlayersScores[0]}.<br>Player ${
      pvpSelectedPlayers[1] + 1
    }'s number is ${pvpSelectedPlayersScores[1]}.<br> `;
    var winnerMsg = `<br>The winner is Player ${winner + 1}!`;
    var finalMsg = summaryOfEachPlayerRoll + winnerMsg + eliminatedMsg;
  } else {
    var winner =
      pvpSelectedPlayers[
        pvpSelectedPlayersScores[0] > pvpSelectedPlayersScores[1] ? 0 : 1
      ];
    var eliminated =
      pvpSelectedPlayers[
        pvpSelectedPlayersScores[0] > pvpSelectedPlayersScores[1] ? 1 : 0
      ];

    var winnerMsg = `<br>The winner is Player ${winner + 1}!`;
    var eliminatedMsg = ` Player ${eliminated + 1} is eliminated.`;
    var summaryOfEachPlayerRoll = `Player ${
      pvpSelectedPlayers[0] + 1
    }'s number is ${pvpSelectedPlayersScores[0]}.<br>Player ${
      pvpSelectedPlayers[1] + 1
    }'s number is ${pvpSelectedPlayersScores[1]}.<br> `;
    var finalMsg = summaryOfEachPlayerRoll + winnerMsg + eliminatedMsg;
  }

  // repopulating remaining players
  pvpAllPlayersAfterElimination = [];
  for (var count = 0; count < pvpAllPlayers.length; count += 1) {
    if (pvpAllPlayers[count] != eliminated) {
      pvpAllPlayersAfterElimination.push(pvpAllPlayers[count]);
    }
  }

  pvpAllPlayers = pvpAllPlayersAfterElimination;
  var pvpAllPlayersNonZeroIndexed = [];
  for (var count = 0; count < pvpAllPlayers.length; count += 1) {
    pvpAllPlayersNonZeroIndexed[count] = pvpAllPlayers[count] + 1;
  }
  var grandWinnerMsg = "";
  if (pvpAllPlayers.length == 1) {
    grandWinnerMsg = `<br><br>The final winner has emerged! Congratulations, Player ${
      pvpAllPlayers[0] + 1
    }!<br><br>Click Submit to play again.`;
    finalMsg += grandWinnerMsg;
    // resetting the game once winner has been determined
    numOfDice = 0;
    numOfPlayers = 0;
    pvpAllPlayers = [];
    numOfPvPPlayers = 0;
  } else {
    var remainingPlayersMsg = `<br><br>Remaining players: ${pvpAllPlayersNonZeroIndexed.join(
      " "
    )}`;
    finalMsg += remainingPlayersMsg;
  }

  currPvpPlayer = undefined;
  pvpSelectedPlayers = [];
  pvpSelectedPlayersScores = [];

  return finalMsg;
};

// Initial configuration
var numOfPlayers = 0;
var numOfDice = 0;
var lowestScoreWins = undefined;
var knockOutMode = undefined;

// score keeping, leaderboard
var playersRolledArr = [];
var currPlayer = 0;
var diceRollsForEachPlayerArr = [];
var playersRunningTotal = [];

var numOfPvPPlayers = 0;
var pvpAllPlayers = []; // grand total of all players
var pvpSelectedPlayers = []; // selected 2 players playing in a particular round
var pvpSelectedPlayersScores = [];
var currPvpPlayer = undefined;

var main = function (input) {
  if (!input) {
    if (!numOfPlayers) {
      return `Please select number of players.`;
    } else if (!numOfDice) {
      return `Please input the number of dice.`;
    } else if (lowestScoreWins == undefined) {
      return `Do you want the Highest or Lowest Score to win? Type 'highest' or 'lowest'.`;
    }
  }

  if (input) {
    if (!numOfPlayers) {
      numOfPlayers = input;
      playersRolledArr = initPlayersRolledArr(input);
      return `${numOfPlayers} players selected.<br>Please input the number of dice each player will roll.`;
    } else if (!numOfDice) {
      numOfDice = input;
      return `Using ${numOfDice} dice. Do you want the Highest or Lowest Score to win? Type 'highest' or 'lowest'.`;
    } else if (input == "h" || input == "l") {
      lowestScoreWins = input == "l";
      return `The ${input} score will win the round.<br>Finally, do you want to play this game in Knockout mode?Enter "y" for Knockout mode, or "n" for normal mode.`;
    } else if (input == "y" || input == "n") {
      knockOutMode = input == "y";
      return `${
        knockOutMode ? `We are in Knockout Mode.` : `We are in Normal Mode,`
      } Click Submit to start the game!`;
    }
  }

  // TBC
  else if (playersRolledArr.length && numOfDice && !knockOutMode && !input) {
    var rollMsg = rollDiceStr(numOfDice);
    rollMsg = `Player ${currPlayer + 1},<br>` + rollMsg;
    playersRolledArr[currPlayer] = true;
    currPlayer = (currPlayer + 1) % numOfPlayers;
    rollMsg += `<br>Player ${
      (currPlayer % numOfPlayers) + 1
    }, click Submit to roll.`;

    return rollMsg;
  } else if (playersRolledArr.length && numOfDice && knockOutMode && !input) {
    return playKnockout(numOfPlayers, numOfDice);
  }
};
