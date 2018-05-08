NAMESPACES = [];
chatNsps = [];  //#CLEAN
pongNsps = [];  //#CLEAN
canvasNsps = [] //#CLEAN

chatList = ["Shapp",'ChatRoom'];
canvasList= ['Canvas', 'Draw' , 'Bezier']
pongList= ['Ping', 'Pong' , 'Coop']
 
// SETUP ===============
const compression   = require('compression')
const express       = require('express');
const app           = express();
const path          = require('path');
const server        = require('http').Server(app);
const bodyParser    = require('body-parser');
const fs            = require('fs');
const io            = require('socket.io')(server, {
    serveClient: false,
    path:'/socket.io',
    // below are engine.IO options  
    pingInterval: 500,
    ingTimeout: 5000,
    cookie: false
  });;
  app.use(compression({threshold:0}));

  fs.exists(__dirname+'/Files',exists =>{
      if(!exists){
          fs.mkdirSync(__dirname + '/Files');
      } 
  })

  app.use(express.static(__dirname + '/Shapp/dist'));
  app.use(express.static(__dirname + '/Files'));

  app.get('/',(req,res)=>{
         res.sendFile(__dirname + '/Shapp/dist/index.html');
     
})
  /// BODY PARSER  
  app.use(bodyParser.urlencoded({extended:true})) // ??
  app.use(bodyParser.json())

  //
  ///              HELPER FUNCTIONS 
  function remove(array,element) {                                                                              
      const index = array.indexOf(element);
      array.splice(index,1)
    }    

    //Namespaces 
    let mainNsp = io.of('main');
        mainNsp.on('connection',(socket)=>{
        let chatList = [];
        for (const item of chatNsps) {
            chatList.push({name:item.nsp.name,count:item.online,active:false})
        }
        socket.emit('Main-List',chatList)
    })

    // CREATE NEW SOCKET NAMESPACE pong_ || canvas_ || _chat
    function Namespace(name)
    {   
        this.nsp = io.of(name);
        this.online = 0;
        this.timer = null;
        
        this.files = {};
        this.struct = {
            terminate:false,
            name: null, 
            type: null, 
            size: 0, 
            data: [], 
            slice: 0,
            fullBuffer:null 
        }
              
        if(name.startsWith('pong'))
        pongNsps.push(this)
        else if(name.startsWith('chat'))
        chatNsps.push(this)
        else if(name.startsWith('canvas'))
        canvasNsps.push(this)
                                       
       
        mainNsp.emit('List-Add',
        {   name:this.nsp.name,
            count:this.online,
            active:false});
         //
        this.nsp    
        .on('connection', (socket)=>{
            
            if(this.nsp.name.startsWith('/pong'))
            {
                if(this.online == 0 )
                {
                    this.nsp.emit('Pong','P1')
                    this.nsp.emit('Pong','Waiting');
                }

                if(this.online == 1)
                {
                    this.nsp.emit('Pong','P2') 
                    this.nsp.emit('Pong','Start Game'); 
                    
                }
                // #CLEAN
                if(this.online == 2)
                {
                    return;
                }
                // ----------

                socket.on('move', data =>
                {
                    socket.broadcast.emit('moved', data)
                })
                socket.on('LEAVE',()=>{
                    this.nsp.emit('Pong','Pause');
                })
            }

            this.online ++;

            if(this.nsp.name.startsWith('/chat'))
            {
                if(this.timer != null)
                {
                    clearTimeout(this.timer);
                }

                socket.emit('Admin', `Dołączyłeś do ${this.nsp.name.substring(6)}`);
                  
                mainNsp.emit('List-Update',{name:this.nsp.name,count:this.online});
               
                //socket.broadcast.emit('Admin', `${socket.id} dołączył do nas`)
                
                socket.on('msg', (data) =>{
                    socket.broadcast.emit('message' , data);
                    
                })
                socket.on('terminate-upload',data=>{
                    if(this.files[data.name]){
                      delete this.files[data.name]
                    }
                })
                socket.on('slice upload', data =>{
                               
                    if (!this.files[data.name]) { 
                        this.files[data.name] = Object.assign({}, this.struct, data); 
                        this.files[data.name].data = []; 
                    }
                    
                    //convert the ArrayBuffer to Buffer 
                    data.data = new Buffer(new Uint8Array(data.data)); 
                    //save the data 
                    this.files[data.name].data.push(data.data); 
                    this.files[data.name].slice++;
                    
                    //On End...
                    if (this.files[data.name].slice * 100000 >= this.files[data.name].size) { 
                        let fileBuffer = Buffer.concat(this.files[data.name].data)
                        this.files[data.name].fullBuffer = fileBuffer;

                        
                        fs.writeFile(__dirname+'/Files/'+data.name, fileBuffer, (err) => { 
                            // EMIT 
                           fs.exists(__dirname+'/Files/'+data.name,exists=>{
                            if(exists)
                            {
                                fs.readdir(__dirname+'/Files',(err,files)=>{
                                    this.nsp.emit('Length',files)    
                                })
                                this.nsp.emit('File',{name:data.name,type:data.type}) 
                            }
                           })
                            delete this.files[data.name]; 

                            if (err)  
                            socket.emit('upload error',err);

                        });
                    } else 
                    { 
                        socket.emit('request slice upload', { 
                          name:data.name,currentSlice: this.files[data.name].slice 
                        }); 
                    } 
                })

            }
                // DISCONNECT ===================================
            socket.on('disconnect', () =>
            {  
                this.online -- ;
                if(this.nsp.name.startsWith('/pong') && this.online == 1)
                {
                    this.nsp.emit('Pong','Waiting');
                }
                if(this.online == 0)
                {
                    
                    if(this.nsp.name != '/chat_Shapp')
                    {
                        //Remove room after 1 min if empty
                        this.timer = setTimeout(()=>{
                            mainNsp.emit('List-Delete',this.nsp.name);
                            remove(chatNsps,this);
                            },60000)
                    }
                }
                mainNsp.emit('List-Update',{name:this.nsp.name,count:this.online});

               // socket.broadcast.emit('Admin', `${socket.id} nas opuszcza`)
               
            })    
        }) 
    }
    //
    for (const room of chatList) {
        new Namespace(`chat_${room}`)
    }
    for (const room of canvasList) {
        
        new Namespace(`canvas_${room}`)
    }
    for (const room of pongList) {
        
        new Namespace(`pong_${room}`)
    }
  
    
 
