import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  visibile: boolean;

constructor() { this.visibile = false; }

hide() {
  this.visibile = false;
}

show() {
  this.visibile = true;
}

toggle() {
  this.visibile = !this.visibile;
}

test() {
  console.log('does this fire?');
}

}
