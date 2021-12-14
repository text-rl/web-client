import {filter, Observable, Subject} from "rxjs";
import {NgZone} from "@angular/core";
import {EventSourcePolyfill} from "event-source-polyfill";
import {HttpClient} from "@angular/common/http";
import {ApiUrlService} from "./api-url.service";

declare type EventType = "onTreatmentDone"

interface Event<TData> {
  type?: EventType;
  data: TData;
}

export abstract class SseBaseService {


  protected url?: string;
  protected abstract readonly connectionTimeout: number;
  private eventSource!: EventSource | null;
  private allEvents$!: Subject<Event<any>>;
  protected tokenFactory?: () => string;

  protected constructor(protected readonly _zone: NgZone, private readonly _apiUrlService: ApiUrlService, urlSegment: string) {
    this._apiUrlService.apiUrl$.subscribe(url => {
      this.url = `${url}/${urlSegment}`
      if (this.isConnected) {
        this.restartConnection();
      }
    })
  }


  private connect() {
    const headers: { [name: string]: string } = {
      'Accept': 'text/event-stream',
    }
    if (this.tokenFactory) {
      headers['Authorization'] = this.tokenFactory()
    }
    if (this.url)
      this.eventSource = new EventSourcePolyfill(this.url, {
        heartbeatTimeout: this.connectionTimeout, headers
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
    return this.eventSource?.readyState == EventSource.OPEN;
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

  public restartConnection() {
    this.stopConnection();
    this.startConnection();
  }

  protected byType<TData>(type: EventType): Observable<Event<TData>> {
    return this.allEvents$.pipe(filter(e => e.type == type));
  }
}
