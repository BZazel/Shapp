// TO DO:
//  Set Multiplier
//  Second Text canvas
//  Action on one player leaving
//  Show score
//
//

export
class PongGame
{

    canvas:any = null;
    textCanvas:any = null;
    ctx:any = null;
    textCtx:any = null;
    W:number = null;
    H:number= null;
    SizeRate:number;
    lastTime:any = 0; 
    size:number = 200;
    left:number;
    top:number;
    GameOver:boolean = false;
    currentPlayer:Player;
    player1:any;
    player2:any;
   // d = new Date()
    ball:Ball;

    constructor(private container:HTMLElement,player:string,private fps:number = 60) {

        this.left = this.container.offsetLeft;
        this.top  = this.container.offsetTop;

        this.Start();
        this.currentPlayer = player == 'P1'? this.player1 : this.player2;
       
        container.addEventListener('resize', this.Layout);
        
        container.style.cursor = 'none';
    }

    Start()
    {
        this.canvas = document.createElement('canvas');
        this.textCanvas = document.createElement('canvas');
        this.textCanvas.style.position = "absolute";
        this.ctx = this.canvas.getContext('2d');
        //
        this.textCtx = this.textCanvas.getContext('2d');
        //
        this.container.addEventListener('mousemove', (event)=>{

            this.currentPlayer.Move(event.pageY - this.top);
            
           // this.player1.Move(event.pageY - this.top)
        })

        this.Layout();

       //Players
        this.player1 = new Player('left',200,this.H,this.W)
        this.player2 = new Player('right',200,this.H,this.W)
       
        console.log(`Player 1: ${JSON.stringify(this.player1)} 
                    Player 2: ${JSON.stringify(this.player2)}
                    ${this.W}`);
        
        this.ball = new Ball(20,this.W/2,60)
        this.container.appendChild(this.textCanvas)
        this.container.appendChild(this.canvas)
      
        //Run animation
        this.Update();
        this.Score();

    }
    Layout()
    {
        if(this.canvas == null || this.ctx == null) return;

        //Get DOM Obj , and pass it to canvas
        this.W = this.container.clientWidth;
        this.H = this.container.clientHeight;
        
        
        this.canvas.width = this.W;
        this.canvas.height = this.H;

        this.textCanvas.width = this.W;
        this.textCanvas.height = this.H;
    }
    Draw()
    {

        this.ctx.fillStyle = 'black'
        this.ctx.fillRect(0,0,this.W,this.H)    

        
        this.player1.Draw(this.ctx)
        this.player2.Draw(this.ctx)
        this.GameOver = this.ball.CollisionCheck(this.W,this.H,this.player1,this.player2)
        this.ball.Draw(this.ctx);
       
    }
    Score()
    {
        this.textCtx.font = "30px Arial";
        this.textCtx.fillStyle = 'white';
        this.textCtx.fillText("0",this.W/2 - 100,50);
        this.textCtx.fillText("0",this.W/2 + 100,50);
    }
    Update()
    { 
        
        requestAnimationFrame(this.Update.bind(this));

            if(this.GameOver) return;
            this.ctx.clearRect(0,0,this.W,this.H);
            this.Draw();
        /*    setInterval(()=>
        {
            if(this.GameOver) return;
            //Game Loop --------------------------------
            //this.lastTime = this.d.getTime();

            this.ctx.clearRect(0,0,this.W,this.H);
            this.Draw();
        },17) */
    }
    Pause(tag:boolean)
    {
        if(tag)
        {
            this.textCtx.font = "30px Arial";
            this.textCtx.fillStyle = 'white';
            this.textCtx.fillText("Hello World",this.W/2 - 100,this.H/2 - 100);
        }
        else{
            this.textCtx.clearRect(0,0,this.W, this.H);
        }
    }
    set Player2(value)
    {
        this.player2  = value;
    }
  }
class Player
{
    x:number;
    y:number;
    H:number;
    constructor(public side:string,public size:number, boardH:number,boardW:number) {
        this.H = boardH;
        this.x = side == 'left' ? 20 : boardW - 40;
        this.y = boardH/2 - this.size/2;
    }

    Draw(ctx)
    {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x , this.y, 20, this.size)
    }
    Move(y:number)
    {
        if(y <= 0) { this.y = 0}
        else if(y + this.size >= this.H) { this.y = this.H - this.size}
        else
        {
            this.y = y
        }
    }

}
class Ball
{
   
    x:number;
    y:number;
    xmod:number = 3;
    ymod:number = -2;
   
    constructor(public size:number,xPos,yPos) {
        this.x = xPos;
        this.y = yPos;
        console.log(`Ball: ${JSON.stringify(this)}`);
              
    }
    CollisionCheck(BoardW,BoardH,player1,player2)
    {

        if(this.y <= 0 || this.y >= BoardH) {this.ymod = -this.ymod}

        else if(this.x <= 0 || (this.x + this.size >= BoardW)) { return true}

        else if((this.x <= player1.x + 20) && (this.y+this.size >= player1.y) && (this.y <= player1.y + player1.size)) { this.xmod = -this.xmod}

        else if((this.x+this.size >= player2.x) && (this.y+this.size >= player2.y) && (this.y <= player2.y + player1.size)) { this.xmod = -this.xmod}
        
    }
    Draw(ctx)
    {   
        
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x,this.y,this.size,this.size);

        this.x += this.xmod;
        this.y += this.ymod;

    }
    get currentPlayer()
    {
        return this.currentPlayer
    }
    set currentPlayer(value)
    {
        if(this.currentPlayer  == value ) return;
        this.currentPlayer = value
    }

}