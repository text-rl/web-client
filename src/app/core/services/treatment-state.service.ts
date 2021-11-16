import {Injectable, NgZone} from '@angular/core';
import {from, map, Observable, of, Subject} from 'rxjs';
import {HubConnection, HubConnectionBuilder, HubConnectionState} from "@microsoft/signalr";
import {environment} from "../../../environments/environment";
import {AuthenticationService} from "./authentication.service";
import {UserStateService} from "./user-state.service";
import {TreatmentDoneEvent} from "../../shared/models/treatments/events";
import {NativeEventSource, EventSourcePolyfill} from "event-source-polyfill";

interface Event<TData> {
  type?: string;
  data: TData;
}

@Injectable({
  providedIn: 'root'
})
export class TreatmentStateService {


  public treatmentDone$ = new Subject<TreatmentDoneEvent>();
  private hubConnection!: HubConnection | null;
  private url = `${environment.apiUrl}/sse-texttreatment`;
  private readonly connectionTimeout = environment.realTimeConnectionTimeout;
  private eventSource!: EventSource | null;
  private allEvents$!: Subject<Event<any>>;

  constructor(private readonly _authService: AuthenticationService,
              private readonly _userStateService: UserStateService,
              private readonly _zone: NgZone) {
    this.listenUserChange();
  }

  private connect() {
    this.eventSource = new EventSourcePolyfill(this.url, {
      headers: {
        'Accept': 'text/event-stream',
        'Authorization': 'Bearer ' + this._authService.getToken()
      }
    });
  }



  private listenAllEvents() {
    this.allEvents$ = new Subject<Event<any>>();
    if (this.eventSource == null) return;
    this.eventSource.onmessage = event => {
      this._zone.run(() => {
        this.allEvents$.next((JSON).parse(event.data))
      })
    };
    this.eventSource.onerror = error => {
      this._zone.run(() => {
        this.allEvents$.error(error)
      })
    };
  }

  public get isConnected(): boolean {
    return this.hubConnection?.state === HubConnectionState.Connected;
  }

  public startConnection() {
    if (this.eventSource) {
      return;
    }
    this.connect();
    this.listenAllEvents();
  }

  public stopConnection() {
    this.eventSource?.close()
    this.eventSource = null;
  }

  public listenTreatmentDone(): void {
    this.allEvents$.subscribe(res =>
      this.treatmentDone$.next(res.data))
  }

  private listenUserChange(): void {
    this._userStateService.userSubject$.subscribe(user => {
      this.stopConnection();
      this.startConnection();
    });
  }
}
