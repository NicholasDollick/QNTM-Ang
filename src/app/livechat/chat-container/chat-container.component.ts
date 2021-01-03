import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { UserEditComponent } from 'src/app/user-edit/user-edit.component';
import { User } from 'src/app/_models/user';
import { PresenceService } from 'src/app/_services/presence.service';

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
  private onlineUsers = [];

  constructor(private userService: UserService, private auth: AuthService, private alertify: AlertifyService,
    private router: Router, private modalService: BsModalService, private presence: PresenceService) { }

  ngOnInit(): void {
    this.auth.photoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
    this.auth.refreshToken();
    this.userService.getAuthedUser(this.auth.decodedToken.nameid).subscribe(userData => {
      this.user = userData;
      console.log(this.user);
      if (this.user['photoUrl'] !== null) {
        this.auth.changeUserPhoto(this.user['photoUrl']);
      }
      this.user['activeChats'].forEach(chat => {
        this.userService.findUser(chat['username']).subscribe(async res => {
          if (res !== null) {
            await this.activeChats.push(res);
          }
        });
      });
    });
  }

  logout() {
    this.auth.logout();
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

  selectChat(user: User) {
    this.searchForChat = false;
    this.showSplash = false;
    // this.alertify.success('clicked this one');
    this.isChatting = true;
    this.activeChatUser = user.username;
    console.log(user.username);
  }

  startNewChat() {
    this.isChatting = false;
    this.showSplash = false;
    this.searchForChat = true;
  }

  closeNewChat(val: boolean) {
    this.searchForChat = val;
    this.showSplash = true;
  }

  chatCreated(user: User) {
    this.auth.refreshToken();
    if (user.username !== this.user.username && !(this.activeChats.some(chatWith => chatWith['username'] === user.username))) {
      // this is a new user
      this.activeChats.push(user);
      console.log(this.user['activeChats']);
      this.user['activeChats'] = this.activeChats;
      this.user.activeChats = this.activeChats;
      console.log(this.user['activeChats']);
      this.userService.createChat(this.auth.decodedToken.nameid, { username: user.username, photoUrl: user.photoUrl }).subscribe(() => {
        this.user = this.userService.getCurrentUser();
        this.alertify.success('created');
      });
    } else {
      // already chatting with this user
      this.alertify.error('Already chatting with ' + user.username);
    }
  }
}
