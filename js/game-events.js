var myWordList =[];
var solutions;
var dimension = 5;
var dimensionSquared = dimension * dimension;
var board = new Array(dimensionSquared);
var barWidth = 368;
var totalTime = 10*1000;
var timeRemaining = 0;
var updateFrequency = 50;
var timervar = null;
var solutionColumnsNumber = 2;

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

var startButton = document.getElementById('start');
var optionsButton = document.getElementById('options');
var quitButton = document.getElementById('quit');
var solution = document.getElementById('solution');
var minimumWordLength = document.getElementById('minimum-word-length');
var tiles;

var submitWordButton = document.getElementById('submit-word');

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

var disableTiles = function() {
	for (var i = 0; i < tiles.length; i++) {
		tiles[i].disabled = true;
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

var submitWord = function () {
	myWordList.push(output.innerHTML);
	output.innerHTML = '';
	clearActiveTiles();
	console.log(myWordList);
};

var autoSubmitWord = function () {
	if (output.innerHTML.length && !gameBoard.querySelectorAll('button:not([disabled])').length) {
		submitWord();
	}
};

var clicker = function(e) {
	var tile = e.target;
	if (tile.tagName !== 'BUTTON' || tile.classList.contains('active')) {
		return;
	}
	output.innerHTML = output.innerHTML + tile.innerHTML;
	tile.classList.add('active');
	disableTiles();
	enableSurroundingTiles(tile);
	autoSubmitWord();
};

var transformWord = function (word) {
	var w = word.toUpperCase();
	return w.replace(/Q/g, 'Qu');
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

var solve = function () {
	solutions = new Array();
	for(var i=0; i<words.length; i++) {
		if(words[i].length >= parseInt(minimumWordLength.value)) {
			if(findWord(words[i])) {
				solutions.push(words[i]);
			}
		}
	}
	//makeTable();
};

var showSolution = function () {
	solve();
	var col = 0;
	var s = '';
	for(var wl=25; wl>=3; wl--) {
		var numsolsatthiswl = 0;
		for(var i=0; i<solutions.length; i++) {
			if(solutions[i].length==wl) {
				var w = transformWord(solutions[i]);
				if (col===0) s += '<tr>'
				col = (col+1)%solutionColumnsNumber;
				s += '<td><a class="get-definition" target="_blank" href="http://www.lexic.us/definition-of/' + w + '">' + w + '</a></td>';
				if (col=== 0)  s += '</tr>\n';
				numsolsatthiswl += 1;
			}
		}
	}
	if (col>0)  s += '</tr>';
	solution.innerHTML = s;
	solution.parentNode.classList.remove('hide');
};

var closeSection = function (e) {
	if (!e.target.classList.contains('close-view')) return;
	e.target.parentNode.classList.add('hide');
}

var newGame = function () {
	console.log('started new game');
	startButton.classList.add('hide');
	optionsButton.classList.add('hide');
	quitButton.classList.remove('hide');
	diceRoll();
	updateTable();
};

var endGame = function () {
	console.log('quit game');
	startButton.classList.remove('hide');
	optionsButton.classList.remove('hide');
	quitButton.classList.add('hide');
	showSolution();
	makeTable();
};

var showOptions = function () {
	console.log('show options');
	configuration.classList.remove('hide');
};

makeTable();

document.getElementById('dimensions').addEventListener('change', setBoardDimensions);
startButton.addEventListener('click', newGame);
quitButton.addEventListener('click', endGame);
optionsButton.addEventListener('click', showOptions);

gameBoard.addEventListener('click', clicker);
submitWordButton.addEventListener('click', submitWord);

document.body.addEventListener('click', closeSection);
