export class GameOfLife
{
    canvas:any = null;
    ctx:any = null;
    W:number = null;
    H:number= null;
    lastTime:any = 0; 
    size:number = 200;
    left:number;
    top:number;
    d = new Date()
    cols:number;
    rows:number;
    cell_size:number;
    grid:any;
    

    constructor(private container:HTMLElement,private fps:number = 60) {

        this.left = this.container.offsetLeft;
        this.top  = this.container.offsetTop;
        this.rows = 50;
        this.cols = 50;
        this.cell_size = 10;
        
        this.grid = this.Make2dArray();
        this.PopulateArray(this.grid);

        this.Start();

        container.addEventListener('resize', this.Layout);
    }

    Start()
    {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.Layout();

        this.container.appendChild(this.canvas)
        this.Update();

    }
     
    Layout()
    {
        if(this.canvas == null || this.ctx == null) return;

        //Get DOM Obj rect, and pass it to canvas
        this.W = this.container.clientWidth;
        this.H = this.container.clientHeight;

        this.canvas.width = this.W;
        this.canvas.height = this.H;

      /*   //Disable edge smoothing
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.oImageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false; */


    }
    
    Update()
    { 
        //requestAnimationFrame(this.Update);
            setInterval(()=>
        {
            
            //Game Loop --------------------------------

            this.ctx.clearRect(0,0,this.W,this.H);
            this.NextGen();
        },35    )

    }
   Make2dArray()
   {
    var arr = [];
    for(var i = 0; i < this.rows; i++)
        arr[i] = [];

    return arr;
   }
   PopulateArray(array)
	{
		for(var y = 0; y < this.rows;y++)
			for(var x = 0; x < this.cols;x++)
			{
				array[y][x] = Math.round(Math.random());
			}
            
    }
    DrawCells()
    {
        for(var y = 0; y < this.rows;  y++)
		{
			for(var x = 0 ; x < this.cols; x++)
			{
				if (this.grid[y][x]) 
					this.ctx.fillStyle = '#FFFAEC';
				else
					this.ctx.fillStyle = '#323232';

				this.ctx.fillRect(x*this.cell_size,y*this.cell_size,this.cell_size,this.cell_size);

			}
		}
    }
    CopyArray(array)
    {
        var arr = [];
			for ( var i = 0;  i< this.rows; i++)
			{
				arr[i] = array[i].slice();
			}
			return arr;
    }
    NextGen()
    {
        var temp_table = this.CopyArray(this.grid);

		for(var i = 1; i < this.rows-1 ; i ++)
		{
			for( var j = 1; j < this.cols-1 ;j++)
				{ 
					var number =  this.grid[i-1][j-1] + this.grid[i+0][j-1] + this.grid[i+1][j-1]
								+ this.grid[i-1][j+0] + 			0		+ this.grid[i+1][j+0]
								+ this.grid[i-1][j+1] + this.grid[i+0][j+1] + this.grid[i+1][j+1];

					if (this.grid[i][j]) 
						temp_table[i][j] = number == 3 || number == 2;
					else
						temp_table[i][j] = number == 3;
			}
		}
			this.grid = this.CopyArray(temp_table);
			this.DrawCells();
    }

}