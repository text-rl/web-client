import {Injectable} from '@angular/core';
import {UserStateService} from "../services/user-state.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private readonly _userStateService: UserStateService, public router: Router) {
  }

  canActivate(): Observable<boolean> {
    return new Observable<boolean>(obs => {
      this._userStateService.loadUser$().subscribe(user => {
        if (user) {
          return obs.next(true);
        }
        this.router.navigateByUrl('/login');
        return obs.next(false);
      });
    });
  }
}
