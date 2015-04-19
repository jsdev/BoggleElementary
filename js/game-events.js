var dimension = 5;
var dimensionSquared = dimension * dimension;
var board = new Array(dimensionSquared);
var barWidth = 368;
var totalTime = 10*1000;
var timeRemaining = 0;
var updateFrequency = 50;
var timervar = null;
var solutionColumnsNumber = 4;

var dice = new Array(
	"yqyswf",
	"sztllp",
	"xolrql",
	"hcthjt",
	"jkhhwf",
	"ioeoau",
	"qbrlpr",
	"ggnetn",
	"aaeouo",
	"eiaeao",
	"scywsj",
	"ioeuee",
	"aioeea",
	"cmhkzn",
	"hgbmgn",
	"ouoaei",
	"sysyfd",
	"mlgmcp",
	"uieeoo",
	"dbxvdy",
	"fnrddw",
	"oaaeeu",
	"vmrgzr",
	"dkxmpk",
	"bvtnts");

var output = document.getElementById('output');
var gameBoard = document.getElementById('game-board');
var configuration = document.getElementById('configuration');
var notValid = document.getElementById('not-valid');
var showAnswers = document.getElementById('score-container');

var startButton = document.getElementById('start');
var hsButton = document.getElementById('hs');

var optionsButton = document.getElementById('options');
var quitButton = document.getElementById('quit');
var solution = document.getElementById('solution');
var score = document.getElementById('score');
var minimumWordLength = document.getElementById('minimum-word-length');
var maximumWordLength = document.getElementById('maximum-word-length');
var tiles;

var submitWordButton = document.getElementById('submit-word');

//set height
//document.getElementById('game-container').style.height = window.innerHeight + "px";
document.getElementById('game-container').style.height = 1000 + "px";

var indexTiles = function () {
	for (var i=0; i < tiles.length; i++ ) {
		tiles[i].attributes.index = i;
	}
};

var setBoardDimensions = function (){
	dimension = parseInt(this.value);
	dimensionSquared = dimension * dimension;
	board = new Array(dimensionSquared);
};

var makeTable = function () {
	var s = '';
	for(var i = 0; i < dimension; i++) {
		for(var j = 0; j < dimension; j++) {
			s += '<button class="letter" id="'+i+'_'+j+'" disabled>?</button>';
		}
	}
	gameBoard.innerHTML = s;
	tiles = gameBoard.querySelectorAll('button');
	indexTiles();
	boggle.getHighScore();
};

var updateTable = function () {
	var s = '';
	for(var i = 0; i < dimension; i++) {
		for(var j = 0, c; j < dimension; j++) {
			c = board[i+j * dimension].toUpperCase();
			if(c === 'Q') c = 'Qu';
			s += '<button class="letter" id="'+i+'_'+j+'">'+c+'</button>';
		}
	}
	gameBoard.innerHTML = s;
	tiles = gameBoard.querySelectorAll('button');
	indexTiles();
};

var diceRoll5 = function () {
	var remaining = new Array();
	for(var i=0; i < dimensionSquared; i++) {
		remaining.push(i);
	}
	for(var i= 0, j, k; i < dimensionSquared; i++)
	{
		j = Math.floor(Math.random() * remaining.length);
		k = remaining.splice(j, 1);
		var die = dice[k];
		j = Math.floor(Math.random() * 6);
		var c = die.charAt(j);
		board[i] = c;
	}
};

var diceRoll = function () {
	var i, j, k;
	if(dimension === 5) {
		diceRoll5();
		return;
	}
	var remaining = new Array();
	for(var i=0, j, k; i < dimensionSquared; i++) {
		j = Math.floor(Math.random()*dice.length);
		var die = dice[j];
		j = Math.floor(Math.random()*6);
		var c = die.charAt(j);
		board[i] = c;
	}
};

var clearActiveTiles = function() {
	for (var i = 0; i < tiles.length; i++) {
		tiles[i].disabled = false;
		tiles[i].classList.remove('active');
	}
}

var validateTile = function (index, direction) {
	if (index < 0 || index >= dimensionSquared || tiles[index].classList.contains('active')) return;
	if (direction === 'left' && (index+1) % 5 === 0) return;
	if (direction === 'right' && index % 5 === 0) return;
	tiles[index].disabled = false;
};

var enableSurroundingTiles = function (tile) {
	var index = tile.attributes.index;
	var up = index - dimension;
	var down = index + dimension;
	validateTile(up, 'up');
	validateTile(down, 'down');

	validateTile(index - 1, 'left');
	validateTile(up - 1, 'left');
	validateTile(down - 1, 'left');

	validateTile(index + 1, 'right');
	validateTile(up + 1, 'right');
	validateTile(down + 1, 'right');
};

