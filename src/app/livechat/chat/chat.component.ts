import { Component, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { UserService } from '../../_services/user.service';

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

  constructor(private user: UserService) { }

  ngOnInit() {
    this.name = this.user.getUsername();
    console.log(this.name);
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

  sendMessage() {
    // this.hubConnection.invoke('chatMessages', JSON.stringify({username: this.name, msg: this.message, sentByMe: true}));
    this.messages.push(this.message); // this is a temporary test change
    this.message = '';
  }

}
