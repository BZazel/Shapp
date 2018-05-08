//TO DO
// Sending and retrieving files via Websocket
//
//

import { Component, OnInit, Input } from '@angular/core';
import { ChatService } from '../chat.service';
import { QRCode, ErrorCorrectLevel, QR8BitByte} from 'qrcode-generator-ts/js';

import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import { readFile, writeFile, appendFile } from 'fs';
import { THROW_IF_NOT_FOUND } from '@angular/core/src/di/injector';

interface Message
{
  Name:string;
  Message:string;

}
interface myFile{
  name:string;
  type:any;
}
interface UploadFile{
  file:File;
  name: any; 
  type: any; 
  size: number; 
  currentSlice:any;
  fullBuffer:any;
  fR:FileReader;
}
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  animations:[
    trigger('WrapperAnimation',[
      state('true',style({
        visibility:'hidden',
        width:'0%',
      })),
      state('false',style({
        visibility:'visible',
        width:'80%',
      })),
      transition('true => false',animate('400ms ease-in')),
      transition('false => true',animate('400ms ease-in'))

    ]),
    trigger('MessageIn',[
      state('*',style({
        transition: 'translate(0px,-10px)',
      })),
     
     
      transition('void => *',animate('400ms ease-in'))

    ])]
  
})
export class ChatComponent implements OnInit {

  MessagesWrapper:HTMLElement = null;
  nickName:string = null;
  input:any;
  currentFiles:Array<UploadFile>;
  constructor(public chatS: ChatService) { 
  }

  ngOnInit() 
  {
    this.Setup();
    this.currentFiles = new Array<UploadFile>();
  }
//
  Setup()
  {
    this.chatS.conn.currentApp = 'chat';  
    this.chatS.conn.eventObj = document.getElementById('Wrapper');

    // On room connecteed
    this.chatS.conn.eventObj.addEventListener('RoomConnected', ()=>
    {
      this.AddFileSocketListeners();
    this.MessagesWrapper = document.getElementById('Messages');

   window.addEventListener('dragover',(ev)=>{
     ev.preventDefault();
     if(ev.dataTransfer.types[0] == 'files' ){
       this.MessagesWrapper.classList.add('DragOver');
     }
   });

   this.MessagesWrapper.addEventListener('dragleave',(ev)=>{
     this.MessagesWrapper.classList.remove('DragOver');
   });

 this.MessagesWrapper.addEventListener('drop',this.GetFiles.bind(this),false);

 
   this.chatS.conn.AddEvent(this.MessagesWrapper);
    this.chatS.chatHidden = false;

    })
    this.input = document.getElementById('GetFile');
    this.input.addEventListener('change',this.GetFiles.bind(this))
  
  }
  //
  SendMessage(data:string )
  { 
    let nick = this.chatS.nickName;
    let attr = document.getElementById('Wrapper').attributes[0].name

    // Add messsage item ===========================
    let el = document.createElement('div'); 
    el.className = 'Message ClientMessage';
    el.setAttribute(attr,'')
    let p = document.createElement('p');
    p.className = 'MessageText';
    p.innerHTML = `${data}`
    p.setAttribute(attr,'')
    el.appendChild(p)
    this.MessagesWrapper.appendChild(el)
    this.MessagesWrapper.scrollTo(0,this.MessagesWrapper.scrollHeight)
    
    // ===============================================

    let msg  = {name:nick, message:data}
    this.chatS.conn.socket.emit('msg', msg)
    document.getElementById('TextInput').textContent = '';
  }

  // Sending nad getting files through socket io #TO ADD

  GetFiles(ev){
   
    console.log(`EVENT TYPE  ${JSON.stringify(ev.type)}`);
    let files;
    //INPUT ELEMENT
    if(ev.type == 'change')
    {
      files = ev.target.files;
    }//DROP EVENT
    else if (ev.type == 'drop')
    {
      files = ev.dataTransfer.files;
      if(ev.dataTransfer.items[0].webkitGetAsEntry().isDirectory){
  
      console.log(`Is directory:  ${JSON.stringify(ev.dataTransfer.items[0].webkitGetAsEntry().directory)}`);    
      return;
  
      }
      ev.preventDefault();
      ev.stopPropagation();
      this.MessagesWrapper.classList.remove('DragOver');
    }
    
    //LIST OF FILES
    console.log(`FILES  ${JSON.stringify(files)}`);
    
    for (let f of files) 
    {
      //push to array
        this.currentFiles[f.name] = {
          file:f,
          name:f.name,
          type: f.type, 
          size: f.size, 
          currentSlice: null,
          fullBuffer:[],
          fR:new FileReader(),
        };
        let x = this.currentFiles[f.name]
        let slice  = x.file.slice(0,100000);
        x.fR.readAsArrayBuffer(slice)
      //Upload File slice to server
        x.fR.onload = (ev) =>{
          let arrayBuffer  =  x.fR.result;
          this.chatS.conn.socket.emit('slice upload',{
            name: x.name, 
            type: x.type, 
            size: x.size, 
            data: arrayBuffer
          })
        }
   
    }
  }

