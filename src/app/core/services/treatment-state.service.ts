import {Injectable, NgZone} from '@angular/core';
import {Subject} from 'rxjs';
import {environment} from "../../../environments/environment";
import {AuthenticationService} from "./authentication.service";
import {UserStateService} from "./user-state.service";
import {TreatmentDoneEvent} from "../../shared/models/treatments/events";
import {SseBaseService} from "./sse-base.service";

@Injectable({
  providedIn: 'root'
})
export class TreatmentStateService extends SseBaseService {

  public treatmentDone$ = new Subject<TreatmentDoneEvent>();
  protected url = `${environment.apiUrl}/sse-texttreatment`;
  protected readonly connectionTimeout = environment.realTimeConnectionTimeout;

  constructor(private _authService: AuthenticationService,
              private _userStateService: UserStateService,
              _zone: NgZone) {
    super(_zone);
    this.tokenFactory = () => `Bearer ${this._authService.getToken()}`;
    this.listenUserChange();
  }

  public listenTreatmentDone(): void {
    this.byType<TreatmentDoneEvent>("onTreatmentDone").subscribe(e => this.treatmentDone$.next(e.data))
  }

  private listenUserChange(): void {
    this._userStateService.userSubject$.subscribe(user => {
      this.stopConnection();
      this.startConnection();
    });
  }
}
