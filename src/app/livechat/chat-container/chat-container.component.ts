import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { UserEditComponent } from 'src/app/user-edit/user-edit.component';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.css']
})
export class ChatContainerComponent implements OnInit {
  bsModalRef: BsModalRef;
  user: User;
  photoUrl: string;
  activeChatUser: string;
  isChatting = false;
  searchForChat = false;
  showSplash = true;
  activeChats = [];

  constructor(private userService: UserService, private auth: AuthService, private alertify: AlertifyService,
    private router: Router, private modalService: BsModalService, ) { }

  ngOnInit() {
    this.auth.photoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
    this.user = this.userService.getCurrentUser();
    if (this.user['photoUrl'] !== null) {
      this.auth.changeUserPhoto(this.user['photoUrl']);
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('privKey');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('privKey');
    this.auth.decodedToken = null;
    this.auth.currentUser = null;
    this.alertify.message('logged out');
    this.router.navigate(['/home']);
  }

  openEdit() {
    const initialState = {
      title: 'Edit Profile',
      user: this.user
    };
    this.bsModalRef = this.modalService.show(UserEditComponent, {initialState});
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  selectChat() {
    this.searchForChat = false;
    this.showSplash = false;
    this.alertify.success('clicked this one');
    this.isChatting = true;
    this.activeChatUser = 'testname';
  }

  startNewChat() {
    // do something here?
    this.isChatting = false;
    this.showSplash = false;
    this.alertify.success('hello');
    this.searchForChat = true;
  }

  closeNewChat(val: boolean) {
    console.log(val);
    this.searchForChat = val;
    this.showSplash = true;
  }

  chatCreated(user: User) {
    this.activeChats.push(user);
    console.log(this.activeChats);
  }

}
