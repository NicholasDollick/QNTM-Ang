import { Component, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { UserService } from '../_services/user.service';
import { CryptoService } from '../_services/crypto.service';
import { Onlineuser } from '../_models/onlineuser';
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
  toUser = '';
  messages: string[] = [];

  conversations: any;
  selectedConversation: any;
  text: string;
  events: Array<any> = [];

  privateKey: string;
  publicKey: string;

  constructor(private user: UserService, private crypto: CryptoService, private auth: AuthService) { }

  ngOnInit() {
    this.name = this.user.getCurrentUser()['username'];
    this.privateKey = JSON.parse(sessionStorage.getItem('user'))['priv'];
    this.publicKey = JSON.parse(sessionStorage.getItem('user'))['pub'];
    const token = '?token=' + this.auth.getToken();

    this.hubConnection = new HubConnectionBuilder().withUrl('http://localhost:5000/pm' + token).build();
    this.hubConnection.start().then(() => {
      console.log('Connection Started');
      this.hubConnection.invoke('Join');
    }).catch(err => {
      console.log('Error starting connection');
      this.hubConnection.invoke('Leave');
    });

    this.hubConnection.on('SendPm', (data: string) => {
      console.log(JSON.parse(data));
      this.messages.push(JSON.parse(data));
    });

    this.hubConnection.on('Joined', (onlineUser: Onlineuser) => {
      console.log('Joined received');
      // this.store.dispatch(new directMessagesActions.JoinSent());
      console.log(onlineUser);
  });

  this.hubConnection.on('NewOnlineUser', (onlineUser: Onlineuser) => {
    console.log('NewOnlineUser received');
    console.log(onlineUser);
    // this.store.dispatch(new directMessagesActions.ReceivedNewOnlineUser(onlineUser));
});
    this.hubConnection.on('OnlineUsers', (onlineUsers: Onlineuser[]) => {
      console.log('OnlineUsers received');
      console.log(onlineUsers);
  });
  }


async sendEncrypt() {
  const msg = this.message;
  this.message = '';
  const test = await this.crypto.encrypt(this.publicKey, this.privateKey, 'asdf123',
  JSON.stringify({username: this.name, msg: msg}));


  // console.log( await this.crypto.decrypt(test['data'], this.publicKey, this.privateKey, 'asdf123'));

  this.hubConnection.invoke('SendMessageToGroup', 'PrivateChat', test['data']);

}

sendDirect() {
  // push your own message for display
  this.messages.push(JSON.parse(`{"username": "${this.name}", "msg": "${this.message}"}`));
  // send direct message to specified user
  this.hubConnection.invoke('SendDirectMessage', this.toUser, JSON.stringify({username: this.name, msg: this.message}));
  this.message = '';
}

joinGroup() {
  this.hubConnection.invoke('addToGroup', 'PrivateChat');
}

}
