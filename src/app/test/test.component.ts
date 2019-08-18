import { Component, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { UserService } from '../_services/user.service';
import { CryptoService } from '../_services/crypto.service';

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

  privateKey: string;
  publicKey: string;

  constructor(private user: UserService, private crypto: CryptoService) { }

  ngOnInit() {
    this.name = this.user.getUsername();
    this.privateKey = JSON.parse(sessionStorage.getItem('user'))['priv'];
    this.publicKey = JSON.parse(sessionStorage.getItem('user'))['pub'];

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
    this.hubConnection.on('RecievedMessage', async (data: string) => {
      // console.log(JSON.parse(data));
      console.log(data);
      // this.messages.push(JSON.parse(data));
      const message = await this.crypto.decrypt(data, this.publicKey, this.privateKey, 'asdf123');
      console.log(message);
      this.messages.push(JSON.parse(message));
    });
  }

sendMessage1() {
  this.hubConnection.invoke('sendToAll', this.name, this.message).catch(err => {
    console.error(err);
  });
}

sendMessage() {
  // this.hubConnection.invoke('chatMessages', JSON.stringify({username: this.name, msg: this.message, sentByMe: true}));
  this.hubConnection.invoke('SendMessageToGroup', 'PrivateChat', JSON.stringify({username: this.name, msg: this.message}));
  this.message = '';
}

async sendEncrypt() {
  const msg = this.message;
  this.message = '';
  const test = await this.crypto.encrypt(this.publicKey, this.privateKey, 'asdf123',
  JSON.stringify({username: this.name, msg: msg}));


  // console.log( await this.crypto.decrypt(test['data'], this.publicKey, this.privateKey, 'asdf123'));

  this.hubConnection.invoke('SendMessageToGroup', 'PrivateChat', test['data']);

}

joinGroup() {
  this.hubConnection.invoke('addToGroup', 'PrivateChat');
}

}
