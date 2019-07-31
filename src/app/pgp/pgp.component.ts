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
  pub: any;
  priv: any;

  constructor(private crypt: CryptoService) { }

  ngOnInit() {
  }

  async run() {
    await this.crypt.genKeyPair(this.model.Username, this.model.Password,  4096, this.model.Password).then(async (res) => {
      const data = res;
      this.pub = data['public'];
      this.priv = data['private'];
    });

    await this.crypt.encryptDecrypt(this.priv, this.pub, this.model.Password, 'Hello World');
    // await this.crypt.verifyKeys(this.priv, this.model.Password);
  }

}