var safeBoard = function (i, j) {
	if((i<0) || (j<0) || (i>=dimension) || (j>=dimension)) return '*';
	return board[i+j * dimension];
};

var findSequence = function (seq, i, j) {
	if(seq.length<=1) return 1;
	var s = board[i+j*dimension];
	board[i+j*dimension] = ' ';
	for(var u=-1; u<=1; u=u+1) {
		for(var v=-1; v<=1; v=v+1) {
			if(safeBoard(i+u, j+v)==seq.charAt(1)) {
				if(findSequence(seq.substr(1), i+u, j+v)) {
					board[i+j * dimension] = s;
					return 1;
				}
			}
		}
	}
	board[i+j*dimension] = s;
	return 0;
};

var findWord = function (word) {
	if(word.length === 0) return 0;
	for(var i = 0; i < dimension; i++) {
		for(var j = 0; j < dimension; j++) {
			if(board[ i + j * dimension]==word.charAt(0)) {
				if(findSequence(word, i, j)) return 1;
			}
		}
	}
	return 0;
};

var closeSection = function (e) {
	if (!e.target.classList.contains('close-view')) return;
	e.target.parentNode.classList.add('hide');
};

var showOptions = function () {
	console.log('show options');
	configuration.classList.remove('hide');
};

var tick = function () {
	var t, w;
	timeRemaining = timeRemaining-updateFrequency;
	if(timeRemaining <= 0) {
		timeRemaining = 0;
		boggle.endGame();
	} else {
		timervar = setTimeout('tick()', updateFrequency);
	}
	t = Math.ceil(timeRemaining/1000);
	document.getElementById('timeRemaining').innerHTML = ':'+t;
	w = Math.floor(100 * timeRemaining / totalTime);
	document.getElementById('bar_remaining').width = w + '%';
	document.getElementById('bar_elapsed').width = (100 - w) + '%';
};

var userChosen = function (e) {
	if (e.target.tagName == "BUTTON") {
		document.getElementById('users-choice').classList.toggle('hide');
		document.getElementById('user-login').classList.toggle('hide');
		document.getElementById('password').focus();
	}
};

var loginFail = function () {
	var input = document.getElementById('password');
	input.value = "";
	input.focus();
	console.log('failed to validate');
}

var validateLogin = function (e) {
	var input = document.getElementById('password');

	if (e.target.tagName == "BUTTON" && input.value.length && input.value !== "badpass") {
		console.log('successfully validated');
		document.getElementById('user-login').classList.toggle('hide');
		document.getElementById('game').classList.toggle('hide');
	} else {
		loginFail ();
	}
/*
	var input = document.getElementById('password');

	if (e.target.tagName == "BUTTON" && input.value.length) {
		$.ajax({
			method: "POST",
			url: "http://sprinter.phonedeveloper.com/game_login",
			data: {user: 'sean', password: input.value}
		}).done(function( bool ) {
			if (!!bool) {
				console.log('successfully validated');
				document.getElementById('user-login').classList.toggle('hide');
				document.getElementById('game').classList.toggle('hide');
			} else {
				loginFail();
			}
		});
	} else {
		loginFail();
	}
*/
};


