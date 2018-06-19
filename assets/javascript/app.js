//Initializes firebase app
var config = {
	apiKey: "AIzaSyB4Zz7VNo0UonmFbIpyjJqh41DNN8RrFQU",
	authDomain: "rockpaperscissors-938f4.firebaseapp.com",
	databaseURL: "https://rockpaperscissors-938f4.firebaseio.com",
	projectId: "rockpaperscissors-938f4",
	storageBucket: "",
	messagingSenderId: "624938628745"
};
firebase.initializeApp(config);
var database = firebase.database();
//Sets up variable names pushing to firebase
var playerTurn = database.ref();
var players = database.ref("/players");
var player1 = database.ref("/players/player1");
var player2 = database.ref("/players/player2");
// Global Variables
var player;
var p1snapshot;
var p2snapshot;
var p1result;
var p2result;
var p1 = null;
var p2 = null;
var wins1 = 0;
var wins2 = 0;
var losses1 = 0;
var losses2 = 0;
var playerNum = 0;
var chatting;

// Adds form to page asking players to enter their name.
$("#welcomeMessage").html("<input id=playerName type=text placeholder='Enter your name to begin'><input id=newPlayer type=submit class ='btn btn-danger' value=Start>");

// When the database is updated, do the following [Player 1 info]
player1.on("value", function (snapshot) {
	if (snapshot.val() !== null) {
		p1 = snapshot.val().player;
		wins1 = snapshot.val().wins;
		losses1 = snapshot.val().losses;
		$("#playerOneName").html("<h2>" + p1 + "</h2>");
		$("#playerOneWinLoss").html("<p>Wins: " + wins1 + "  Losses: " + losses1 + "</p>");
	} else {
		$("#playerOneName").html("Waiting for Player 1");
		$("#playerOneWinLoss").empty();
	};
}, function (errorObject) {
	console.log("The read failed: " + errorObject.code);
});

// When the database is updated, do the following [Player 2 info]
player2.on("value", function (snapshot) {
	if (snapshot.val() !== null) {
		p2 = snapshot.val().player;
		wins2 = snapshot.val().wins;
		losses = snapshot.val().losses;
		$("#playerTwoName").html("<h2>" + p2 + "</h2>");
		$("#playerTwoWinLoss").html("<p>Wins: " + wins2 + "  Losses: " + losses2 + "</p>");
	} else {
		$("#playerTwoName").html("Waiting for Player 2");
		$("#playerTwoWinLoss").empty();
	};
}, function (errorObject) {
	console.log("The read failed: " + errorObject.code);
});

// Assign players as 1 or 2...If 2 people are already playing, let them know!
$("#newPlayer").on("click", function () {
	event.preventDefault();
	player = $("#playerName").val().trim();
	player1.once("value", function (snapshot) {
		p1snapshot = snapshot;
	}, function (errorObject) {
		console.log("The read failed: " + errorObject.code);
	});
	player2.once("value", function (snapshot) {
		p2snapshot = snapshot;
	}, function (errorObject) {
		console.log("The read failed: " + errorObject.code);
	});
	if (!p1snapshot.exists()) { //If no one is playing, assign the person as Player 1 until they disconnect
		playerNum = 1;
		player1.onDisconnect().remove();
		player1.set({
			player: player,
			wins: 0,
			losses: 0
		});
		$("#welcomeMessage").html("Hi " + player + "! You are Player 1.");
		if (!p2snapshot.exists()) { //If only one person is playing, tell Player 1 they gotta wait...
			$("#gameMessage").html("Waiting for Player 2 to join...");
		};
	} else if (!p2snapshot.exists()) { //When someone else logs into play, assign them to player 2 until they disconnect
		playerNum = 2;
		player2.onDisconnect().remove();
		player2.set({
			player: player,
			wins: 0,
			losses: 0
		});
		playerTurn.update({ // Update the database turn count to start the game!
			turn: 1
		});
		$("#welcomeMessage").html("Hi " + player + "! You are Player 2.");
		$("#gameMessage").html("Waiting for " + p1 + " to choose.");
	} else { //If there are already two people playing, tell them that!
		$("#welcomeMessage").html("Sorry, the game is full! Try again later!");
	};
});

players.on("value", function (snapshot) { //If both players leave, reset the game!
	if (snapshot.val() == null) {
		playerTurn.set({});
	};
}, function (errorObject) {
	console.log("The read failed: " + errorObject.code);
});

