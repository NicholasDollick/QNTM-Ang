import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-newchat',
  templateUrl: './newchat.component.html',
  styleUrls: ['./newchat.component.css']
})
export class NewchatComponent implements OnInit {
  @Output() close = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  setClose() {
    this.close.emit(false);
  }

}
