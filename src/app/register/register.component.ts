import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model: any = {};
  response: string;
  confPassword: string;

  constructor(private authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
  }

  async register() {
    console.log(this.model);
    console.log(JSON.parse(this.model));
    if (this.response === undefined) {
      this.alertify.error('Captcha Unsolved');
    } else {
      const res = await this.authService.verify(this.response);

      if (res === 'valid') {
        this.authService.register(this.model).subscribe(() => {
          this.alertify.message('Registration Complete');
        }, error => {
          this.alertify.error(error);
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