// Server Configuration ===============

app.route('/api/factory')
.post((req,res) =>
{   
    let currentNsp =  new Namespace(req.body.nspName)

   res.send({name:currentNsp.nsp.name,count:currentNsp.online,active:false});
});

//FILES MANAGEMENT
app.route('/Files(*)')
.get((req,res)=>{
    var total = fs.statSync(__dirname+'/Files/'+req.params[0]).size;
    let ext = path.extname(req.params[0]);

    var range = req.headers.range;

    //Download Request
    if(!range){
        let stream = fs.createReadStream(__dirname+'/Files/'+req.params[0]);
        stream.pipe(res);
        return;
    }
    //Stream Request
    let positions = range.replace(/bytes=/, "").split("-");
    let start = parseInt(positions[0], 10);
    let end = positions[1] ? parseInt(positions[1], 10) : total - 1;
    let chunksize = (end - start) + 1;
    
    res.writeHead(206, {
        "Content-Range": "bytes " + start + "-" + end + "/" + total,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,

        "Content-Type": ext,

        });

    let stream = fs.createReadStream(__dirname+'/Files/'+req.params[0], { start: start, end: end })
    .on("open", function() {
        stream.pipe(res);
    }).on("error", function(err) {
        res.end(err);
    });
})

// PORT SETUP
app.set('port', process.env.PORT || 3000)
//process.env.PORT = 3000;

server.listen(process.env.PORT, ()=>{ console.log(`WORKS ON: ${process.env.PORT}`)});
