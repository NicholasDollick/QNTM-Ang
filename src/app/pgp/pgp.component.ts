import { Component, OnInit } from '@angular/core';
import * as openpgp from 'openpgp';


@Component({
  selector: 'app-pgp',
  templateUrl: './pgp.component.html',
  styleUrls: ['./pgp.component.css']
})
export class PgpComponent implements OnInit {

  constructor() { }

  async ngOnInit() {

    const options = {
      userIds: [{name: 'Test Boi', email: 'asdf@asdf.com'}],
      numBits: 4096,
      passphrase: 'the pass'
    };
    await openpgp.generateKey(options).then(function(key) {
      const priv = key.privateKeyArmored;
      const pub = key.publicKeyArmored;
      console.log(priv);
      console.log(pub);
    });
    console.log('im here');
  }

}
