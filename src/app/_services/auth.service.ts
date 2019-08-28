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
    console.log(user);
    if (user) {
      if (remember) {
        localStorage.setItem('token', user.token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('privKey', user.priv);
      }
      sessionStorage.setItem('token', user.token);
      sessionStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem('privKey', user.priv);
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
  let token: string;
  if (localStorage.getItem('token') === null) {
    token =  sessionStorage.getItem('token');
 } else {
  token =  localStorage.getItem('token');
 }

  return !this.jwtHelper.isTokenExpired(token);
}

getToken() {
  if (localStorage.getItem('token') === null) {
    return sessionStorage.getItem('token');
 } else {
  return localStorage.getItem('token');
 }
}

refreshToken() {
  this.decodedToken = this.jwtHelper.decodeToken(this.getToken());
}

}
