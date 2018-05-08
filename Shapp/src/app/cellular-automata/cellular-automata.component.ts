import { Component, OnInit } from '@angular/core';
import { GameOfLife } from './GameOfLife';
@Component({
  selector: 'app-cellular-automata',
  templateUrl: './cellular-automata.component.html',
  styleUrls: ['./cellular-automata.component.css']
})
export class CellularAutomataComponent implements OnInit {
  animation:any;
  constructor() { }

  ngOnInit() {
    this.animation = new GameOfLife(document.getElementById('AnimationWrapper'))
  }
  
}
