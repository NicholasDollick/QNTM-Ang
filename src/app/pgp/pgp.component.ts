import { Component, OnInit } from '@angular/core';
import * as openpgp from 'openpgp';
import { CryptoService } from '../_services/crypto.service';
import { parse, stringify } from 'flatted/esm';
import { AuthService } from '../_services/auth.service';


@Component({
  selector: 'app-pgp',
  templateUrl: './pgp.component.html',
  styleUrls: ['./pgp.component.css']
})
export class PgpComponent implements OnInit {
  model: any = {};
  private pub: any;
  private priv: any;
  public loading = false;
  public process = 'asdf';
  public exists = false;

  constructor(private crypt: CryptoService, private auth: AuthService) { }

  ngOnInit() {
  }

  test() {
    console.log('there has been a change');
  }

  async run() {
    console.log(this.model);
    this.model.Test = 'BOOM';
    console.log(this.model);
    await this.auth.exists(this.model).then(res => {
      res.subscribe(data => {
        console.log(data['result']);
        this.exists = data['result'];
      });
    });
    return;
    this.loading = true;
    this.process = 'Generating Keys';
    await this.crypt.genKeyPair(this.model.Username, this.model.Password,  4096, this.model.Password).then(res => {
      const data = res;
      this.pub = data['public'];
      this.priv = data['private'];
    });
    this.process = 'Verifying Keys';
    await this.crypt.verifyKeys(this.priv, this.model.Password);
    this.process = 'Testing';
    await this.crypt.encryptDecrypt(this.priv, this.pub, this.model.Password, 'Hello World');
    this.loading = false;
    // await this.crypt.verifyKeys(this.priv, this.model.Password);
  }

}
