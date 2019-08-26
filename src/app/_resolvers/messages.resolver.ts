import {Injectable, Inject} from '@angular/core';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
import { Message } from '../_models/message';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class MessagesResolver implements Resolve<Message[]> {
    public pageNumber = 1;
    public pageSize = 5;
    public messageContainer = 'Unread';

    constructor(private userService: UserService, private router: Router, private alert: AlertifyService,
        private auth: AuthService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
        return this.userService.getMessages(this.auth.decodedToken.nameid, this.pageNumber, this.pageSize, this.messageContainer).pipe(
            catchError(error => {
                this.alert.error('Problem fetching data');
                this.router.navigate(['/home']);
                return of(null);
            })
        );
    }
}
