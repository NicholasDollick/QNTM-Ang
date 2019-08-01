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
  private model: any = {};
  response = 'test'; // CHANGE THIS AFTER TESTING
  public process = '';
  private loading = false;
  private exists: boolean;

  constructor(private authService: AuthService, private alertify: AlertifyService,
    private router: Router, private crypt: CryptoService) { }

  ngOnInit() {
  }

  async precheck() {
    await this.authService.exists(this.model).then(nameCheck => {
      nameCheck.subscribe(async res => {
        if (!res['result']) {
          await this.register();
        }
      });
    });
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

  // if attempted to register with dupe username, this will clear the register block upon update of textbox
  onUsernameChange() {
    if (this.exists === true) {
      this.exists = false;
    } else {
      return;
    }
  }

}
