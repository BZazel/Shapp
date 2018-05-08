import { Injectable } from '@angular/core';
import { SocketConnection } from './WebSocket'
import { ConnectionService } from './connection.service';
interface ChatMessage
{
  text:string,
  id:string,
}

@Injectable()
export class ChatService {
  nickName:string = null;
  chatHidden:boolean = true;
constructor(public conn: ConnectionService ) 
  { 
        
  }

  DisconnectUser()
  {
    if(!this.conn.socket) return;

        this.conn.socket.disconnect();

        this.nickName = null;
        this.chatHidden = true;
  }
  
  
  

}
