import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  styleUrls: ['./state.component.css']
})
export class StateComponent implements OnInit {
  constructor() { 
  }

  ngOnInit() {
    console.log('does this even load?');
  }

}
