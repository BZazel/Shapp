import { Injectable } from '@angular/core';
import { ConnectionService } from './connection.service';
import { PongGame } from './pong'
@Injectable()
export class PongService {

  rect:HTMLElement;
  game:PongGame;
  gameStarted:boolean;
  currentPlayer:any;
  waiting:boolean = false;
  constructor(public conn: ConnectionService) { }


  AddListeners(obj:HTMLElement)
  {
    this.conn.socket.fromEvent('Pong').subscribe( (data) =>
    {
      console.log(data);
      if(data == 'Pause'){
        this.game.Pause(true);
      }
      if(data == 'Waiting'){
        this.waiting = true;
        if(this.gameStarted)
        {
          this.game.Pause(true);
        }
      }
      if(data == 'Start Game')
      {
        this.waiting = false;
        this.StartGame();
        this.gameStarted = true;
      }
      if(data == 'P1' && this.currentPlayer != 'P2')
      {
        this.currentPlayer = 'P1'
        console.log("Current Player Set to P1");
        
      }
      if(data == 'P2' && this.currentPlayer != 'P1')
      {
        this.currentPlayer = 'P2'
        console.log("Current Player Set to P2")
      }
    })
    
    obj.addEventListener('mousemove', (event) => {

      this.conn.socket.emit('move', [this.currentPlayer,event.pageY - obj.offsetTop])
    })

    this.conn.socket.fromEvent('moved').subscribe(data => 
      {
        if(data[0] == 'P1')
        this.game.player1.Move(data[1]);
        else if(data[0] == 'P2' )
        this.game.player2.Move(data[1])
        //console.log(data)
          
      })
  }
StartGame()
  {
    this.AddListeners(this.rect)
    this.game = new PongGame(this.rect,this.currentPlayer);
  }
}
