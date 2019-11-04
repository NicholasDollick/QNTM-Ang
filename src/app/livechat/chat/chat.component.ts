import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { UserService } from '../../_services/user.service';
import { User } from 'src/app/_models/user';
import { Onlineuser } from 'src/app/_models/onlineuser';
import { AuthService } from 'src/app/_services/auth.service';
import { CryptoService } from 'src/app/_services/crypto.service';

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
  toUser = '';

  @Input() photoUrl: string;
  @Input() currentUser: User;
  @Input() chattingWith: string;
  @ViewChild('msgList') msgHist: ElementRef;

  private privateKey: string;
  private publicKey: string;

  constructor(private user: UserService, private auth: AuthService, private crypto: CryptoService) { }

  ngOnInit() {
    this.toUser = this.chattingWith;
    this.name = this.currentUser.username;
    this.privateKey = JSON.parse(sessionStorage.getItem('user'))['priv'];
    this.publicKey = JSON.parse(sessionStorage.getItem('user'))['pub'];
    const token = '?token=' + this.auth.getToken();

    this.messages.push(`Chatting with: ${this.chattingWith}`);
    console.log(`Chatting with: ${this.chattingWith}`);
    console.log(this.currentUser);
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

  sendMessage(): void {
    this.hubConnection.invoke('chatMessages', JSON.stringify({username: this.name, msg: this.message, photoUrl: this.photoUrl}));
    // this.messages.push(this.message); // this is a temporary test change
    this.message = '';
  }

  private scrollToBottom(): void {
    this.msgHist.nativeElement.scrollTop = this.msgHist.nativeElement.scrollHeight;
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
