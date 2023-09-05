// Note to self, add start, pause button, restart, and clear

const canvas = document.getElementById('canvas');
const canvasContext = canvas.getContext('2d');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const aliveColor = 'green';
const deadColor = 'black';
const scalingFactor = 10;
const screenWidth = (canvas.width / scalingFactor);
const screenHeight = (canvas.height / scalingFactor);
const speed = 10; // frames per second
let startSim = false;
let stopId; // ID to stop the animation loop

// cell dead alive enum
const State = {
	Dead: 0,
	Alive: 1
}

// event listener for start simulation click
startButton.addEventListener('click', event =>
{
	if(!startSim)
	{
		startSim = true;
		main();
	}
});

stopButton.addEventListener('click', event =>
{
	if(startSim)
	{
		startSim = false;
	}
});

function main()
{
	let currentGameBoard = [];
	let pastGameBoard = [];

	randomizeGameBoard(currentGameBoard);

	initCopyGameBoard(currentGameBoard, pastGameBoard);

	// start game loop
	stopId = window.requestAnimationFrame(function() { gameLoop(currentGameBoard, pastGameBoard); });
}

function gameLoop(gameBoard, copyGameBoard)
{
	if(startSim)
	{
		canvasContext.clearRect(0, 0, canvas.width, canvas.height);
		drawBoardToCanvas(gameBoard);
		updateGameBoard(gameBoard, copyGameBoard);
		setTimeout(() => { window.requestAnimationFrame(function() { gameLoop(gameBoard, copyGameBoard); }); }, 1000 / speed);
	}
	else
	{
		cancelAnimationFrame(stopId);
	}
}

function updateGameBoard(gameBoard, copyGameBoard)
{
	let numAliveCells;
	for(let y = 0; y < screenHeight; y++)
	{
		for(let x = 0; x < screenWidth; x++)
		{
			numAliveCells = 0;

			for(let y0 = y - 1; y0 <= y + 1; y0++)
			{
				for(let x0 = x - 1; x0 <= x + 1; x0++)
				{
					if(!((y0 === y) && (x0 === x)))
					{
						if((y0 < screenHeight) && (y0 >= 0))
						{
							if((x0 < screenWidth) && (x0 >= 0))
							{
								if(gameBoard[y0][x0] === State.Alive) 
								{
									numAliveCells += 1;
								}
							}
						}
					}
				}
			}

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
