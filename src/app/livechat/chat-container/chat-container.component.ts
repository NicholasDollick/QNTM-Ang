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
  name = '';
  bsModalRef: BsModalRef;
  user: User;

  constructor(private userService: UserService, private auth: AuthService, private alertify: AlertifyService,
    private router: Router, private modalService: BsModalService) { }

  ngOnInit() {
    this.user = this.userService.getCurrentUser();
    console.log(this.user);
    this.name = this.user.username;
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

}
