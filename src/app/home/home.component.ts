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
    console.log('you scrolled');
  }
}
