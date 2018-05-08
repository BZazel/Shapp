import { Component, OnInit, Input } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

import { ConnectionService } from '../connection.service';
import { ChatService } from '../chat.service';
import { Router, RouterEvent, NavigationStart } from '@angular/router';
import { SocketConnection } from '../WebSocket';
import { timeInterval } from 'rxjs/operator/timeInterval';

 interface Room{
   name:string,
   count:number,
   active:boolean,
 } 

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  animations:
  [ 
    trigger('NickNameSet',[
    state('false', style({
      transform: 'scale(1)'
    })),
    state('true',   style({
      transform: 'scale(0.8)'
    })),
    transition('false => true', animate('400ms ease-in')),
    transition('true => false', animate('400ms ease-out'))
  ]),
  
trigger('AnimItems',
[
  state('void',style({
    width:'30%',
    //backgroundColor:'white',
  })),
  state('*', style({
   //backgroundColor:'lightgrey',
    //transform: 'translate(0px, 10px)'
   
  })),
  transition('void => *',animate('400ms ease-in'))
]),
trigger('RoomListAnim',
[
 
  state('false',style({
    backgroundColor:'lightgrey',
    color:'black'
  })),
  state('true', style({
    backgroundColor:'#2C3E50',
    color:'#ECF0F1',
    border:'1px solid rgba(255,0,0,0.3)',
    height:'40px',
  
  })),
  transition('false => true',animate('400ms ease-in')),
  transition('* => false',animate('400ms ease-out'))
]),

//Empty Nick Alert  #TO DO
trigger('IsEmpty',[
  state('',style({
   // border:'1px solid red',
    //backgroundColor:'rgba(255,0,0,0.5)',
    
})),
transition('* => true', animate('400ms ease-in')),
transition('true => *', animate('400ms ease-in')),
]),
trigger('ContainerAnim',[
  state('false', style({
    marginTop: (window.innerHeight/2-150).toString() + 'px',
  })),
  state('true',style({
    marginTop: '0px;',
  })),
  transition('false => true', animate('400ms ease-in')),
  transition('true => false', animate('400ms ease-out'))
]),
//===============================
],})

export class ListComponent implements OnInit {
  Rooms:Array<Room>;
  currentRoom:any = null;
  NickNameSet:boolean = false;

  
  constructor( public chatService: ChatService, private router : Router) { }

  ngOnInit() {

    this.ConnectToMainSocket();

    //On App exit: disconnect()
    this.router.events.subscribe((event: RouterEvent)=>{
      if( event instanceof NavigationStart)
      {
        this.chatService.DisconnectUser();
        this.currentRoom = null;                  //#TO CLEAN
        this.chatService.conn.currentRoom = null; //#TO CLEAN
      

      }
    })
  }
  Join(room)
  {
    if(this.currentRoom)
    {
      if(room.name == this.currentRoom.name) return;
      
      this.currentRoom.active = false;
      this.chatService.conn.socket.disconnect();
      document.getElementById('Messages').innerHTML = '';
    }
    
    this.chatService.conn.JoinRoom(room.name);

    this.currentRoom = room;
    this.currentRoom.active = true;
  }
  
  SetNick(value:string)
  {
    if(value == '')
    { 
      return;
    }
    this.chatService.nickName = value;
    if(this.chatService.nickName)this.NickNameSet = true;

     (document.getElementById('GetNick') as HTMLInputElement).disabled = true;
     this.chatService.conn.mainSocket.emit('NickName',this.chatService.nickName)
  }
  Reset(){
    this.chatService.nickName = null;

    this.chatService.conn.DisconnectFromRoom();
    (document.getElementById('GetNick') as HTMLInputElement).disabled = false;
    (document.getElementById('GetNick') as HTMLInputElement).value = '';
    document.getElementById('Messages').innerHTML = '';
   
    if(this.currentRoom){
    this.currentRoom.active = false;
    this.currentRoom = null;
  }
    this.NickNameSet = false;
    this.chatService.chatHidden = true;
     console.log(this.chatService.nickName);
         
  }
  ConnectToMainSocket(){
    this.chatService.conn.mainSocket = new SocketConnection('main');
   
    this.chatService.conn.mainSocket.fromEvent('Main-List').subscribe( (data)=>{
      this.Rooms = data as Room[];
     
    })
    this.chatService.conn.mainSocket.fromEvent('List-Update').subscribe( (data:Room) =>{
        for (const room of this.Rooms) {
          if(room.name == data.name.substring(0))
          {
            room.count = data.count
          }
        }      
    })
    this.chatService.conn.mainSocket.fromEvent('List-Add').subscribe( (data:Room)=>{
      this.Rooms.push(data);
    })

    this.chatService.conn.mainSocket.fromEvent('List-Delete').subscribe( (name)=>{
      for (const room of this.Rooms) {
        if(room.name == name)
        {
          let index = this.Rooms.indexOf(room);
          this.Rooms.splice(index,1);
        }
      }
      
    })
  }
  CreateRoom(nspName:string)
  {
    if(nspName == '') return;
    let trimmedName = nspName.replace(/\s+/g, '');
    trimmedName = trimmedName.replace(/[^a-z0-9]/gi,'');
    if(trimmedName.length > 15)
    {
      trimmedName = trimmedName.substring(0,15); 
    }

    this.chatService.conn.http.post('api/factory',{nspName:'chat_'+trimmedName}).subscribe((data:Room) =>{

        for (const room of this.Rooms) {
          if(room.name == data.name)
          {
            this.Join(room);
          }
        }
     
    });
  }


}
