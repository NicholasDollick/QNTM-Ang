import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Message } from '../_models/message';
import { PaginatedResults } from '../_models/pagination';
import { Observable } from 'rxjs';
import { User } from '../_models/user';


@Injectable({
  providedIn: 'root'
})

export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + 'users');
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'users/' + id);
  }

  getAuthedUser(id: number): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'users/' + id + '/update');
  }

  findUser(username: string): Observable<User> {
    return this.http.get<User>(this.baseUrl + 'users/find/' + username);
  }

  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + 'users/' + id, user);
  }

  getChats(id: number) {
    return this.http.get(this.baseUrl + 'users/' + id + '/chats/getchats');
  }

  createChat(id: number, model: any) {
    return this.http.post(this.baseUrl + 'users/' + id + '/chats', model);
  }

  getCurrentUser(): User {
      if (localStorage.getItem('user') === null) {
        return JSON.parse(sessionStorage.getItem('user'))['user'];
     } else {
       return JSON.parse(localStorage.getItem('user'))['user'];
     }
  }

  setMainPhoto(userId: number, id: number) {
    return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain', {});
  }

  getMessages(id: number, page?, itemsPerPage?, messageContainer?) {
    const paginatedResults: PaginatedResults<Message[]> = new PaginatedResults<Message[]>();

    let params = new HttpParams();

    params = params.append('MessageContainer', messageContainer);

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    return this.http.get<Message[]>(this.baseUrl + 'users/' + id + '/messages', {observe: 'response', params})
    .pipe(map(res => {
      paginatedResults.result = res.body;
      if (res.headers.get('Pagination') !== null) {
        paginatedResults.pagination = JSON.parse(res.headers.get('Pagination'));
      }
      return paginatedResults;
    }));
  }
}
