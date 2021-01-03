import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Message } from '../_models/message';
import { User } from '../_models/user';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  constructor() { }

  createHubConnection(user: User, otherUser: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'chat?user=' + otherUser +'&from=' + user.username, {
        accessTokenFactory: () => user.token
      }).build()
      

      this.hubConnection.start().catch(err => console.log(err));

      this.hubConnection.on('ReceiveMessageThread', messages => {
        console.log("fetched");
        this.messageThreadSource.next(messages);
      })

      this.hubConnection.on('NewMessage', message => {
        this.messageThread$.pipe(take(1)).subscribe(messages => {
          this.messageThreadSource.next([...messages, message])
        });
      })
  }

  async sendMessage(fromUsername: string, toUsername: string,content: string) {
    return this.hubConnection.invoke('SendMessage', {senderUsername: fromUsername,recipientUsername: toUsername, content})
    .catch(err => console.log(err));
  }

  stopHubConnection() {
    console.log("wut");
    if(this.hubConnection) {
      console.log("shutting down");
      this.hubConnection.stop();
    }
  }
}
