window.onload = function()
{
	Game.init();
}
var size = 20;
VAR = 
{
	lastTime:0,
	fps:30,
	cell_size:size,
	cols:200,
	rows:200,
}

Game  = 
{
	init:function()
	{
		Game.canvas = document.createElement('canvas');
		Game.ctx = Game.canvas.getContext('2d');
		Game.layout();

		document.body.appendChild(Game.canvas);
		document.addEventListener('onmousedown',Game.addCell(event),false);
		Game.grid = Game.make2DArray();
		Game.populateArray(Game.grid);
		//Game.nextGen();
		Game.animationLoop();

	},
	make2DArray:function()
	{
		var arr = [];
		for(var i = 0; i < VAR.rows; i++)
			arr[i] = [];

		return arr;
	},
	populateArray(array)
	{
		for(var y = 0; y < VAR.rows;y++)
			for(var x = 0; x < VAR.cols;x++)
			{
				array[y][x] = 0;
			}

		Game.makePatterns(40,40);
		Game.makePatterns(80,80);
	},
	makePatterns:function(x,y)
	{	

		var arr = 
		[ 
			[".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
			[".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","#",".",".",".",".",".",".",".",".",".",".",".","."],
			[".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","#",".","#",".",".",".",".",".",".",".",".",".",".",".","."],
			[".",".",".",".",".",".",".",".",".",".",".",".",".","#","#",".",".",".",".",".",".","#","#",".",".",".",".",".",".",".",".",".",".",".",".","#","#","."],
			[".",".",".",".",".",".",".",".",".",".",".",".","#",".",".",".","#",".",".",".",".","#","#",".",".",".",".",".",".",".",".",".",".",".",".","#","#","."],
			[".","#","#",".",".",".",".",".",".",".",".","#",".",".",".",".",".","#",".",".",".","#","#",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
			[".","#","#",".",".",".",".",".",".",".",".","#",".",".",".","#",".","#","#",".",".",".",".","#",".","#",".",".",".",".",".",".",".",".",".",".",".","."],
			[".",".",".",".",".",".",".",".",".",".",".","#",".",".",".",".",".","#",".",".",".",".",".",".",".","#",".",".",".",".",".",".",".",".",".",".",".","."],
			[".",".",".",".",".",".",".",".",".",".",".",".","#",".",".",".","#",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
			[".",".",".",".",".",".",".",".",".",".",".",".",".","#","#",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],
			[".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".",".","."],

		];
		var arr2 = 
		[
			[".",".",".",".",".","#",".",".",".",".",],
			[".",".",".",".","#","#",".",".",".",".",],
			[".",".",".",".","#","#",".",".",".",".",],
			[".",".",".",".",".",".",".",".",".",".",],
		];

		for (var i = 0; i < arr.length; i++)
		{	for(var j = 0 ; j < arr[0].length; j++)
			{
			if(arr[i][j] == ".")
				Game.grid[y+i][x+j] = false;
			else
				Game.grid[y+i][x+j] = true;
				
			}
		}

	},
	addCell:function(event)
	{
			console.log(event);
	},
	layout:function()
	{
		Game.canvas.width = window.innerWidth;
		Game.canvas.height = window.innerHeight;
	},
	nextGen: function()
	{
		var temp_table = Game.copyArray(Game.grid);

		for(var i = 1; i < VAR.rows-1 ; i ++)
		{
			for( var j = 1; j < VAR.cols-1 ;j++)
				{ 
					var number =  Game.grid[i-1][j-1] + Game.grid[i+0][j-1] + Game.grid[i+1][j-1]
								+ Game.grid[i-1][j+0] + 			0		+ Game.grid[i+1][j+0]
								+ Game.grid[i-1][j+1] + Game.grid[i+0][j+1] + Game.grid[i+1][j+1];

					if (Game.grid[i][j]) 
						temp_table[i][j] = number == 3 || number == 2;
					else
						temp_table[i][j] = number == 3;
			}
		}
			Game.grid = Game.copyArray(temp_table);
			Game.drawCells();
	},
	drawCells: function()
	{
				

	},
	copyArray:function(array)
	{
		var arr = [];
			for ( var i = 0;  i< VAR.rows; i++)
			{
				arr[i] = array[i].slice();
			}
			return arr;
	},
	animationLoop:function(time)
	{
		requestAnimationFrame( Game.animationLoop );
		if (time - VAR.lastTime >= 1000/VAR.fps) 
			{
				Game.ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
				Game.nextGen();
			}
	}

}