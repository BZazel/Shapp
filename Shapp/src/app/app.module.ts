import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule }  from '@angular/router'


import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { PongComponent } from './pong/pong.component';
import { ChatComponent } from './chat/chat.component';
import { CellularAutomataComponent } from './cellular-automata/cellular-automata.component';
import { PongGame } from './pong';
import { ListComponent } from './list/list.component';
import { ConnectionService } from './connection.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ChatService } from './chat.service';
import { PongService } from './pong.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


const routes = [
  { path:'', component: ChatComponent },
  { path:'pong', component: PongComponent },
  { path:'chat', component: ChatComponent },
  { path:'cell-auto', component: CellularAutomataComponent },
]

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PongComponent,
    ChatComponent,
    CellularAutomataComponent,
    ListComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    BrowserModule,
    BrowserAnimationsModule
    
    
  ],
  providers: 
  [ConnectionService,
    ChatService,
    PongService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
