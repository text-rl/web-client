import {Injectable, NgZone} from '@angular/core';
import {from, Observable, of, Subject} from 'rxjs';
import {HubConnection, HubConnectionBuilder, HubConnectionState} from "@microsoft/signalr";
import {environment} from "../../../environments/environment";
import {AuthenticationService} from "./authentication.service";
import {UserStateService} from "./user-state.service";
import {TreatmentDoneEvent} from "../../shared/models/treatments/events";

@Injectable({
  providedIn: 'root'
})
export class TreatmentStateService {

  public treatmentDone$ = new Subject<TreatmentDoneEvent>();
  private hubConnection!: HubConnection | null;
  private hubUrl = `${environment.apiUrl}/texttreatmenthub`;
  private readonly connectionTimeout = environment.realTimeConnectionTimeout;
  private readonly onTextTreatmentDone = 'OnTextTreatmentDone';

  constructor(private readonly _authService: AuthenticationService,
              private readonly _userStateService: UserStateService,
              private readonly _zone: NgZone) {
    this.listenUserChange();
  }

  public get isConnected(): boolean {
    return this.hubConnection?.state === HubConnectionState.Connected;
  }

  public startConnection(): Observable<any> {
    if (this.hubConnection) {
      return of(null);
    }

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl, {accessTokenFactory: () => this._authService.getToken() ?? ''})
      .build();
    this.hubConnection.serverTimeoutInMilliseconds = this.connectionTimeout;
    this._userStateService.userSubject$.subscribe(user => {
      if (user == null) {
        this.stopConnection().subscribe();
      }
    });
    return from(this.hubConnection.start());
  }


  public stopConnection(): Observable<any> {
    const stopConnection$ = from(this.hubConnection ? this.hubConnection.stop() : of(null));
    this.hubConnection = null;
    return stopConnection$;
  }

  public listenTreatmentDone(): void {
    this.hubConnection?.on(this.onTextTreatmentDone, (event: TreatmentDoneEvent) => {
      console.log("EVENT", event);
      this._zone.run(() => this.treatmentDone$.next(event));
    });
  }

  private listenUserChange(): void {
    this._userStateService.userSubject$.subscribe(user => {
      this.startConnection().subscribe(_ => {
        this.listenTreatmentDone();
      });
    });
  }
}
