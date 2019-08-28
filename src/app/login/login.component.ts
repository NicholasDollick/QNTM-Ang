import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';
import { CryptoService } from '../_services/crypto.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  remember = false;

  constructor(public authService: AuthService, private alertify: AlertifyService,
    private router: Router, private crypto: CryptoService) { }

  ngOnInit() {
  }

  async login() {
    await this.authService.login(this.model, this.remember).subscribe(next => {
      if (this.remember) {
        localStorage.setItem('privKey', this.crypto.decryptKey(localStorage.getItem('privKey'), this.model['password']));
      } else {
        sessionStorage.setItem('privKey', this.crypto.decryptKey(sessionStorage.getItem('privKey'), this.model['password']));
      }
      this.alertify.success('logged in successfully');
      this.router.navigate(['/chat']);
    }, error => {
      this.alertify.error(error);
    });
  }

  loggedIn() {
    return this.authService.loggedIn();
  }

}
