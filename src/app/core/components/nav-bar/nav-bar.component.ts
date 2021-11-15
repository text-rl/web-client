import {Component, OnInit, Renderer2} from '@angular/core';
import {UserStateService} from "../../services/user-state.service";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import {FormBuilder} from "@angular/forms";
import {BehaviorSubject} from "rxjs";
import {PublicUser} from "../../../shared/models/users/responses";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styles: []
})
export class NavBarComponent implements OnInit {

  user$!: BehaviorSubject<PublicUser | null>;

  constructor(private userStateService: UserStateService,
              private authService: AuthenticationService,
              private _router: Router,
              private readonly _fb: FormBuilder,
              private readonly _renderer: Renderer2) {
  }

  ngOnInit(): void {
    this.user$ = this.userStateService.userSubject$;
  }

  onLogout(): void {
    this.userStateService.updateUser(null);
    this.authService.clearLocalUserData();
    this._router.navigate(['/login']);
  }

}
