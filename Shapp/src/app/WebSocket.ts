import { Socket } from 'ng-socket-io';

export class SocketConnection extends Socket{
    /**
     *
     */
    constructor(path:string) {
        //super({url:'localhost:3000'+path});
        super({url: window.location.href+path});
        
    }
}