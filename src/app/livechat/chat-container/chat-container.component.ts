import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-container',
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.css']
})
export class ChatContainerComponent implements OnInit {
  name = '';

  constructor(private user: UserService, private auth: AuthService, private alertify: AlertifyService,
    private router: Router) { }

  ngOnInit() {
    this.name = this.user.getUsername();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('token');
    this.auth.decodedToken = null;
    this.auth.currentUser = null;
    this.alertify.message('logged out');
    this.router.navigate(['/home']);
  }

}
