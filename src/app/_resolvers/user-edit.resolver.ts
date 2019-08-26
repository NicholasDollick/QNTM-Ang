import {Injectable } from '@angular/core';
import {Resolve, Router, ActivatedRouteSnapshot} from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';
import { User } from '../_models/user';

@Injectable()
export class UserEditResolver implements Resolve<User> {
    constructor(private userService: UserService, private router: Router,
        private alert: AlertifyService, private auth: AuthService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<User> {
        return this.userService.getUser(this.auth.decodedToken.nameid).pipe(
            catchError(error => {
                this.alert.error('Problem fetching data');
                this.router.navigate(['/chat']);
                return of(null);
            })
        );
    }
}
