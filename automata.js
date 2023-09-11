// Note to self, add start, pause button, restart, and clear

const canvas = document.getElementById('canvas');
const canvasContext = canvas.getContext('2d');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const speedSlider = document.getElementById('speedSlider');
const aliveColor = 'green';
const deadColor = 'black';
const scalingFactor = 5; // scales the scope down the bigger the number
const screenWidth = (canvas.width / scalingFactor);
const screenHeight = (canvas.height / scalingFactor);
let speed = 10; // speed of program
let startSim = false;
let stopId; // ID to stop the animation loop
let timeoutId; // ID to clear the timeout counter
let currentGameBoard = [];
let pastGameBoard = [];

const State = {
	Dead: 0,
	Alive: 1
}

window.addEventListener("load", event =>
{
	initCanvasBlack();
});

startButton.addEventListener("click", event =>
{
	startSim = true;
	clearTimeout(timeoutId);
	main();
});

pauseButton.addEventListener("click", event =>
{
	if(!startSim)
	{
		startSim = true;
		gameLoop(currentGameBoard, pastGameBoard);
	}
	else if(startSim)
	{
		startSim = false;
	}
});

speedSlider.oninput = function() {
	speed = speedSlider.value;
	document.getElementById('sliderLabel').innerText = "Speed: " + speed;
}

function main()
{

	randomizeGameBoard(currentGameBoard);
	initCopyGameBoard(currentGameBoard, pastGameBoard);

	// initially draw gameboard and then pause
	canvasContext.clearRect(0, 0, canvas.width, canvas.height);
	drawBoardToCanvas(currentGameBoard);
	startSim = false;


	// start game loop
	stopId = window.requestAnimationFrame(function() { gameLoop(currentGameBoard, pastGameBoard); });
}

function gameLoop(gameBoard, copyGameBoard)
{
	if(startSim)
	{
		updateGameBoard(gameBoard, copyGameBoard);
		canvasContext.clearRect(0, 0, canvas.width, canvas.height);
		drawBoardToCanvas(gameBoard);

		// recursively call function
		timeoutId = setTimeout(() => { window.requestAnimationFrame(function() { gameLoop(gameBoard, copyGameBoard); }); }, 1000 / speed);
	}
	else
	{
		cancelAnimationFrame(stopId);
	}
}

function initCanvasBlack()
{
	canvasContext.fillStyle = deadColor;
	canvasContext.fillRect(0, 0, canvas.width, canvas.height);
}

function updateGameBoard(gameBoard, copyGameBoard)
{
	let numAliveCells;
	for(let y = 0; y < screenHeight; y++)
	{
		for(let x = 0; x < screenWidth; x++)
		{
			numAliveCells = countNeighborCells(gameBoard, x, y);

			/*numAliveCells += gameBoard[y - 1][x - 1] + gameBoard[y - 1][x] +
				gameBoard[y - 1][x + 1] + gameBoard[y][x - 1] + 
				gameBoard[y][x + 1] + gameBoard[y + 1][x - 1] +
				gameBoard[y + 1][x] + gameBoard[y + 1][x + 1];*/

			if(gameBoard[y][x] === State.Alive)
			{
				// dies of loneliness or overcrowding
				if(numAliveCells < 2 || numAliveCells > 3)
				{
					copyGameBoard[y][x] = State.Dead;
				}

			}
			else if(gameBoard[y][x] === State.Dead)
			{
				// a new cell is born, rejoyce!
				if(numAliveCells === 3)
				{
					copyGameBoard[y][x] = State.Alive;
				}
			}
		}
	}


	copyCurrentGameBoard(copyGameBoard, gameBoard);
}

function countNeighborCells(gameBoard, x, y)
{

	let numAliveCells = 0;
	let withinBounds;
	let notSelf;

	for(let y0 = y - 1; y0 <= y + 1; y0++)
	{
		for(let x0 = x - 1; x0 <= x + 1; x0++)
		{
			notSelf = !(y0 === y && x0 === x);

			if(notSelf)
			{
				withinBounds = (y0 < screenHeight && y0 >= 0) && (x0 < screenWidth && x0 >= 0);

				if(withinBounds)
				{
					numAliveCells += gameBoard[y0][x0]
				}
			}
		}
	}

	return numAliveCells;
}

function randomizeGameBoard(gameBoard)
{
	for(let y = 0; y < screenHeight; y++)
	{
		gameBoard[y] = [];
		
		for(let x = 0; x < screenWidth; x++)
		{
			gameBoard[y][x] = Math.round(Math.random());
		}
	}
}

function copyCurrentGameBoard(gameBoard, copyGameBoard)
{
	for(let y = 0; y < screenHeight; y++)
	{
		for(let x = 0; x < screenWidth; x++)
		{
			copyGameBoard[y][x] = gameBoard[y][x]; 
		}
	}
}

function initCopyGameBoard(gameBoard, copyGameBoard)
{
	for(let y = 0; y < screenHeight; y++)
	{
		copyGameBoard[y] = [];
		for(let x = 0; x < screenWidth; x++)
		{
			copyGameBoard[y][x] = gameBoard[y][x]; 
		}
	}
}

function drawBoardToCanvas(gameBoard)
{
	for(let y = 0; y < screenHeight; y++)
	{
		for(let x = 0; x < screenWidth; x++)
		{
			switch(gameBoard[y][x])
			{
				case State.Dead:
					drawCell(x, y, deadColor);
					break;
				case State.Alive:
					drawCell(x, y, aliveColor);
					break;
			}
		}
	}
}

function drawCell(x, y, color)
{
	canvasContext.fillStyle = color;
	canvasContext.fillRect(x * scalingFactor, y * scalingFactor, 
		scalingFactor, scalingFactor);
}
