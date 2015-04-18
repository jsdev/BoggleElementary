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
var start = document.getElementById('start');
var quit = document.getElementById('quit');
var tiles;

var clearAll = document.getElementById('clear-all');

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
			s += '<button class="letter" id="'+i+'_'+j+'">?</button>';
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


var newGame = function () {
	console.log('started new game');
	start.classList.add('hide');
	quit.classList.remove('hide');
	diceRoll();
	updateTable();
};

var endGame = function () {
	console.log('quit game');
	start.classList.remove('hide');
	quit.classList.add('hide');
	makeTable();
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


makeTable();


document.getElementById('dimensions').addEventListener('change', setBoardDimensions);
start.addEventListener('click', newGame);
quit.addEventListener('click', endGame);

gameBoard.addEventListener('click', clicker);
clearAll.addEventListener('click', submitWord);