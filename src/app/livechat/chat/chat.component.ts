import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { UserService } from '../../_services/user.service';
import { User } from 'src/app/_models/user';
import { Onlineuser } from 'src/app/_models/onlineuser';
import { AuthService } from 'src/app/_services/auth.service';
import { CryptoService } from 'src/app/_services/crypto.service';
import { MessageService } from 'src/app/_services/message.service';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  name = '';
  message = '';
  messages: string[] = [];
  toUser = '';

  @Input() photoUrl: string;
  @Input() currentUser: User;
  @Input() chattingWith: string;
  @ViewChild('msgList') msgHist: ElementRef;

  private publicKey: string;

  constructor(private user: UserService, private auth: AuthService, 
    private crypto: CryptoService, private messageService: MessageService, 
    private presenceServcie: PresenceService) { 

    }

  ngOnInit() {
    this.toUser = this.chattingWith;
    this.name = this.currentUser.username;
    this.publicKey = JSON.parse(sessionStorage.getItem('user'))['pub'];
    const token = '?token=' + this.auth.getToken();

    this.messages.push(`Chatting with: ${this.chattingWith}`);
    this.messageService.createHubConnection(this.currentUser, this.chattingWith);
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  sendMessage(): void {
    console.log("in here ONE");
    // this.hubConnection.invoke('chatMessages', JSON.stringify({username: this.name, msg: this.message, photoUrl: this.photoUrl}));
    // this.messages.push(this.message); // this is a temporary test change
    this.messageService.sendMessage(this.currentUser.username, this.message)
    .then(() => this.message = '');
  }

  private scrollToBottom(): void {
    this.msgHist.nativeElement.scrollTop = this.msgHist.nativeElement.scrollHeight;
  }

  
async sendEncrypt() {
  console.log("in here TWO");
  const msg = this.message;
  this.message = '';
  // the method below doesnt make much sense as thats a hardcoded test password.
  // there has to be a better way to store the key already returned into object form
  const test = await this.crypto.encrypt(this.publicKey, JSON.stringify({username: this.name, msg: msg}));

  this.messageService.sendMessage(this.currentUser.username, test['data'])
  .then(() => this.message = '');
  // console.log( await this.crypto.decrypt(test['data'], this.publicKey, this.privateKey, 'asdf123'));

  // this.hubConnection.invoke('SendMessageToGroup', 'PrivateChat', test['data']);

}

sendDirect() {
  console.log("in here THREE");
  // push your own message for display
  this.messages.push(JSON.parse(`{"username": "${this.name}", "msg": "${this.message}"}`));
  // send direct message to specified user
  // this.hubConnection.invoke('SendDirectMessage', this.toUser, JSON.stringify({username: this.name, msg: this.message}));
  this.message = '';
}

}
