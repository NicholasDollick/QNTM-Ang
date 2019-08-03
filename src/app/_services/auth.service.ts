import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { User } from '../_models/user';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.apiUrl + 'auth/';
  decodedToken: any;
  currentUser: User;
  authed: string;
  rememberMe: boolean;
  jwtHelper = new JwtHelperService();

constructor(private http: HttpClient) { }

login(model: any, remember: boolean) {
  return this.http.post(this.baseUrl + 'login', model)
  .pipe(map((response: any) => {
    const user = response;
    if (user) {
      console.log(user);
      if (remember) {
        localStorage.setItem('token', user.token);
        localStorage.setItem('user', JSON.stringify(user));
      }
      sessionStorage.setItem('token', user.token);
      sessionStorage.setItem('user', JSON.stringify(user));
      this.decodedToken = this.jwtHelper.decodeToken(user.token);
      this.currentUser = user.user;
    }
  })
  );
}

async verify(response: string) {
  const promise = new Promise((resolve, reject) => {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    this.http.post(this.baseUrl + 'verify', JSON.stringify(response), options)
    .toPromise()
    .then(
      res => {
       this.authed = res['result'];
       resolve(this.authed);
      }, msg => {
        reject(msg);
      }
    ).catch();
  });
  return promise;
}

async exists(model: any) {
  return await this.http.post(this.baseUrl + 'exists', model);
}

register(model: any) {
  return this.http.post(this.baseUrl + 'register', model);
}

loggedIn() {
  const token = localStorage.getItem('token');
  return !this.jwtHelper.isTokenExpired(token);
}

}
