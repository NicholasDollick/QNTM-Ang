import { Component, OnInit } from '@angular/core';
import * as openpgp from 'openpgp';
import { CryptoService } from '../_services/crypto.service';
import { parse, stringify } from 'flatted/esm';


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

  constructor(private crypt: CryptoService) { }

  ngOnInit() {
  }

  async run() {
    console.log(this.model);
    this.model.Test = 'BOOM';
    console.log(this.model);
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
