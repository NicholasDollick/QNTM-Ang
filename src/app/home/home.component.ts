import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    document.addEventListener('scroll', this.scroll, true);
  }

  scroll = (): void => {
    const num = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    if (num > 200) {
      document.querySelector('nav').style.cssText = 'background: rgb(44, 44, 44)';
    } else {
      document.querySelector('nav').style.cssText = 'background: transperant';
    }
  }
}
