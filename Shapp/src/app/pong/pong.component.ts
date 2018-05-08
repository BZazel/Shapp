import { Component, OnInit } from '@angular/core';
import { ConnectionService } from '../connection.service';
import { PongService } from '../pong.service';
import { Router, RouterEvent, NavigationStart } from '@angular/router';
@Component({
  selector: 'app-pong',
templateUrl: './pong.component.html',
  styleUrls: ['./pong.component.css']
})
export class PongComponent implements OnInit {
  container:HTMLElement;
  constructor(public gameService: PongService, private router:Router) { }

  ngOnInit() {

    this.router.events.subscribe((event:RouterEvent)=>{
      console.log(event)
      if(event instanceof NavigationStart)
      {
        this.gameService.conn.socket.emit('LEAVE','')
      }
    })

    this.gameService.conn.currentApp = 'pong';
    this.container = document.getElementById('GameWrapper');
    this.gameService.conn.eventObj = this.container;
    
    this.container.addEventListener('RoomConnected', () =>
    {
      this.gameService.rect = this.container;
      this.gameService.AddListeners(this.container);  
      
    })
  }
 

}
