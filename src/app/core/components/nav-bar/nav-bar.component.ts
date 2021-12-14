import {Component, OnInit, Renderer2} from '@angular/core';
import {UserStateService} from "../../services/user-state.service";
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/authentication.service";
import {FormBuilder, FormControl} from "@angular/forms";
import {BehaviorSubject, debounceTime} from "rxjs";
import {PublicUser} from "../../../shared/models/users/responses";
import {environment} from "../../../../environments/environment";
import {ApiUrlService} from "../../services/api-url.service";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styles: []
})
export class NavBarComponent implements OnInit {

  user$!: BehaviorSubject<PublicUser | null>;
  apiUrlCtrl!: FormControl

  constructor(private userStateService: UserStateService,
              private authService: AuthenticationService,
              private _router: Router,
              private readonly _apiUrlService: ApiUrlService,
              private readonly _fb: FormBuilder,
              private readonly _renderer: Renderer2) {
  }


  ngOnInit(): void {
    this.user$ = this.userStateService.userSubject$;
    this.apiUrlCtrl = this._fb.control(this._apiUrlService.apiUrl)
    this._apiUrlService.apiUrl$.subscribe(url => {
      if (this.apiUrlCtrl.value !== url) {
        this.apiUrlCtrl.setValue(url)
      }
    })
    this.apiUrlCtrl.valueChanges.pipe(debounceTime(2000)).subscribe(url => this._apiUrlService.apiUrl = url);
  }

  onLogout(): void {
    this.userStateService.updateUser(null);
    this.authService.clearLocalUserData();
    this._router.navigate(['/login']);
  }

}
