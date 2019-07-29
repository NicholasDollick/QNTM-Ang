import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model: any = {};
  response: string;
  confPassword: string;

  constructor(private authService: AuthService, private alertify: AlertifyService,
    private router: Router) { }

  ngOnInit() {
  }

  async register() {
    if (this.response === undefined) {
      this.alertify.error('Captcha Unsolved');
    } else {
      const res = await this.authService.verify(this.response);

      if (res === 'valid') {
        this.authService.register(this.model).subscribe(() => {
          this.alertify.message('Registration Complete');
        }, error => {
          this.alertify.error(error);
        }, () => {
          this.router.navigate(['/login']);
        });
      } else {
        this.alertify.error('Incorrect captcha response');
      }
    }
  }

  resolved(captchaResponse) {
    this.response = captchaResponse;
  }

}