var boggle = {
	invalid: [],
	myWordList: [],
	disableTiles: function() {
		for (var i = 0; i < tiles.length; i++) {
			tiles[i].disabled = true;
		}
	},
	autoSubmitWord: function () {
		/* simplifying game branding it 4 letter word */
		if (output.innerHTML.length >= 4 || (output.innerHTML.length && !gameBoard.querySelectorAll('button:not([disabled])').length)) {
			boggle.submitWord();
			return;
		}
	},
	checkValidity: function(word) {
		var wordIsValid,
			wordIsDuplicate = boggle.myWordList.indexOf(word) >= 0;

		if (wordIsDuplicate) return;

		wordIsValid = boggle.solutions.indexOf(word.toLowerCase()) >= 0;
		if (wordIsValid) {
			boggle.myWordList.push(word);
			boggle.updateScore();
			return;
		}

		boggle.invalid.push(word);
	},
	submitWord: function () {
		boggle.checkValidity(output.innerHTML);
		output.innerHTML = '';
		clearActiveTiles();
	},
	clicker: function(e) {
		var tile = e.target;
		if (tile.tagName !== 'BUTTON' || tile.classList.contains('active')) {
			return;
		}
		output.innerHTML = output.innerHTML + tile.innerHTML;
		tile.classList.add('active');
		boggle.disableTiles();
		enableSurroundingTiles(tile);
		boggle.autoSubmitWord();
	},
	solve: function () {
		boggle.solutions = new Array();
		for(var i=0; i<words.length; i++) {
			if(words[i].length >= parseInt(minimumWordLength.value)) {
				if(findWord(words[i])) {
					boggle.solutions.push(words[i]);
				}
			}
		}
	//makeTable();
	},
	showSolution: function () {
		var max = maximumWordLength ? maximumWordLength.value : dimensionSquared;
		var s = '';
		var i = 0;
		var word;
		for (i = 0; i < boggle.invalid.length; i++) {
			s += '<span class="bad">'+boggle.invalid[i]+'</span>';
		}
		notValid.innerHTML = s;

		s = '';
		for(var wl = max; wl >= 3; wl--) {
			for(i = 0; i < boggle.solutions.length; i++) {
				word = boggle.solutions[i];
				if(word.length==wl) {
					s += '<a class="get-definition" target="_blank" href="http://dictionary.reference.com/browse/' + word + '">' + word.toUpperCase() + '</a>';
				}
			}
		}
		for(i = 0; i < boggle.myWordList.length; i++) {
			word = boggle.myWordList[i].toUpperCase();
			s = s.replace('>'+ word +'<','><span class="pretty-button">'+ word +'</span><');
		}
		solution.innerHTML = s;
		boggle.showSolutionLayer();
	},
	showSolutionLayer: function () {
		showAnswers.disabled = true;
		solution.parentNode.classList.remove('hide');
	},
	toggleButtons: function () {
		startButton.classList.toggle('hide');
		hsButton.classList.toggle('hide');
		optionsButton.classList.toggle('hide');
		submitWordButton.classList.toggle('hide');
		quitButton.classList.toggle('hide');
	},
	newGame: function () {
		var tt = document.getElementById('totalTime');

		boggle.resetScore();
		console.log('started new game w/ toggle');
		boggle.toggleButtons();
		diceRoll();
		updateTable();
		boggle.solve();
		showAnswers.disabled = true;

		if (tt) totalTime = parseInt(tt.value)*1000;
		if( timeRemaining > 0) clearTimeout(timervar);
		timeRemaining = totalTime;
		timervar = setTimeout("tick()", updateFrequency);
	},
	endGame: function () {
		console.log('quit game');
		boggle.toggleButtons();
		console.log(quitButton.classList.contains('hide'));
		boggle.disableTiles();
		boggle.calculateScore();
		boggle.showSolution();
		showAnswers.disabled = false;
		boggle.checkHighScore(score.innerHTML);
	},
	getHighScore: function () {
		boggle.highScore = localStorage.getItem('highscore') || 0;
		/*
		$.ajax({
			method: "GET",
			url: "http://sprinter.phonedeveloper.com/get_score",
			cache: false
		}).done(function( msg ) {
			boggle.highScore = parseInt(msg);
		});
		*/

	},
	postHighScore: function () {
		var hs = parseInt(score.innerHTML);
		localStorage.setItem('highscore', hs);
		boggle.highScore = hs;
		/*
		 $.ajax({
		 method: "POST",
		 url: "http://sprinter.phonedeveloper.com/set_score",
		 data: {score: hs}
		 }).done(function( msg ) {
		 boggle.highScore = parseInt(msg);
		 });
		 */
	},
	checkHighScore: function (hs) {
		var currentHighScore = boggle.highScore;
		console.log(hs);
		console.log(currentHighScore);
		if (parseInt(hs) > parseInt(currentHighScore) ) {
			boggle.postHighScore();
			alert(boggle.highScore + '\nis a new High Score!');
		}
	},
	endTime: function () {
		timeRemaining = 0;
	},
	resetScore: function () {
		boggle.invalid = [];
		boggle.myWordList = [];
		score.innerHTML = '0';
	},
	updateScore: function () {
		score.innerHTML = parseInt(score.innerHTML) + boggle.myWordList.length;
	},
	calculateScore: function () {
		for (var i = 1, s = 0, len = boggle.solutions.length; i < len; i++){
			s += i;
		}
		document.getElementById('scored').innerHTML = score.innerHTML;
		document.getElementById('possible').innerHTML = s;
	}
};

makeTable();

document.getElementById('dimensions').addEventListener('change', setBoardDimensions);
document.getElementById('users-choice').addEventListener('click', userChosen);
document.getElementById('user-login').addEventListener('click', validateLogin);

hsButton.addEventListener('click', function() { alert(boggle.highScore + 'PTS'); });
showAnswers.addEventListener('click', boggle.showSolutionLayer);
startButton.addEventListener('click', boggle.newGame);
quitButton.addEventListener('click', boggle.endTime);
optionsButton.addEventListener('click', showOptions);

gameBoard.addEventListener('click', boggle.clicker);
submitWordButton.addEventListener('click', boggle.submitWord);

document.body.addEventListener('click', closeSection);
