import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';
import { AlertifyService } from './alertify.service';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;

  constructor(private alerts: AlertifyService) { }

  createHubConnection(user: User) {
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(this.hubUrl + 'presence', {
      accessTokenFactory: () => user.token
    }).build()

    this.hubConnection.start().catch(err => {
      console.log(err);
    });

    this.hubConnection.on('UserIsOnline', username => {
      this.alerts.message(username + ' has connected');
    })

    this.hubConnection.on('UserIsOffline', username => {
      this.alerts.error(username + ' has disconnected');
    });
  }

  stopHubConnection() {
    this.hubConnection.stop().catch(err => {
      console.log(err);
    });
  }
}
