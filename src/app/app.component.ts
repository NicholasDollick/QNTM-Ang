import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import { fader } from './route-animations';
import { RecaptchaComponent } from 'ng-recaptcha';
import { PresenceService } from './_services/presence.service';


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

export class AppComponent {
  title = 'QNTM';

  constructor(private presence: PresenceService) {}

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  setCurrentUser() {
  
  }
}

RecaptchaComponent.prototype.ngOnDestroy = function() {
  if (this.subscription) {
    this.subscription.unsubscribe();
  }
};

