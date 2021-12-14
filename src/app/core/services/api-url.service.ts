import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ApiUrlService {
  apiUrl$ = new BehaviorSubject<string>(this.apiUrl)

  constructor() {

  }

  set apiUrl(url: string) {
    localStorage.setItem(environment.webStorageApiUrlKey, url);
    this.apiUrl$.next(url);
  }

  get apiUrl(): string {
    return localStorage.getItem(environment.webStorageApiUrlKey) ?? environment.apiUrl
  }
}
