import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-newchat',
  templateUrl: './newchat.component.html',
  styleUrls: ['./newchat.component.css']
})
export class NewchatComponent implements OnInit {
  @Output() close = new EventEmitter<boolean>();
  @Output() chatWith = new EventEmitter<User>();

  constructor() { }

  ngOnInit() {
  }

  setClose() {
    this.close.emit(false);
  }

  createChat() {
    this.chatWith.emit({username: 'Test', id: 16, photoUrl: 'this is a broken link lol'});
  }

}
