import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of} from "rxjs";
import {PublicUser} from "../../shared/models/users/responses";
import {AuthenticationService} from "./authentication.service";
import * as _ from "lodash";

@Injectable({
  providedIn: 'root'
})
export class UserStateService {

  userSubject$ = new BehaviorSubject<PublicUser | null>(null);

  constructor(private authService: AuthenticationService) {
  }

  private _user: PublicUser | null = null;

  get user(): PublicUser | null {
    return _.cloneDeep(this._user);
  }

  loadUser$(): Observable<PublicUser | null> {
    if (!this._user && this.authService.getRememberMe()) {
      return this.reloadUser$();
    }
    return of(this.user);
  }

  loadUser(): void {
    if (!this._user && this.authService.getRememberMe()) {
      this.reloadUser();
    }
    if (this._user) {
      this.userSubject$.next(this.user);
    }
  }

  reloadUser(): void {
    this.reloadUser$().subscribe();
  }

  reloadUser$(): Observable<PublicUser> {
    return this.authService.getMe().pipe(map(user => {
      this._user = user;
      this.userSubject$.next(this.user);
      return user;
    }, catchError(err => {
      this._user = null;
      this.userSubject$.next(this.user);
      return of(null);
    })));
  }

  updateUser(user: PublicUser | null): void {
    this._user = user;
    this.userSubject$.next(this.user);
  }
}
