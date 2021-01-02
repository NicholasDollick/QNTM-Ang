import { Component, OnInit } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import { fader } from './route-animations';
import { RecaptchaComponent } from 'ng-recaptcha';
import { PresenceService } from './_services/presence.service';
import { User } from './_models/user';
import { AuthService } from './_services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    fader,
    // slider,
    // transformer,
    // stepper
  ]
})

export class AppComponent implements OnInit{
  title = 'QNTM';

  constructor(private presence: PresenceService, private accountService: AuthService) {}
 
  ngOnInit(): void {
    this.setCurrentUser();
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  // im not sure if this is for sure the correct way of verifying...but it works lol
  setCurrentUser() {
    // let user: User = JSON.parse(localStorage.getItem('user'));
    let user: User;
    if(JSON.parse(localStorage.getItem('user')) === null)
    {
      console.log('user did not exist in localStorage');
      user = JSON.parse(sessionStorage.getItem('user'))['user'];
    }
    else
      user = JSON.parse(localStorage.getItem('user'))['user'];
    console.log(user);
    this.accountService.setCurrentUser(user);
  }
}

RecaptchaComponent.prototype.ngOnDestroy = function() {
  if (this.subscription) {
    this.subscription.unsubscribe();
  }
};

