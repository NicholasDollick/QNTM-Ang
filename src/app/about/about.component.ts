import { Component, OnInit } from '@angular/core';
import { CryptoService } from '../_services/crypto.service';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(private crypto: CryptoService) { }

  ngOnInit() {
    this.crypto.encryptFile('asdf', new File(['test'], '../routes.ts')).then(res => {
      console.log(res);
    });

    
  }

}
