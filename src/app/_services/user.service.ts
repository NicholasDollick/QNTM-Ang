import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Message } from '../_models/message';
import { PaginatedResults } from '../_models/pagination';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

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
