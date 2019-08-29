import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { UserService } from '../../_services/user.service';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  private hubConnection: HubConnection;
  name = '';
  message = '';
  messages: string[] = [];
  @Input() photoUrl: string;
  // currentUser = this.user.getCurrentUser();
  @Input() currentUser: User;
  @ViewChild('msgList') msgHist: ElementRef;

  constructor(private user: UserService) { }

  ngOnInit() {
    this.name = this.currentUser.username;
    console.log(this.currentUser);
    this.hubConnection = new HubConnectionBuilder().withUrl('http://localhost:5000/chat').build();
    this.hubConnection.start().then(() => {
      console.log('Connection Started');
    }).catch(err => {
      console.log('Error starting connection');
    });

    this.hubConnection.on('chatMessages', (data: string) => {
      console.log(JSON.parse(data));
      this.messages.push(JSON.parse(data));
    });
  }

  sendMessage(): void {
    this.hubConnection.invoke('chatMessages', JSON.stringify({username: this.name, msg: this.message, photoUrl: this.photoUrl}));
    // this.messages.push(this.message); // this is a temporary test change
    this.message = '';
  }

  private scrollToBottom(): void {
    this.msgHist.nativeElement.scrollTop = this.msgHist.nativeElement.scrollHeight;
  }

}
