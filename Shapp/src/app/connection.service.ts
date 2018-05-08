//TODO 
// Listening for root changes; Disconnecting sockets
//  OR
// Saving data in cookies / session
//
//

import { Injectable } from '@angular/core';
import { SocketConnection } from './WebSocket'
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs'
import { Router } from '@angular/router';
interface Message
{
  name:string;
  message:string;

}
@Injectable()
export class ConnectionService {

  private _currentApp:string = null;
  socket:SocketConnection;
  mainSocket:SocketConnection;
  currentRoom:string = null;
  eventObj:HTMLElement;
  constructor(public http: HttpClient, public router:Router) {
   }


  GetRoomsList()
  {
    if(!this.currentApp) return;

    return  this.http.post('api/roomsList',{ NspName:this._currentApp })

  }
  JoinRoom(name:string)
  {
    console.log(name);
    
    if(this.currentRoom == name) return;
    //
    this.socket =  new SocketConnection(name.substr(1));
    this.currentRoom = name;
    
    this.eventObj.dispatchEvent(new Event('RoomConnected'))
    
  }
  get currentApp()
  {
    return this._currentApp;
  }
  set currentApp(value:string)
  {
    if(this._currentApp == value) return;

      this._currentApp = value;
  }
  AddEvent(obj:HTMLElement)
  { 
    let attr = obj.attributes[0];
    
    
        this.socket.fromEvent<Message>('message').subscribe( data  =>
          {
              let el = document.createElement('div'); 
              el.className = 'Message';
              el.setAttribute(attr.name,'')
              let span = document.createElement('span');                     
              span.className = 'Nick';
              span.innerHTML = data.name;
              span.setAttribute(attr.name,'');
              let p = document.createElement('p');
              p.className = 'MessageText';
              p.innerHTML = `${data.message}`
              p.setAttribute(attr.name,'')
              el.appendChild(span)
              el.appendChild(p)
              obj.appendChild(el)
              obj.scrollTo(0,obj.scrollHeight)
          })
          //
        this.socket.fromEvent('Admin').subscribe( data =>
          {
              let el = document.createElement('div');
              el.className = 'Message Admin'; 
              el.setAttribute(attr.name,'')
              let p = document.createElement('p');
              p.setAttribute(attr.name,'')
              p.className = 'MessageText';
              p.innerHTML = <string>data
              el.appendChild(p);
            
            obj.appendChild(el)
            
            obj.scrollTo(0, obj.scrollHeight )
          })
    
  }
  DisconnectFromRoom()
  {
    if(this.socket != null)
    {
      this.socket.disconnect();
      this.currentRoom = null;
      
    }
    
    
  }
  
}
