import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination, PaginatedResults } from '../_models/pagination';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../_services/alertify.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageContainer: 'Unread';

  constructor(private user: UserService, private auth: AuthService,
    private router: ActivatedRoute, private alert: AlertifyService) { }

  ngOnInit() {
    this.router.data.subscribe(data => {
      this.messages = data['messages'].result;
      this.pagination = data['messages'].pagination;
    });
  }

  loadMessages() {
    this.user.getMessages(this.auth.decodedToken.nameid, this.pagination.currentPage,
      this.pagination.itemsPerPage, this.messageContainer).subscribe((res: PaginatedResults<Message[]>) => {
        this.messages = res.result;
        this.pagination = res.pagination;
      }, err => {
        this.alert.error(err);
      });
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadMessages();
  }

}
