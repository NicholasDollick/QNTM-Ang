import { Component, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  private hubConnection: HubConnection;
  name = '';
  message = '';
  messages: string[] = [];

  conversations: any;
  selectedConversation: any;
  text: string;
  events: Array<any> = [];

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
    /*
    this.hubConnection.on('sendToAll', (name: string, message: string) => {
      const text = `${name}: ${message}`;
      if (name !== this.name) {
        console.log('this wasnt my message');
      } else {
        console.log('this was my message');
      }
      const test = JSON.stringify({username: name, msg: message, sentByMe: true});
      this.messages.push(JSON.parse(test));
    });

    */
    this.hubConnection.on('chatMessages', (data: string) => {
      console.log(JSON.parse(data));
      this.messages.push(JSON.parse(data));
    });
  }

sendMessage1() {
  this.hubConnection.invoke('sendToAll', this.name, this.message).catch(err => {
    console.error(err);
  });
}

sendMessage() {
  this.hubConnection.invoke('chatMessages', JSON.stringify({username: this.name, msg: this.message, sentByMe: true}));
  this.message = '';
}

}
