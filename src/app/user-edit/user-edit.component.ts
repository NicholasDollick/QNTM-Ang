import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { User } from '../_models/user';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  user: User;
  closeBtnName: string;
  title: string;

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit() {
  }

}
