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
  diceRollsArr = diceRollsArr.sort().reverse();
  var finalNumber = Number(diceRollsArr.join(""));
  //diceRollsForEachPlayerArr.push(finalNumber);
  // Keep score
  if (!playersRunningTotal[currPlayer]) {
    playersRunningTotal[currPlayer] = finalNumber;
  } else {
    playersRunningTotal[currPlayer] += finalNumber;
  }
  console.log(playersRunningTotal);
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
  leaderBoardOutPut += `<br>The current leader is Player ${currLeader + 1}!`;
  return leaderBoardOutPut;
};

var numOfPlayers = 0;
var playersRolledArr = [];
var currPlayer = 0;
var numOfDice = 0;
var diceRollsForEachPlayerArr = [];
var playersRunningTotal = [];

var main = function (input) {
  if (!playersRolledArr.length && !input) {
    return `Please select number of players.`;
  } else if (!playersRolledArr.length && input) {
    numOfPlayers = input;
    playersRolledArr = initPlayersRolledArr(input);
    return `${numOfPlayers} players selected.<br>Please input the number of dice each player will roll.`;
  } else if (playersRolledArr.length && !numOfDice && input) {
    numOfDice = input;
    return `Using ${numOfDice} dice. Click Submit to roll!`;
  } else if (playersRolledArr.length && numOfDice && !input) {
    var rollMsg = rollDiceStr(numOfDice);
    rollMsg = `Player ${currPlayer + 1},<br>` + rollMsg;
    playersRolledArr[currPlayer] = true;
    currPlayer = (currPlayer + 1) % numOfPlayers;
    rollMsg += `<br>Player ${
      (currPlayer % numOfPlayers) + 1
    }, click Submit to roll.`;

    return rollMsg;
  }
};
