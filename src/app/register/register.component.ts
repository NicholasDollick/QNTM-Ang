import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';
import { CryptoService } from '../_services/crypto.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model: any = {};
  response = 'test'; // CHANGE THIS AFTER TESTING
  private pub: any;
  private priv: any;
  public process = '';
  public loading = false;

  constructor(private authService: AuthService, private alertify: AlertifyService,
    private router: Router, private crypt: CryptoService) { }

  ngOnInit() {
  }

  async register() {
    if (this.response === undefined) {
      this.alertify.error('Captcha Unsolved');
    } else {
      // const res = await this.authService.verify(this.response);
      const res = 'valid';

      if (res === 'valid') {
        this.loading = true;
        this.process = 'Generating Keys';
        await this.crypt.genKeyPair(this.model.Username, this.model.Password,  4096, this.model.Password).then(keys => {
          const data = keys;
          this.model.PublicKey = data['public'];
          this.model.PrivateKeyHash = data['private'];
        });
        this.process = 'Finishing';
        this.authService.register(this.model).subscribe(() => {
          this.loading = false;
          this.alertify.message('Registration Complete');
        }, error => {
          this.loading = false;
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
