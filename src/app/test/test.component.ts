import { Component, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';

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

  constructor() { }

  ngOnInit() {

    this.name = window.prompt('Your name:', 'Jon');
    this.hubConnection = new HubConnectionBuilder().withUrl('http://localhost:5000/chat').build();
    this.hubConnection.start().then(() => {
      console.log('Connection Started');
    }).catch(err => {
      console.log('Error starting connection');
    });
    this.hubConnection.on('sendToAll', (name: string, message: string) => {
      const text = `${name}: ${message}`;
      this.messages.push(text);
    });
  }

sendMessage() {
  this.hubConnection.invoke('sendToAll', this.name, this.message).catch(err => {
    console.error(err);
  });
}

}
