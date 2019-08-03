import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../_services/navbar.service';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {

  constructor(public nav: NavbarService) { }

  ngOnInit() {
  }

}