  StopUpload(name:string){

    //this.fileReader.abort();
    this.chatS.conn.socket.emit('terminate-upload',{name: name})
    this.currentFiles[name] = null;
    //this.slice = null;
    document.getElementById('Upload').style.display = 'none';
    
  }
  AddFileSocketListeners(){
 
    this.chatS.conn.socket.fromEvent('request slice upload').subscribe((data : UploadFile)=>{
      if(!this.currentFiles[data.name]) return;

      let f = this.currentFiles[data.name];

      let place = data.currentSlice * 100000;
      //Progress bar update
      let round = (place/f.size*100).toString();
      document.getElementById('Upload').style.display = 'block';
      document.getElementById('ProgressBar').style.width = round + '%';
      // ============================================================

      let slice = f.file.slice(place,place + Math.min(100000,f.size - place));
      f.fR.readAsArrayBuffer(slice);
    })
  
    this.chatS.conn.socket.fromEvent('Length').subscribe(data=>{
      
    })
    this.chatS.conn.socket.fromEvent('upload error').subscribe((data)=>{
    })
    
    this.chatS.conn.socket.fromEvent('File').subscribe((data: myFile)=>
    {

      document.getElementById('Upload').style.display = 'none';

      //QR CODE GENERATOR
/*      let qr = new QRCode();
      qr.setTypeNumber(10);
      qr.addData(location.href+'Files/'+data.name);
      qr.make();
      this.MessagesWrapper.appendChild(this.createCanvas(qr,2)); 
 */
      let attr = document.getElementById('Wrapper').attributes[0].name

      let fileName = document.createElement('span');
      fileName.setAttribute(attr,'');
      fileName.className = 'FileName';
      fileName.innerHTML = data.name;
      // NICK #TO DO

     if(data.type == "audio/mp3" || data.type == "audio/flac")
     {
       let stop = false;
       
        let audio = document.createElement('audio');
          audio.src = '/Files/'+data.name;
         // audio.title = data.name;
          audio.controls = true;
           audio.volume = 0.5;
           audio.setAttribute(attr,'');
           audio.style.minHeight = '40px';
           audio.className = 'Message' 

           audio.addEventListener('canplay',function(){
            if(!stop)
            {
            this.MessagesWrapper.appendChild(audio)
            this.MessagesWrapper.appendChild(fileName)
            stop = true;
            }
            // this.audio.removeEventListener('canplay', this)
           }.bind(this))
                    
      }else if (data.type == 'video/mp4')
      {
        let stop = false;
        let video = document.createElement('video');
        
        video.src ='Files/'+ data.name;
        video.controls = true;
        video.volume = 0.5;
        video.className = 'Message'
        video.setAttribute(attr,'');
        video.addEventListener('canplay',function(ev){
          if(!stop)
          {
          this.MessagesWrapper.appendChild(video)
          this.MessagesWrapper.appendChild(fileName);
          stop = true;
          }
         /*  this.video.removeEventListener('canplay',
          this);  */ 
        }.bind(this))
        

      }
      else if(data.type =='image/jpeg' || data.type == 'image/png'){

        let img = document.createElement('img');
        img.src = 'Files/' + data.name;
        img.setAttribute(attr,'');
        img.className = 'Message';
        img.style.maxWidth = '40%';
        img.onload = ()=>{
          this.MessagesWrapper.appendChild(img)
          this.MessagesWrapper.appendChild(fileName)
        }
      }
      
       else{
        let a = document.createElement("a");
        a.href = location.href+'Files/'+data.name;
        a.text = "Pobierz "+data.name
        a.download = data.name;
        a.setAttribute(attr,'');
        a.className = 'Message';
        this.MessagesWrapper.appendChild(a);
      }

      this.MessagesWrapper.scrollTo(0,this.MessagesWrapper.scrollHeight)
    });
  }
  //FOR QR CODE
  createCanvas(qr : QRCode, cellSize = 2, margin = cellSize * 4) {

    var canvas = document.createElement('canvas');
    var size = qr.getModuleCount() * cellSize + margin * 2;
    canvas.width = size;
    canvas.height = size;

    canvas.style.maxWidth = '100px';

    var ctx = canvas.getContext('2d');

    // fill background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // draw cells
    ctx.fillStyle = '#000000';
    for (var row = 0; row < qr.getModuleCount(); row += 1) {
      for (var col = 0; col < qr.getModuleCount(); col += 1) {
        if (qr.isDark(row, col) ) {
          ctx.fillRect(
            col * cellSize + margin,
            row * cellSize + margin,
            cellSize, cellSize);
        }
      }
    }
    return canvas;
  }
 }
