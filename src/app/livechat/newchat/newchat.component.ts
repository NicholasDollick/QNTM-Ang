import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-newchat',
  templateUrl: './newchat.component.html',
  styleUrls: ['./newchat.component.css']
})
export class NewchatComponent implements OnInit {
  @Output() close = new EventEmitter<boolean>();
  @Output() chatWith = new EventEmitter<User>();
  searchName = '';
  foundUser: User;
  lastUpdate: number;

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

  setClose() {
    this.close.emit(false);
  }

  createChat() {
    this.userService.findUser('admin').toPromise().then(res => {
      this.chatWith.emit(res);
    });
  }

  onSubmit(test: string) {
    console.log(test);

  }

  valuechange(newVal) {
    this.userService.findUser(newVal).toPromise().then(res => {
      console.log(res);
      if (res !== null) {
        this.foundUser = res;
      }
    });
  }

  searchForUser() {
    console.log(this.searchName);
  }

}