var findResults = function () { //Grab the players' choices
	player1.once("value", function (snapshot) {
		p1result = snapshot;
	}, function (errorObject) {
		console.log("The read failed: " + errorObject.code);
	});
	player2.once("value", function (snapshot) {
		p2result = snapshot;
	}, function (errorObject) {
		console.log("The read failed: " + errorObject.code);
	});
	if (p1result.val() !== null && p2result.val() !== null) { //Game logic
		if (p1result.val().choice == p2result.val().choice) { //If they both choose the same thing
			$("#playerOneChoices").html("<h1>" + p1result.val().choice + "</h1>");
			$("#playerTwoChoices").html("<h1>" + p2result.val().choice + "</h1>");
			$("#gameMessage").html("<h1>Tie Game!</h1>");
		} else if (p1result.val().choice == "Rock" && p2result.val().choice == "Scissors") {//PlayerOne wins
			$("#playerOneChoices").html("<h1>" + p1result.val().choice + "</h1>");
			$("#playerTwoChoices").html("<h1>" + p2result.val().choice + "</h1>");
			$("#gameMessage").html("<h1>" + p1 + " wins!</h1>");
			wins1++;
			losses2++;
		} else if (p1result.val().choice == "Paper" && p2result.val().choice == "Rock") {//PlayerOne wins
			$("#playerOneChoices").html("<h1>" + p1result.val().choice + "</h1>");
			$("#playerTwoChoices").html("<h1>" + p2result.val().choice + "</h1>");
			$("#gameMessage").html("<h1>" + p1 + " wins!</h1>");
			wins1++;
			losses2++;
		} else if (p1result.val().choice == "Scissors" && p2result.val().choice == "Paper") {//PlayerOne wins
			$("#playerOneChoices").html("<h1>" + p1result.val().choice + "</h1>");
			$("#playerTwoChoices").html("<h1>" + p2result.val().choice + "</h1>");
			$("#gameMessage").html("<h1>" + p1 + " wins!</h1>");
			wins1++;
			losses2++;
		} else if (p1result.val().choice == "Rock" && p2result.val().choice == "Paper") {//PlayerTwo wins
			$("#playerOneChoices").html("<h1>" + p1result.val().choice + "</h1>");
			$("#playerTwoChoices").html("<h1>" + p2result.val().choice + "</h1>");
			$("#gameMessage").html("<h1>" + p2 + " wins!</h1>");
			wins2++;
			losses1++;
		} else if (p1result.val().choice == "Paper" && p2result.val().choice == "Scissors") {//PlayerTwo wins
			$("#playerOneChoices").html("<h1>" + p1result.val().choice + "</h1>");
			$("#playerTwoChoices").html("<h1>" + p2result.val().choice + "</h1>");
			$("#gameMessage").html("<h1>" + p2 + " wins!</h1>");
			wins2++;
			losses1++;
		} else if (p1result.val().choice == "Scissors" && p2result.val().choice == "Rock") {//PlayerTwo wins
			$("#playerOneChoices").html("<h1>" + p1result.val().choice + "</h1>");
			$("#playerTwoChoices").html("<h1>" + p2result.val().choice + "</h1>");
			$("#gameMessage").html("<h1>" + p2 + " wins!</h1>");
			wins2++;
			losses1++;
		};
		// Reset the Game to Play Again
		setTimeout(function () {
			playerTurn.update({
				turn: 1
			});
			player1.once("value", function (snapshot) {
				p1result = snapshot;
			}, function (errorObject) {
				console.log("The read failed: " + errorObject.code);
			});
			if (p1result.val() !== null) {
				player1.update({
					wins: wins1,
					losses: losses1
				});
			};
			player2.once("value", function (snapshot) {
				p2result = snapshot;
			}, function (errorObject) {
				console.log("The read failed: " + errorObject.code);
			});
			if (p2result.val() !== null) {
				player2.update({
					wins: wins2,
					losses: losses2
				});
			};
			$("#gameMessage").html("");
			$("#playerTwoChoices").html("");
		}, 2000);
	};
};
//Updates with PlayerTurn
playerTurn.on("value", function (snapshot) {
	if (snapshot.val() !== null) { //Waiting message during other player's turn
		if (snapshot.val().turn == 2 && playerNum == 1) {
			$("#gameMessage").html("Waiting for " + p2 + " to choose.");
		} else if (snapshot.val().turn == 1 && playerNum == 2) {
			$("#playerOneChoices").html("");
			$("#gameMessage").html("Waiting for " + p1 + " to choose.");
		}
		if (snapshot.val().turn == 1 && playerNum == 1) {//Player 1 goes first, loads RPS Choices
			$("#playerOneChoices").empty();
			$("#playerOneChoices").append("<div class = 'choice'>Rock</div>");
			$("#playerOneChoices").append("<div class = 'choice'>Paper</div>");
			$("#playerOneChoices").append("<div class = 'choice'>Scissors</div>");
			$("#gameMessage").html("It's your turn!");
		} else if (snapshot.val().turn == 2 && playerNum == 2) {//Player 2 goes second, loads RPS Choices
			$("#playerTwoChoices").empty();
			$("#playerTwoChoices").append("<div class = 'choice'>Rock</div>");
			$("#playerTwoChoices").append("<div class = 'choice'>Paper</div>");
			$("#playerTwoChoices").append("<div class = 'choice'>Scissors</div>");
			$("#gameMessage").html("It's your turn!");
		} else if (snapshot.val().turn == 3) {//When both players have chosen, call Result functions
			$("#gameMessage").html("");
			findResults();
		};
	};
});
$("#playerOneChoices").on("click", "div", function () {//Show Players their own choice
	var choice = $(this).text();
	$("#playerOneChoices").html("<h1>" + choice + "</h1>");
	setTimeout(function () {
		playerTurn.update({
			turn: 2
		});
		player1.update({
			choice: choice
		});
	}, 500);
});
$("#playerTwoChoices").on("click", "div", function () {
	var choice = $(this).text();
	$("#playerTwoChoices").html("<h1>" + choice + "</h1>");
	setTimeout(function () {
		player2.update({
			choice: choice
		});
		playerTurn.update({
			turn: 3
		});
	}, 500);
});

//ChatBox attempts 
function addChat(text){
	chatting = $("<p>").text(player+ ': '+text)
	$("#chatBox").append(chatting)

}

$("#chatButton").on("click", function (event) {
    event.preventDefault();
    var text = $("#userChat").val().trim();
    if (text !== "") {
        addChat(text);
		$("#userChat").val('');
		database.ref("/chat/"+player).set({
			chat: text
		});
	}
})


